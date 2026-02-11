import express from 'express'
import cors from 'cors'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  // --- In-memory data ---

  const menuItems = [
    {
      id: 'margherita',
      name: 'Margherita Pizza',
      description:
        'San Marzano tomatoes, fresh mozzarella, basil & olive oil on a hand-tossed crust.',
      price: 10.99,
      imageUrl:
        'https://images.pexels.com/photos/159688/pizza-cheese-margarita-margarita-pizza-159688.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Pizza',
      isPopular: true,
    },
    {
      id: 'pepperoni',
      name: 'Spicy Pepperoni Pizza',
      description: 'Loaded with spicy pepperoni, house tomato sauce and a blend of cheeses.',
      price: 12.49,
      imageUrl:
        'https://images.pexels.com/photos/1121375/pexels-photo-1121375.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Pizza',
      isPopular: true,
    },
    {
      id: 'veggie-burger',
      name: 'Grilled Veggie Burger',
      description:
        'Char-grilled veggie patty, lettuce, tomato, onion and house sauce on a brioche bun.',
      price: 9.5,
      imageUrl:
        'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Burger',
    },
    {
      id: 'cheese-burger',
      name: 'Classic Cheeseburger',
      description: 'Smash-style beef patty, aged cheddar, pickles and our secret sauce.',
      price: 11.25,
      imageUrl:
        'https://images.pexels.com/photos/1639556/pexels-photo-1639556.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Burger',
      isPopular: true,
    },
    {
      id: 'fries',
      name: 'Crispy Fries',
      description: 'Twice-fried potatoes with sea salt and your choice of dip.',
      price: 4.25,
      imageUrl:
        'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sides',
    },
    {
      id: 'wings',
      name: 'Buffalo Wings',
      description: 'Spicy buffalo wings served with cooling ranch dip.',
      price: 8.75,
      imageUrl:
        'https://images.pexels.com/photos/60616/wings-chicken-spicy-grilled-60616.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sides',
    },
    {
      id: 'cheesecake',
      name: 'New York Cheesecake',
      description: 'Creamy vanilla cheesecake on a buttery biscuit base.',
      price: 6.0,
      imageUrl:
        'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Dessert',
    },
    {
      id: 'choco-brownie',
      name: 'Warm Chocolate Brownie',
      description: 'Rich chocolate brownie served warm with a scoop of vanilla ice cream.',
      price: 5.75,
      imageUrl:
        'https://images.pexels.com/photos/45202/chocolate-brownie-dessert-cake-45202.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Dessert',
    },
    {
      id: 'lemonade',
      name: 'Fresh Lemonade',
      description: 'Zesty homemade lemonade with a hint of mint.',
      price: 3.0,
      imageUrl:
        'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Drinks',
    },
    {
      id: 'cola',
      name: 'Craft Cola',
      description: 'Classic cola with natural spices and citrus notes.',
      price: 2.75,
      imageUrl:
        'https://images.pexels.com/photos/4784/alcohol-bar-drinks-party.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Drinks',
    },
  ]

  const orders = new Map()
  const orderStatusSubscribers = new Map()

  function generateId() {
    return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
  }

  function notifyOrderStatus(orderId) {
    const order = orders.get(orderId)
    if (!order) return
    const subscribers = orderStatusSubscribers.get(orderId)
    if (!subscribers) return
    const payload = `data: ${JSON.stringify({ status: order.status })}\n\n`
    for (const res of subscribers) {
      res.write(payload)
    }
  }

  function scheduleOrderStatusProgression(orderId) {
    const steps = [
      { status: 'preparing', delayMs: 6_000 },
      { status: 'out_for_delivery', delayMs: 16_000 },
      { status: 'delivered', delayMs: 28_000 },
    ]

    for (const step of steps) {
      setTimeout(() => {
        const order = orders.get(orderId)
        if (!order) return
        if (order.status === 'delivered') return
        order.status = step.status
        order.updatedAt = new Date().toISOString()
        orders.set(orderId, order)
        notifyOrderStatus(orderId)
      }, step.delayMs)
    }
  }

  // Expose a way for tests to access internal state
  app.locals.orders = orders
  app.locals.scheduleOrderStatusProgression = scheduleOrderStatusProgression
  app.locals.orderStatusSubscribers = orderStatusSubscribers

  // --- REST API ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  // Menu retrieval
  app.get('/api/menu', (_req, res) => {
    res.json(menuItems)
  })

  // Create an order
  app.post('/api/orders', (req, res) => {
    const { items, customer } = req.body || {}

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item.' })
    }

    if (!customer || !customer.name || !customer.address || !customer.phone) {
      return res
        .status(400)
        .json({ error: 'Customer name, address and phone are required.' })
    }

    // Basic validation that items exist in the menu
    const normalizedItems = items.map((entry) => {
      const menuItem = menuItems.find((item) => item.id === entry.menuItemId)
      if (!menuItem) {
        return null
      }
      const quantity = Number(entry.quantity) || 1
      return {
        menuItemId: menuItem.id,
        quantity: quantity < 1 ? 1 : quantity,
      }
    })

    if (normalizedItems.some((entry) => entry === null)) {
      return res.status(400).json({ error: 'One or more menu items are invalid.' })
    }

    const id = generateId()
    const now = new Date().toISOString()
    const order = {
      id,
      items: normalizedItems,
      customer,
      status: 'received',
      createdAt: now,
      updatedAt: now,
    }

    orders.set(id, order)
    scheduleOrderStatusProgression(id)

    res.status(201).json(order)
  })

  // Get order by id (including current status)
  app.get('/api/orders/:id', (req, res) => {
    const order = orders.get(req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' })
    }
    res.json(order)
  })

  // Server-Sent Events stream for live order status updates
  app.get('/api/orders/:id/stream', (req, res) => {
    const orderId = req.params.id
    const order = orders.get(orderId)
    if (!order) {
      res.status(404).end()
      return
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Send current status immediately
    res.write(`data: ${JSON.stringify({ status: order.status })}\n\n`)

    let subscribers = orderStatusSubscribers.get(orderId)
    if (!subscribers) {
      subscribers = new Set()
      orderStatusSubscribers.set(orderId, subscribers)
    }
    subscribers.add(res)

    const keepAliveId = setInterval(() => {
      res.write(':\n\n')
    }, 25_000)

    req.on('close', () => {
      clearInterval(keepAliveId)
      subscribers.delete(res)
      if (subscribers.size === 0) {
        orderStatusSubscribers.delete(orderId)
      }
    })
  })

  return app
}

