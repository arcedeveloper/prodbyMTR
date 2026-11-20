import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import Mailjet from 'node-mailjet';
import pg from 'pg';
import { productos } from './productos.js';

dotenv.config();

// ==================== CONFIGURACIÓN ====================
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = (process.env.FRONTEND_URL || '').replace(/\/+$/, '');
const MAIL_FROM = process.env.MAIL_FROM || 'matirodas50@gmail.com';
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'ProdByMTR';
const AVISO_VENTAS_EMAIL = process.env.AVISO_VENTAS_EMAIL || MAIL_FROM;
const CONTACTO_WHATSAPP = '+595 983 775018';
const ZONA_HORARIA = 'America/Asuncion';

const faltantes = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'DATABASE_URL', 'FRONTEND_URL',
  'MAILJET_API_KEY', 'MAILJET_SECRET_KEY', 'ADMIN_PASSWORD'].filter((k) => !process.env[k]);
if (faltantes.length) {
  console.warn(`⚠️  Variables de entorno sin configurar: ${faltantes.join(', ')}`);
}

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_falta_configurar');
const mailjet = process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY
  ? Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)
  : null;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

// ==================== BASE DE DATOS ====================
// Crea la tabla si no existe y agrega columnas que falten. Se puede correr las veces que sea.
async function prepararBaseDeDatos() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        producto_id TEXT NOT NULL,
        producto_nombre TEXT NOT NULL,
        precio_pagado NUMERIC(10,2) NOT NULL,
        cliente_email TEXT,
        stripe_session_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        descarga_enviada BOOLEAN NOT NULL DEFAULT false,
        creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pool.query(`
      ALTER TABLE pedidos
        ADD COLUMN IF NOT EXISTS cliente_email TEXT,
        ADD COLUMN IF NOT EXISTS descarga_enviada BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `);
    await pool.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS pedidos_stripe_session_id_key ON pedidos (stripe_session_id)'
    );
    console.log('✅ Base de datos lista (tabla pedidos)');
  } catch (error) {
    console.error('❌ No se pudo preparar la base de datos:', error.message);
  }
}

// ==================== EMAILS ====================
const fechaHoy = () => new Date().toLocaleDateString('es-PY', { timeZone: ZONA_HORARIA });

async function enviarEmailsDeCompra({ email, producto, monto }) {
  if (!mailjet) {
    console.warn('⚠️  Mailjet sin configurar: no se envió el email de descarga');
    return false;
  }

  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: { Email: MAIL_FROM, Name: MAIL_FROM_NAME },
        To: [{ Email: email }],
        Subject: `Tu descarga de ${producto.nombre} está lista`,
        HTMLPart: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1424;">
            <h1 style="font-size: 24px;">¡Gracias por tu compra!</h1>
            <p>Compraste <strong>${producto.nombre}</strong> por <strong>$${monto} USD</strong> el ${fechaHoy()}.</p>
            <p style="margin: 28px 0;">
              <a href="${producto.descargaUrl}" target="_blank"
                 style="background: #2ee8c4; color: #1a1424; padding: 14px 26px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Descargar ${producto.nombre}
              </a>
            </p>
            <p style="color: #555; font-size: 14px;">Guardá este email: el enlace es tu acceso a la descarga.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 28px 0;">
            <p style="font-size: 14px;">¿Problemas con la descarga? Respondé este email o escribime por WhatsApp al ${CONTACTO_WHATSAPP}.</p>
          </div>
        `
      },
      {
        From: { Email: MAIL_FROM, Name: MAIL_FROM_NAME },
        To: [{ Email: AVISO_VENTAS_EMAIL }],
        Subject: `Nueva venta: ${producto.nombre} ($${monto} USD)`,
        HTMLPart: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Nueva venta</h2>
            <p><strong>Producto:</strong> ${producto.nombre}</p>
            <p><strong>Monto:</strong> $${monto} USD</p>
            <p><strong>Cliente:</strong> ${email}</p>
            <p><strong>Fecha:</strong> ${fechaHoy()}</p>
          </div>
        `
      }
    ]
  });
  return true;
}

