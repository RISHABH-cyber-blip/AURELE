const STAGES = [
  { key: 'PAID', label: 'Order Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
]

interface Props {
  status: string
  createdAt: Date
}

export default function OrderStatusTimeline({ status, createdAt }: Props) {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <div className="bg-cream-soft rounded-xl px-5 py-4">
        <p className="text-sm text-ink-faint">
          This order was {status === 'CANCELLED' ? 'cancelled' : 'refunded'}.
        </p>
      </div>
    )
  }

  const currentIndex = STAGES.findIndex((s) => s.key === status)
  // Honest estimate: 5 business-day-ish window from order date, only
  // shown while genuinely in progress — not shown once delivered.
  const estimatedDelivery = new Date(createdAt)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {STAGES.map((stage, i) => (
          <div key={stage.key} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full transition-calm ${
                  i <= currentIndex ? 'bg-gold' : 'bg-cream-deep'
                }`}
              />
              <p
                className={`text-[10px] tracking-wide uppercase mt-2 text-center whitespace-nowrap ${
                  i <= currentIndex ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                {stage.label}
              </p>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`flex-1 h-px mx-1 transition-calm ${i < currentIndex ? 'bg-gold' : 'bg-cream-deep'}`} />
            )}
          </div>
        ))}
      </div>

      {status !== 'DELIVERED' && (
        <p className="text-xs text-ink-faint text-center mt-6">
          Estimated delivery by{' '}
          {estimatedDelivery.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </p>
      )}
    </div>
  )
}