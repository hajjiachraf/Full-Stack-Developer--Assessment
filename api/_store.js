// Simple in-memory store for Vercel serverless functions.
// Note: This is NOT persistent across cold starts, but is fine for demo purposes.

export const orders = new Map()

export function createOrder({ items, customer }) {
  const id = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
  const now = new Date().toISOString()
  const order = { id, items, customer, createdAt: now }
  orders.set(id, order)
  return order
}

// Derive status from how long ago the order was created
export function getOrderWithStatus(id) {
  const order = orders.get(id)
  if (!order) return null

  const created = new Date(order.createdAt).getTime()
  const now = Date.now()
  const seconds = (now - created) / 1000

  let status = 'received'
  if (seconds > 5 && seconds <= 20) status = 'preparing'
  else if (seconds > 20 && seconds <= 40) status = 'out_for_delivery'
  else if (seconds > 40) status = 'delivered'

  return { ...order, status }
}