// ==================== WEBHOOK DE STRIPE ====================
// Va antes de express.json() porque Stripe necesita el cuerpo sin procesar para verificar la firma.
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Firma de webhook inválida:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const pagoConfirmado =
    (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') ||
    event.type === 'checkout.session.async_payment_succeeded';

  if (!pagoConfirmado) return res.json({ received: true });

  const session = event.data.object;
  const productId = session.metadata?.product_id;
  const producto = productos[productId];
  const email = session.customer_details?.email;
  const monto = ((session.amount_total ?? producto?.precio ?? 0) / 100).toFixed(2);

  if (!producto || !email) {
    console.error(`❌ Pago ${session.id} sin producto o email válido (producto: ${productId})`);
    return res.json({ received: true });
  }

  console.log(`💰 Pago confirmado: ${producto.nombre} - ${email}`);

  // Guarda o actualiza el pedido. Si la base falla, el email se envía igual.
  let yaEnviado = false;
  try {
    const { rows } = await pool.query(
      `INSERT INTO pedidos (producto_id, producto_nombre, precio_pagado, stripe_session_id, cliente_email, status)
       VALUES ($1, $2, $3, $4, $5, 'completed')
       ON CONFLICT (stripe_session_id) DO UPDATE
         SET status = 'completed', cliente_email = EXCLUDED.cliente_email, actualizado_en = NOW()
       RETURNING descarga_enviada`,
      [productId, producto.nombre, monto, session.id, email]
    );
    yaEnviado = rows[0]?.descarga_enviada === true;
  } catch (dbError) {
    console.error('⚠️  No se pudo guardar el pedido, se envía el email igual:', dbError.message);
  }

  // Stripe a veces repite el aviso: si ya se mandó la descarga, no se manda dos veces.
  if (yaEnviado) return res.json({ received: true });

  try {
    const enviado = await enviarEmailsDeCompra({ email, producto, monto });
    if (enviado) {
      await pool.query(
        'UPDATE pedidos SET descarga_enviada = true, actualizado_en = NOW() WHERE stripe_session_id = $1',
        [session.id]
      ).catch((e) => console.error('⚠️  No se pudo marcar la descarga como enviada:', e.message));
      console.log(`✅ Descarga enviada a ${email}`);
    }
    res.json({ received: true });
  } catch (mailError) {
    // Responder con error hace que Stripe reintente el aviso más tarde.
    console.error('❌ Error enviando el email de descarga:', mailError.message);
    res.status(500).json({ error: 'No se pudo enviar el email' });
  }
});

// ==================== MIDDLEWARE ====================
const origenesPermitidos = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean)
]);
try {
  if (FRONTEND_URL) origenesPermitidos.add(new URL(FRONTEND_URL).origin);
} catch {
  console.warn('⚠️  FRONTEND_URL no es una dirección válida:', FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || origenesPermitidos.has(origin))
}));
app.use(express.json());

// Protección con usuario y contraseña para el panel y los datos de pedidos.
function soloAdmin(req, res, next) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return res.status(503).send('Panel desactivado: configurá ADMIN_PASSWORD en las variables de entorno.');
  }
  const [tipo, credenciales] = (req.headers.authorization || '').split(' ');
  if (tipo === 'Basic' && credenciales) {
    const [usuario, clave] = Buffer.from(credenciales, 'base64').toString().split(':');
    if (usuario === (process.env.ADMIN_USER || 'admin') && clave === password) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Panel ProdByMTR", charset="UTF-8"');
  res.status(401).send('Necesitás usuario y contraseña para ver esta página.');
}

const escaparHtml = (texto) =>
  String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ==================== ENDPOINTS PÚBLICOS ====================
