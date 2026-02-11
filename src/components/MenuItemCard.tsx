import type { MenuItem } from '../data/menuItems'

type MenuItemCardProps = {
  item: MenuItem
  onAddToCart?: (item: MenuItem) => void
}

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=800'

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const imageSrc = item.imageUrl || FALLBACK_IMAGE

  return (
    <article className="menu-card">
      <div className="menu-card__image-wrapper">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          className="menu-card__image"
          onError={(event) => {
            const target = event.currentTarget
            if (target.dataset.fallbackApplied === 'true') return
            target.src = FALLBACK_IMAGE
            target.dataset.fallbackApplied = 'true'
          }}
        />
        {item.isPopular ? <span className="menu-card__badge">Popular</span> : null}
      </div>
      <div className="menu-card__body">
        <header className="menu-card__header">
          <div>
            <h3 className="menu-card__title">{item.name}</h3>
            <p className="menu-card__category">{item.category}</p>
          </div>
          <p className="menu-card__price">${item.price.toFixed(2)}</p>
        </header>
        <p className="menu-card__description">{item.description}</p>
        {onAddToCart && (
          <button
            type="button"
            className="menu-card__add-btn"
            onClick={() => onAddToCart(item)}
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}
