export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: 'Pizza' | 'Burger' | 'Sides' | 'Dessert' | 'Drinks'
  isPopular?: boolean
}

