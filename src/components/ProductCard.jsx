import { useState } from 'react'
import { useStore, money } from '../StoreContext'

export default function ProductCard({ product, onAdd, onOpen }) {
  const { settings, priceOf } = useStore()
  const [imgError, setImgError] = useState(false)
  const price = priceOf(product)
  const hasDiscount = (product.discount || 0) > 0

  return (
    <div
      className="group flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-brand transition cursor-pointer"
      onClick={() => onOpen(product)}
    >
      <div className="relative aspect-square bg-slate-100 grid place-items-center overflow-hidden">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 rounded bg-brand text-white text-xs font-bold px-2 py-1">
            -{product.discount}%
          </span>
        )}
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-6xl drop-shadow transition group-hover:scale-110">{product.emoji}</span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
            <span className="rounded-full bg-slate-900 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wide">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm text-slate-700 line-clamp-2 leading-snug min-h-10">{product.name}</h3>
        <div className="mt-auto pt-2">
          <div className="text-lg font-bold text-slate-900">{money(price, settings.currency)}</div>
          <div className="text-xs text-slate-400 line-through">
            {hasDiscount ? money(product.price, settings.currency) : '\u00A0'}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product.id) }}
          disabled={!product.inStock}
          className="mt-2 w-full py-2 rounded bg-brand-light text-brand font-bold text-sm transition hover:bg-brand hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}
