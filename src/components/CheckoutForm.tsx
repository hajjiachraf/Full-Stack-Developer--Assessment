type CheckoutFormValues = {
  name: string
  address: string
  phone: string
}

type CheckoutFormProps = {
  isOpen: boolean
  isSubmitting: boolean
  onSubmit: (values: CheckoutFormValues) => void
}

export function CheckoutForm({ isOpen, isSubmitting, onSubmit }: CheckoutFormProps) {
  if (!isOpen) return null

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const values: CheckoutFormValues = {
      name: String(formData.get('name') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
    }

    onSubmit(values)
  }

  return (
    <section className="checkout" aria-label="Checkout details">
      <h2 className="checkout__title">Delivery details</h2>
      <p className="checkout__subtitle">
        Tell us where to deliver your order. You&apos;ll confirm everything on the next step.
      </p>

      <form className="checkout__form" onSubmit={handleSubmit}>
        <label className="checkout__field">
          <span>Full name</span>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            required
          />
        </label>

        <label className="checkout__field">
          <span>Delivery address</span>
          <textarea
            name="address"
            rows={3}
            placeholder="Street, building, apartment, city"
            autoComplete="street-address"
            required
          />
        </label>

        <label className="checkout__field">
          <span>Phone number</span>
          <input
            name="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            autoComplete="tel"
            required
          />
        </label>

        <button type="submit" className="checkout__submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </section>
  )
}

