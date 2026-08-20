import { useEffect, useState } from 'react'
import { useStore, CATEGORIES } from '../StoreContext'
import ProductCard from './ProductCard'

const SLIDES = [
  {
    emoji: '🛍️',
    title: 'Big Sale — Up to 50% OFF',
    sub: 'Huge discounts on selected items across all categories.',
    from: 'from-orange-500',
    to: 'to-brand',
  },
  {
    emoji: '📦',
    title: 'Pay On Delivery',
    sub: 'Order now, pay when your items arrive at your door.',
    from: 'from-rose-500',
    to: 'to-pink-600',
  },
  {
    emoji: '🎁',
    title: 'New Arrivals Every Week',
    sub: 'Fresh stock of bags, shoes, beauty and more.',
    from: 'from-indigo-500',
    to: 'to-purple-600',
  },
]

export default function ShopPage({ onAdd, goCheckout, category, setCategory, query }) {
  const { products, cart } = useStore()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const filtered = products.filter((p) => {
    const inCat = category === 'All' || p.category === category
    const matches = p.name.toLowerCase().includes(query.toLowerCase())
    return inCat && matches
  })

  const featured = CATEGORIES.filter((c) => c !== 'All')

  return (
    <div className="bg-slate-100 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 pt-4">
        <div className="relative h-48 sm:h-60 overflow-hidden rounded-xl shadow">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-between px-8 sm:px-14 bg-gradient-to-r ${s.from} ${s.to} transition-opacity duration-700 ${
                i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-extrabold drop-shadow-sm">{s.title}</h2>
                <p className="text-white/90 text-sm mt-1.5 max-w-md">{s.sub}</p>
                <button
                  onClick={() => goCheckout()}
                  className="mt-4 bg-white text-brand font-bold text-sm px-6 py-2.5 rounded hover:bg-brand-light transition"
                >
                  SHOP NOW
                </button>
              </div>
              <div className="hidden sm:block text-8xl drop-shadow-lg">{s.emoji}</div>
            </div>
          ))}

          <button
            onClick={() => setSlide((slide - 1 + SLIDES.length) % SLIDES.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/80 text-slate-700 font-bold shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            onClick={() => setSlide((slide + 1) % SLIDES.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/80 text-slate-700 font-bold shadow hover:bg-white"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">
            {category === 'All' ? 'All Products' : category}
            <span className="ml-2 text-xs font-normal text-slate-500">({filtered.length})</span>
          </h2>
          {category !== 'All' && (
            <button onClick={() => setCategory('All')} className="text-sm text-brand font-semibold hover:underline">
              View all
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-lg">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <div className="sticky bottom-4 flex justify-center">
          <button
            onClick={goCheckout}
            className="px-6 py-3 rounded-full bg-brand text-white font-bold shadow-lg shadow-brand/40 hover:bg-brand-dark transition"
          >
            Checkout ({cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) > 1 ? 's' : ''}) →
          </button>
        </div>
      )}
    </div>
  )
}
