import { createOrder, getOrderWithStatus } from './_store.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body
  try {
    body = req.body || (await readJson(req))
  } catch {
    res.status(400).json({ error: 'Invalid JSON' })
    return
  }

  const { items, customer } = body || {}

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Order must include at least one item.' })
    return
  }

  if (!customer || !customer.name || !customer.address || !customer.phone) {
    res
      .status(400)
      .json({ error: 'Customer name, address and phone are required.' })
    return
  }

  const normalizedItems = items.map((entry) => ({
    menuItemId: entry.menuItemId,
    quantity: Number(entry.quantity) || 1,
  }))

  const order = createOrder({ items: normalizedItems, customer })
  const orderWithStatus = getOrderWithStatus(order.id)

  res.status(201).json({ id: orderWithStatus.id, status: orderWithStatus.status })
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