app.get('/', (req, res) => res.json({ service: 'ProdByMTR Backend', status: 'OK' }));

// Sirve para despertar el servidor y para monitores de disponibilidad.
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/crear-pago', async (req, res) => {
  const { productId } = req.body || {};
  const producto = productos[productId];

  if (!producto) {
    return res.status(400).json({ success: false, message: 'Ese producto no existe.' });
  }

  const base = FRONTEND_URL || (req.get('origin') || '').replace(/\/+$/, '');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: producto.nombre, description: 'Producto digital de ProdByMTR, descarga por email' },
          unit_amount: producto.precio
        },
        quantity: 1
      }],
      allow_promotion_codes: true,
      success_url: `${base}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?pago=cancelado#productos`,
      metadata: { product_id: productId },
      expires_at: Math.floor(Date.now() / 1000) + 1800
    });

    pool.query(
      `INSERT INTO pedidos (producto_id, producto_nombre, precio_pagado, stripe_session_id, status)
       VALUES ($1, $2, $3, $4, 'pending') ON CONFLICT (stripe_session_id) DO NOTHING`,
      [productId, producto.nombre, (producto.precio / 100).toFixed(2), session.id]
    ).catch((e) => console.warn('⚠️  Pedido pendiente no guardado:', e.message));

    console.log(`🛒 Pago iniciado: ${producto.nombre} (${session.id})`);
    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creando el pago:', error.message);
    const sinConexion = error.type === 'StripeConnectionError';
    res.status(sinConexion ? 503 : 500).json({
      success: false,
      message: sinConexion
        ? 'No se pudo conectar con el sistema de pagos. Probá de nuevo en un minuto.'
        : 'No se pudo iniciar el pago. Probá de nuevo o escribime por WhatsApp.'
    });
  }
});

// Lo usa la pantalla de pago confirmado para mostrar qué se compró y a qué email llega la descarga.
app.get('/api/verificar-sesion/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return res.status(400).json({ error: 'Sesión inválida' });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      completed: session.payment_status === 'paid',
      email: session.customer_details?.email || null,
      producto: productos[session.metadata?.product_id]?.nombre || null
    });
  } catch {
    res.status(404).json({ error: 'Sesión no encontrada' });
  }
});

