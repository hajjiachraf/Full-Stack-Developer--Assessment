import { useEffect, useState } from 'react'
import './App.css'
import type { MenuItem } from './data/menuItems'
import { MenuItemCard } from './components/MenuItemCard'
import type { CartItem } from './types/cart'
import { Cart } from './components/Cart'
import { CheckoutForm } from './components/CheckoutForm'
import { OrderStatusTracker } from './components/OrderStatusTracker'
import type { OrderStatus } from './types/order'
import { apiFetch } from './lib/api'

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isMenuLoading, setIsMenuLoading] = useState(true)
  const [menuError, setMenuError] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckoutActive, setIsCheckoutActive] = useState(false)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [orderPlacedMessage, setOrderPlacedMessage] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle')
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadMenu() {
      try {
        setIsMenuLoading(true)
        setMenuError(null)
        const response = await apiFetch('/api/menu')
        if (!response.ok) {
          throw new Error('Failed to load menu')
        }
        const data: MenuItem[] = await response.json()
        if (isMounted) {
          setMenuItems(data)
        }
      } catch (error) {
        if (isMounted) {
          setMenuError(error instanceof Error ? error.message : 'Could not load menu.')
        }
      } finally {
        if (isMounted) {
          setIsMenuLoading(false)
        }
      }
    }
    loadMenu()
    return () => {
      isMounted = false
    }
  }, [])

  function handleAddToCart(item: MenuItem) {
    setOrderPlacedMessage(null)
    setOrderStatus('idle')
    setCartItems((current) => {
      const existing = current.find((entry) => entry.item.id === item.id)
      if (!existing) {
        return [...current, { item, quantity: 1 }]
      }
      return current.map((entry) =>
        entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
      )
    })
  }

  function handleIncreaseQuantity(id: string) {
    setCartItems((current) =>
      current.map((entry) =>
        entry.item.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry,
      ),
    )
  }

  function handleDecreaseQuantity(id: string) {
    setCartItems((current) =>
      current.map((entry) =>
        entry.item.id === id && entry.quantity > 1
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry,
      ),
    )
  }

  function handleRemoveFromCart(id: string) {
    setCartItems((current) => current.filter((entry) => entry.item.id !== id))
  }

  function handleProceedToCheckout() {
    setIsCheckoutActive(true)
    setOrderPlacedMessage(null)
  }

  async function handleSubmitOrder(values: { name: string; address: string; phone: string }) {
    // Simple front-end validation, backend will also validate.
    if (!values.name || !values.address || !values.phone) {
      return
    }
    setIsSubmittingOrder(true)
    setOrderPlacedMessage(null)

    try {
      const response = await apiFetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((entry) => ({
            menuItemId: entry.item.id,
            quantity: entry.quantity,
          })),
          customer: values,
        }),
      })

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        const message = errorBody?.error ?? 'Could not place order. Please try again.'
        throw new Error(message)
      }

      const order: { id: string; status: OrderStatus } = await response.json()

      setIsSubmittingOrder(false)
      setIsCheckoutActive(false)
      setCartItems([])
      setCurrentOrderId(order.id)
      setOrderStatus(order.status)
      setOrderPlacedMessage(
        `Thanks ${values.name}! Your order has been placed and will be delivered to ${values.address}.`,
      )
    } catch (error) {
      setIsSubmittingOrder(false)
      setOrderPlacedMessage(
        error instanceof Error ? error.message : 'Something went wrong placing your order.',
      )
    }
  }

  useEffect(() => {
    if (!currentOrderId) return

    const base = import.meta.env.VITE_API_BASE_URL ?? ''
    const url = `${base}/api/orders/${currentOrderId}/stream`
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { status?: OrderStatus }
        if (data.status) {
          setOrderStatus(data.status)
          if (data.status === 'delivered') {
            eventSource.close()
          }
        }
      } catch {
        // ignore malformed events
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [currentOrderId])

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">FoodFlow</p>
          <h1 className="app-header__title">Tonight’s menu, made simple.</h1>
          <p className="app-header__subtitle">
            Browse our most popular pizzas, burgers, sides and desserts. Pick your
            favorites and you&apos;ll be ready to order in the next step.
          </p>
        </div>
        <div className="app-header__meta">
          <span className="app-header__pill">Open · 20–30 min delivery</span>
          <span className="app-header__pill app-header__pill--ghost">
            Free delivery over $20
          </span>
        </div>
      </header>

      <main className="app-main">
        <section aria-labelledby="menu-heading" className="menu-section">
          <div className="menu-section__header">
            <h2 id="menu-heading">Menu</h2>
            <p>Choose something delicious to add to your order.</p>
          </div>

          {isMenuLoading ? (
            <p className="menu-section__helper">Loading menu…</p>
          ) : menuError ? (
            <p className="menu-section__helper menu-section__helper--error">
              {menuError}
            </p>
          ) : (
            <div className="menu-grid">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>

        <section className="sidebar-section">
          <Cart
            items={cartItems}
            onIncrease={handleIncreaseQuantity}
            onDecrease={handleDecreaseQuantity}
            onRemove={handleRemoveFromCart}
            onProceedToCheckout={handleProceedToCheckout}
            isCheckoutActive={isCheckoutActive}
          />

          <CheckoutForm
            isOpen={isCheckoutActive && cartItems.length > 0}
            isSubmitting={isSubmittingOrder}
            onSubmit={handleSubmitOrder}
          />

          <OrderStatusTracker status={orderStatus} />

          {orderPlacedMessage ? (
            <p className="order-success" role="status">
              {orderPlacedMessage}
            </p>
          ) : null}
        </section>
      </main>
    </div>
  )
}

export default App
