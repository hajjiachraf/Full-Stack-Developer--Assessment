import type { MenuItem } from '../data/menuItems'

export type CartItem = {
  item: MenuItem
  quantity: number
}

export function calculateCartTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((total, cartItem) => {
    return total + cartItem.item.price * cartItem.quantity
  }, 0)
}

