import { OrderItem, Empresa } from '../types'

interface SendOrderEmailParams {
  empresa: Empresa
  items: OrderItem[]
  observaciones: string
  pedidoId: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function buildEmailHtml(params: SendOrderEmailParams): string {
  const { empresa, items, observaciones } = params
  const total = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0)
  const fecha = formatDate()

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${item.producto.nombre}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.cantidad}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;">${formatPrice(item.producto.precio)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;">${formatPrice(item.producto.precio * item.cantidad)}</td>
      </tr>
    `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"/></head>
    <body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f8fafc;margin:0;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:#02baff;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">🎁 Nuevo Pedido — Mundo Barrilete</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#1a1a2e;margin:0 0 4px;"><strong>Empresa:</strong> ${empresa.nombre}</p>
          ${empresa.email_contacto ? `<p style="color:#1a1a2e;margin:0 0 16px;"><strong>Email:</strong> ${empresa.email_contacto}</p>` : ''}
          <p style="color:#64748b;margin:0 0 24px;font-size:14px;">Fecha: ${fecha}</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:10px 12px;text-align:left;font-size:13px;color:#64748b;font-weight:600;">Producto</th>
                <th style="padding:10px 12px;text-align:center;font-size:13px;color:#64748b;font-weight:600;">Cant.</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#64748b;font-weight:600;">P. Unit.</th>
                <th style="padding:10px 12px;text-align:right;font-size:13px;color:#64748b;font-weight:600;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:12px;text-align:right;font-weight:700;font-size:16px;">Total:</td>
                <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;color:#02baff;">${formatPrice(total)}</td>
              </tr>
            </tfoot>
          </table>

          ${
            observaciones
              ? `<div style="background:#f8fafc;border-left:4px solid #02baff;padding:16px;border-radius:4px;margin-bottom:24px;">
              <p style="margin:0;font-weight:600;color:#1a1a2e;">Observaciones:</p>
              <p style="margin:8px 0 0;color:#475569;">${observaciones}</p>
            </div>`
              : ''
          }

          <p style="color:#94a3b8;font-size:12px;margin:0;">
            Este email fue generado automáticamente por el catálogo digital de Mundo Barrilete.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendOrderEmail(params: SendOrderEmailParams): Promise<void> {
  const { empresa } = params
  const fecha = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'mundobarriletesj@gmail.com',
      subject: `Nuevo pedido — ${empresa.nombre} — ${fecha}`,
      html: buildEmailHtml(params),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Error al enviar email: ${error.message || response.statusText}`)
  }
}
