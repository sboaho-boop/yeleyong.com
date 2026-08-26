import { useState, useEffect } from 'react'
import { useStore, money } from '../StoreContext'

const LAYERS = [
  { label: 'Screen Display', color: 'rgba(99,102,241,0.15)', z: 80 },
  { label: 'Body Chassis', color: 'rgba(139,92,246,0.12)', z: 40 },
  { label: 'Camera Module', color: 'rgba(16,185,129,0.12)', z: 0 },
  { label: 'Battery & Internals', color: 'rgba(245,158,11,0.12)', z: -40 },
]

export default function ProductDetailModal({ product, onClose, onAdd }) {
  const { settings, priceOf } = useStore()
  const [mainIdx, setMainIdx] = useState(0)
  const [exploded, setExploded] = useState(false)
  const [qty, setQty] = useState(1)

  const allImages = [product.image, ...(product.images || [])].filter(Boolean)
  const price = priceOf(product)
  const hasDiscount = (product.discount || 0) > 0

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const src = allImages[mainIdx] || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-slate-500 font-bold hover:bg-slate-200 transition">
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative bg-slate-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-6 grid place-items-center min-h-[300px]">
            {src ? (
              <div className="relative w-full aspect-square" style={{ perspective: '800px' }}>
                <img
                  src={src}
                  alt={product.name}
                  className={`w-full h-full object-contain rounded-xl transition-all duration-700 ease-out ${exploded ? 'opacity-0' : 'opacity-100'}`}
                />

                {exploded && LAYERS.map((layer, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-xl overflow-hidden transition-all duration-700 ease-out"
                    style={{
                      transform: `translateZ(${layer.z}px) rotateX(${i * 2}deg) translateY(${i * -30}px)`,
                      background: layer.color,
                      border: `2px solid ${layer.color}`,
                      boxShadow: `0 ${4 + i * 2}px ${8 + i * 4}px rgba(0,0,0,${0.05 + i * 0.03})`,
                    }}
                  >
                    <img
                      src={src}
                      alt={layer.label}
                      className="w-full h-full object-contain opacity-60"
                      style={{ filter: `hue-rotate(${i * 30}deg) brightness(${1.1 - i * 0.05})` }}
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 text-slate-600">
                      {layer.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[120px]">{product.emoji}</span>
            )}

            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setMainIdx(i); setExploded(false) }}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === mainIdx ? 'border-brand' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {src && (
              <button
                onClick={() => setExploded(!exploded)}
                className={`mt-3 px-4 py-2 rounded-xl text-sm font-semibold transition ${exploded ? 'bg-brand text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                {exploded ? '← Back to normal' : '💥 Exploded View'}
              </button>
            )}
          </div>

          <div className="p-6 flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand mb-1">{product.category}</span>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{product.name}</h2>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">{money(price, settings.currency)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-slate-400 line-through">{money(product.price, settings.currency)}</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">-{product.discount}%</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">{product.description}</p>
            )}

            {!product.inStock && (
              <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2">
                <span className="text-sm font-semibold text-rose-600">Out of stock</span>
              </div>
            )}

            <div className="mt-auto pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Qty:</span>
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 grid place-items-center text-slate-600 font-bold hover:bg-slate-100 transition">−</button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 grid place-items-center text-slate-600 font-bold hover:bg-slate-100 transition">+</button>
                </div>
              </div>

              <button
                onClick={() => { for (let i = 0; i < qty; i++) onAdd(product.id); onClose() }}
                disabled={!product.inStock}
                className="w-full py-3 rounded-xl bg-brand text-white font-bold text-base transition hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ADD TO CART — {money(price * qty, settings.currency)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