// ==================== PANEL DE ADMINISTRACIÓN ====================
app.get('/api/pedidos', soloAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pedidos ORDER BY creado_en DESC LIMIT 100');
    res.json({ success: true, pedidos: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/admin/keepalive-panel', (req, res) => res.redirect(301, '/admin'));

app.get('/admin', soloAdmin, async (req, res) => {
  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;
  const fecha = (d) => new Date(d).toLocaleString('es-PY', { timeZone: ZONA_HORARIA, dateStyle: 'short', timeStyle: 'short' });

  try {
    const [mes, total, porProducto, ultimos] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS ventas, COALESCE(SUM(precio_pagado), 0) AS ingresos FROM pedidos
                  WHERE status = 'completed' AND creado_en >= (DATE_TRUNC('month', NOW() AT TIME ZONE '${ZONA_HORARIA}') AT TIME ZONE '${ZONA_HORARIA}')`),
      pool.query(`SELECT COUNT(*) AS ventas, COALESCE(SUM(precio_pagado), 0) AS ingresos FROM pedidos WHERE status = 'completed'`),
      pool.query(`SELECT producto_nombre, COUNT(*) AS cantidad, SUM(precio_pagado) AS total FROM pedidos
                  WHERE status = 'completed' GROUP BY producto_nombre ORDER BY total DESC`),
      pool.query(`SELECT producto_nombre, precio_pagado, cliente_email, status, descarga_enviada, creado_en
                  FROM pedidos ORDER BY creado_en DESC LIMIT 25`)
    ]);

    const filasProductos = porProducto.rows.map((p) => `
      <tr><td>${escaparHtml(p.producto_nombre)}</td><td>${p.cantidad}</td><td>${fmt(p.total)}</td></tr>`).join('');

    const filasPedidos = ultimos.rows.map((p) => `
      <tr>
        <td>${fecha(p.creado_en)}</td>
        <td>${escaparHtml(p.producto_nombre)}</td>
        <td>${fmt(p.precio_pagado)}</td>
        <td>${escaparHtml(p.cliente_email || '—')}</td>
        <td><span class="estado ${p.status === 'completed' ? 'ok' : ''}">${p.status === 'completed' ? 'Pagado' : 'Sin pagar'}</span></td>
        <td>${p.status === 'completed' ? (p.descarga_enviada ? 'Enviada' : 'Pendiente') : '—'}</td>
      </tr>`).join('');

    res.send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Panel ProdByMTR</title>
<style>
  body { margin: 0; background: #1a1424; color: #f2ecf7; font: 15px/1.5 system-ui, sans-serif; padding: 24px 16px; }
  main { max-width: 960px; margin: 0 auto; }
  h1 { margin: 0 0 4px; } h2 { margin: 36px 0 12px; font-size: 18px; }
  .sub { color: #a99bb8; margin: 0 0 24px; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
  .kpi { background: #261d33; border-radius: 10px; padding: 16px; }
  .kpi b { display: block; font-size: 28px; } .kpi span { color: #a99bb8; }
  .tabla { overflow-x: auto; background: #261d33; border-radius: 10px; }
  table { width: 100%; border-collapse: collapse; min-width: 560px; }
  th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid #3a2f4a; }
  th { color: #a99bb8; font-weight: 600; }
  .estado { padding: 2px 8px; border-radius: 999px; background: #3a2f4a; font-size: 13px; }
  .estado.ok { background: #2ee8c4; color: #1a1424; }
  .vacio { padding: 16px; color: #a99bb8; }
</style></head>
<body><main>
  <h1>Panel ProdByMTR</h1>
  <p class="sub">Actualizado ${fecha(new Date())}</p>
  <div class="kpis">
    <div class="kpi"><span>Ventas este mes</span><b>${mes.rows[0].ventas}</b></div>
    <div class="kpi"><span>Ingresos este mes</span><b>${fmt(mes.rows[0].ingresos)}</b></div>
    <div class="kpi"><span>Ventas totales</span><b>${total.rows[0].ventas}</b></div>
    <div class="kpi"><span>Ingresos totales</span><b>${fmt(total.rows[0].ingresos)}</b></div>
  </div>
  <h2>Ventas por producto</h2>
  <div class="tabla">${filasProductos
    ? `<table><thead><tr><th>Producto</th><th>Ventas</th><th>Total</th></tr></thead><tbody>${filasProductos}</tbody></table>`
    : '<p class="vacio">Todavía no hay ventas.</p>'}</div>
  <h2>Últimos pedidos</h2>
  <div class="tabla">${filasPedidos
    ? `<table><thead><tr><th>Fecha</th><th>Producto</th><th>Monto</th><th>Cliente</th><th>Pago</th><th>Descarga</th></tr></thead><tbody>${filasPedidos}</tbody></table>`
    : '<p class="vacio">Todavía no hay pedidos.</p>'}</div>
</main></body></html>`);
  } catch (error) {
    res.status(500).send(`No se pudo cargar el panel: ${escaparHtml(error.message)}`);
  }
});

// ==================== INICIAR ====================
app.listen(PORT, () => {
  console.log(`🚀 ProdByMTR backend en el puerto ${PORT}`);
  console.log(`💳 Stripe en ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'MODO REAL' : 'MODO PRUEBA'}`);
  console.log(`🌍 Frontend: ${FRONTEND_URL || '(sin configurar)'}`);
  console.log(`📦 Productos: ${Object.keys(productos).length}`);
  prepararBaseDeDatos();
});
