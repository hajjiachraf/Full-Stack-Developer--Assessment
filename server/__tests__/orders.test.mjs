import request from 'supertest'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApp } from '../app.mjs'

describe('Orders API', () => {
  let app

  beforeEach(() => {
    app = createApp()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the menu', async () => {
    const response = await request(app).get('/api/menu')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('price')
  })

  it('rejects an order with no items', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [],
      customer: { name: 'John', address: 'Somewhere', phone: '123' },
    })

    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/at least one item/i)
  })

  it('rejects an order with missing customer details', async () => {
    const response = await request(app).post('/api/orders').send({
      items: [{ menuItemId: 'margherita', quantity: 1 }],
      customer: { name: '', address: '', phone: '' },
    })

    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/customer name, address and phone/i)
  })

  it('creates an order and retrieves it', async () => {
    const createResponse = await request(app).post('/api/orders').send({
      items: [{ menuItemId: 'margherita', quantity: 2 }],
      customer: { name: 'Jane', address: '123 Test St', phone: '555-1234' },
    })

    expect(createResponse.status).toBe(201)
    expect(createResponse.body).toHaveProperty('id')
    expect(createResponse.body.status).toBe('received')

    const id = createResponse.body.id

    const getResponse = await request(app).get(`/api/orders/${id}`)
    expect(getResponse.status).toBe(200)
    expect(getResponse.body.id).toBe(id)
    expect(getResponse.body.status).toBe('received')
  })

  it('progresses order status over time', async () => {
    const createResponse = await request(app).post('/api/orders').send({
      items: [{ menuItemId: 'margherita', quantity: 1 }],
      customer: { name: 'Status Tester', address: 'Timeline Rd', phone: '555-0000' },
    })

    const id = createResponse.body.id

    // Immediately after creation
    let getResponse = await request(app).get(`/api/orders/${id}`)
    expect(getResponse.body.status).toBe('received')

    // Fast-forward timers and re-check
    vi.advanceTimersByTime(7_000)
    getResponse = await request(app).get(`/api/orders/${id}`)
    expect(getResponse.body.status === 'preparing' || getResponse.body.status === 'out_for_delivery' || getResponse.body.status === 'delivered').toBe(
      true,
    )
  })
})

