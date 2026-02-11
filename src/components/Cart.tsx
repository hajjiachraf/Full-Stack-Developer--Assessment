import type { CartItem } from '../types/cart'
import { calculateCartTotal } from '../types/cart'

type CartProps = {
  items: CartItem[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
  onProceedToCheckout: () => void
  isCheckoutActive: boolean
}

export function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onProceedToCheckout,
  isCheckoutActive,
}: CartProps) {
  const isEmpty = items.length === 0
  const cartTotal = calculateCartTotal(items)

  return (
    <aside className="cart" aria-label="Cart">
      <header className="cart__header">
        <div>
          <h2 className="cart__title">Your order</h2>
          <p className="cart__subtitle">
            {isEmpty ? 'No items yet. Start by adding something from the menu.' : 'Review your items before checkout.'}
          </p>
        </div>
      </header>

      {isEmpty ? (
        <p className="cart__empty">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart__items">
            {items.map(({ item, quantity }) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__meta">
                    <span>${item.price.toFixed(2)} each</span>
                  </p>
                </div>

                <div className="cart-item__actions">
                  <div className="cart-item__quantity">
                    <button
                      type="button"
                      className="cart-item__quantity-btn"
                      onClick={() => onDecrease(item.id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={quantity === 1}
                    >
                      −
                    </button>
                    <span aria-live="polite" className="cart-item__quantity-value">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="cart-item__quantity-btn"
                      onClick={() => onIncrease(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item__total">
                    ${(item.price * quantity).toFixed(2)}
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => onRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="cart__footer">
            <div className="cart__summary">
              <span>Total</span>
              <span className="cart__total-amount">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="cart__checkout-btn"
              onClick={onProceedToCheckout}
              disabled={isCheckoutActive}
            >
              {isCheckoutActive ? 'Entering details…' : 'Proceed to checkout'}
            </button>
          </footer>
        </>
      )}
    </aside>
  )
}

