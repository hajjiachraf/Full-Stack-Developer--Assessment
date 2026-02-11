import { getOrderWithStatus } from '../_store.js'

export default function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const order = getOrderWithStatus(id)
  if (!order) {
    res.status(404).json({ error: 'Order not found.' })
    return
  }

  res.status(200).json(order)
}

