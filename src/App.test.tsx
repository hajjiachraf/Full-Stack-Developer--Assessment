import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import type { MenuItem } from './data/menuItems'
import App from './App'

const mockMenu: MenuItem[] = [
  {
    id: 'pizza-1',
    name: 'Mock Pizza',
    description: 'Mock description',
    price: 12,
    imageUrl: 'https://example.com/mock.jpg',
    category: 'Pizza',
  },
]

describe('App integration', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads menu from API and displays an item', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockMenu,
    } as Response)

    render(<App />)

    expect(screen.getByText(/loading menu/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Mock Pizza')).toBeInTheDocument()
    })
  })

  it('allows adding an item to the cart', async () => {
    // First fetch: menu
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockMenu,
    } as Response)

    render(<App />)

    await screen.findByText('Mock Pizza')

    const addButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addButton)

    const cartItemHeadings = screen.getAllByRole('heading', { name: 'Mock Pizza' })
    expect(cartItemHeadings.length).toBeGreaterThanOrEqual(1)
  })
})

