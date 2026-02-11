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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  res.status(200).json(menuItems)
}

