// Plain HTML template (not React Email) — kept simple and dependency-free.
// Inline styles throughout, since most email clients strip <style> blocks
// and ignore external/Google fonts — this is standard practice for email HTML.

interface OrderItem {
    name: string
    dialColor?: string | null
    strapMaterial?: string | null
    quantity: number
    price: number
}

interface OrderEmailData {
    orderId: string
    items: OrderItem[]
    total: number
    currency: string
    customerName?: string | null
}

function formatMoney(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function renderOrderConfirmationEmail(data: OrderEmailData): string {
    const itemRows = data.items
        .map(
            (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #E7DDCC;">
        <p style="margin: 0; font-size: 14px; color: #1A1A1A;">${item.name}</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #8C857A;">
          ${[item.dialColor, item.strapMaterial].filter(Boolean).join(' · ')} · Qty ${item.quantity}
        </p>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #E7DDCC; text-align: right; font-size: 14px; color: #1A1A1A;">
        ${formatMoney(item.price * item.quantity, data.currency)}
      </td>
    </tr>`
        )
        .join('')

    return `
  <div style="background-color: #FAF6F0; padding: 40px 20px; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto;">
      <tr>
        <td style="text-align: center; padding-bottom: 32px;">
          <p style="margin: 0; font-size: 24px; letter-spacing: 3px; color: #1A1A1A;">AURELE</p>
        </td>
      </tr>
      <tr>
        <td style="background: #FFFFFF; border-radius: 16px; padding: 32px;">
          <p style="margin: 0 0 4px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #B8935F; font-family: 'Courier New', monospace;">
            Order Confirmed
          </p>
          <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 400; color: #1A1A1A;">
            Thank You${data.customerName ? `, ${data.customerName}` : ''}
          </h1>
          <p style="margin: 0 0 24px; font-size: 14px; color: #4A4640; line-height: 1.6;">
            Your order <strong>#${data.orderId.slice(-8).toUpperCase()}</strong> has been confirmed and is being prepared.
          </p>

          <table role="presentation" width="100%" style="border-collapse: collapse;">
            ${itemRows}
            <tr>
              <td style="padding: 16px 0 0; font-size: 15px; color: #1A1A1A; font-weight: bold;">Total</td>
              <td style="padding: 16px 0 0; text-align: right; font-size: 18px; color: #1A1A1A; font-weight: bold;">
                ${formatMoney(data.total, data.currency)}
              </td>
            </tr>
          </table>

          <p style="margin: 28px 0 0; font-size: 13px; color: #8C857A; line-height: 1.6;">
            You can track your order status anytime from your account.
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding-top: 24px;">
          <p style="margin: 0; font-size: 11px; color: #8C857A;">
            Aurele — Timeless pieces, honestly sourced.
          </p>
        </td>
      </tr>
    </table>
  </div>`
}