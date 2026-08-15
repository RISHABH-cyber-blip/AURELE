import { resend } from '@/lib/resend'
import { renderOrderConfirmationEmail } from '@/emails/order-confirmation'

interface SendOrderConfirmationParams {
    to: string
    customerName?: string | null
    orderId: string
    items: { name: string; dialColor?: string | null; strapMaterial?: string | null; quantity: number; price: number }[]
    total: number
    currency: string
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationParams) {
    try {
        const html = renderOrderConfirmationEmail({
            orderId: params.orderId,
            items: params.items,
            total: params.total,
            currency: params.currency,
            customerName: params.customerName,
        })

        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Aurele <onboarding@resend.dev>',
            to: params.to,
            subject: `Order Confirmed — #${params.orderId.slice(-8).toUpperCase()}`,
            html,
        })
    } catch (error) {
        // Deliberately non-fatal — an email failure should never break the
        // actual checkout flow or roll back a real payment. Just log it.
        console.error('Failed to send order confirmation email:', error)
    }
}