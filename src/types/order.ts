export type OrderStatus = 'idle' | 'received' | 'preparing' | 'out_for_delivery' | 'delivered'

export const ORDER_STATUS_STEPS: { id: Exclude<OrderStatus, 'idle'>; label: string; helper: string }[] =
  [
    {
      id: 'received',
      label: 'Order received',
      helper: 'We’ve got your order and sent it to the kitchen.',
    },
    {
      id: 'preparing',
      label: 'Preparing',
      helper: 'Our chefs are cooking your food fresh.',
    },
    {
      id: 'out_for_delivery',
      label: 'Out for delivery',
      helper: 'Your courier is on the way to you.',
    },
    {
      id: 'delivered',
      label: 'Delivered',
      helper: 'Enjoy your meal!',
    },
  ]

