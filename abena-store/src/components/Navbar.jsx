import { useStore, CATEGORIES } from '../StoreContext'

export default function Navbar({ setPage, onCartOpen, query, setQuery, category, setCategory }) {
  const { cart } = useStore()
  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      <div className="bg-slate-900 text-slate-300">
        <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-between gap-4 text-xs">
          <p className="truncate">Fast delivery · Pay on arrival 🚚</p>
          <nav className="flex items-center gap-4 shrink-0">
            <button onClick={() => setPage('track')} className="hover:text-white transition">
              Track your order
            </button>
            <button onClick={() => setPage('admin')} className="hover:text-white transition">
              Admin
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <button onClick={() => setPage('shop')} className="shrink-0 text-left flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-slate-900">YELEYONG</span>
            <span className="text-brand">PHONES AND ACCESSORIES</span>
          </span>
        </button>

        <div className="flex-1 hidden sm:flex items-center overflow-hidden rounded-md border-2 border-brand">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands and more…"
            className="flex-1 min-w-0 px-3 py-2 text-sm focus:outline-none"
          />
          <button className="bg-brand px-6 py-2 text-sm font-bold text-white hover:bg-brand-dark transition">
            SEARCH
          </button>
        </div>

        <button
          onClick={onCartOpen}
          className="relative ml-auto sm:ml-0 flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-brand transition"
        >
          <span className="relative text-2xl leading-none">🛒
            {count > 0 && (
              <span className="absolute -top-1.5 -right-3 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-brand text-white text-xs font-bold">
                {count}
              </span>
            )}
          </span>
          <span className="hidden md:block">Cart</span>
        </button>
      </div>

      <div className="sm:hidden max-w-6xl mx-auto px-4 pb-3">
        <div className="flex items-center overflow-hidden rounded-md border-2 border-brand">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 min-w-0 px-3 py-2 text-sm focus:outline-none"
          />
          <button className="bg-brand px-4 py-2 text-sm font-bold text-white">SEARCH</button>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 text-sm">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium transition ${
                category === c ? 'bg-brand text-white' : 'text-slate-600 hover:text-brand'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
