import { ORDER_STATUS_STEPS, type OrderStatus } from '../types/order'

type OrderStatusTrackerProps = {
  status: OrderStatus
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === 'idle') return null

  const activeIndex = ORDER_STATUS_STEPS.findIndex((step) => step.id === status)

  return (
    <section className="order-status" aria-label="Order status">
      <header className="order-status__header">
        <h2 className="order-status__title">Order status</h2>
        <p className="order-status__tagline">
          We&apos;ll move through these steps automatically as your order progresses.
        </p>
      </header>

      <ol className="order-status__steps">
        {ORDER_STATUS_STEPS.map((step, index) => {
          const isActive = index === activeIndex
          const isCompleted = index < activeIndex

          return (
            <li
              key={step.id}
              className={[
                'order-status__step',
                isActive ? 'order-status__step--active' : '',
                isCompleted ? 'order-status__step--done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="order-status__step-indicator">
                <span className="order-status__step-dot" aria-hidden="true" />
              </div>
              <div className="order-status__step-body">
                <p className="order-status__step-label">{step.label}</p>
                <p className="order-status__step-helper">{step.helper}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

