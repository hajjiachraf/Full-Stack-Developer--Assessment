import { render, screen, fireEvent } from '@testing-library/react'
import type { MenuItem } from '../data/menuItems'
import { MenuItemCard } from './MenuItemCard'

const sampleItem: MenuItem = {
  id: 'test-item',
  name: 'Test Pizza',
  description: 'A tasty test pizza with cheese.',
  price: 9.99,
  imageUrl: 'https://example.com/pizza.jpg',
  category: 'Pizza',
  isPopular: true,
}

describe('MenuItemCard', () => {
  it('renders the item name, description and price', () => {
    render(<MenuItemCard item={sampleItem} />)

    expect(screen.getByText('Test Pizza')).toBeInTheDocument()
    expect(
      screen.getByText('A tasty test pizza with cheese.'),
    ).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
  })

  it('calls onAddToCart when the button is clicked', () => {
    const handleAdd = vi.fn()

    render(<MenuItemCard item={sampleItem} onAddToCart={handleAdd} />)

    const button = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(button)

    expect(handleAdd).toHaveBeenCalledTimes(1)
    expect(handleAdd).toHaveBeenCalledWith(sampleItem)
  })
})

