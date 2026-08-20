import { useStore } from '../StoreContext'

export default function Footer({ setPage }) {
  const { settings } = useStore()

  const links = [
    {
      title: 'ABOUT YELOYOUNG PHONES AND ACCESSORIES',
      items: [
        { label: 'Our story', action: () => setPage('shop') },
        { label: 'Track your order', action: () => setPage('track') },
        { label: 'Admin panel', action: () => setPage('admin') },
      ],
    },
    {
      title: 'CUSTOMER CARE',
      items: [
        { label: 'Help center', action: () => setPage('shop') },
        { label: 'How to order', action: () => setPage('shop') },
        { label: 'Delivery & payment', action: () => setPage('shop') },
      ],
    },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <p className="font-extrabold text-white text-lg tracking-tight flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            YELOYOUNG<span className="text-brand"> PHONES AND ACCESORIES</span>
          </p>
          <p className="text-sm text-slate-400 mt-2">{settings.tagline}</p>
          <p className="text-sm text-slate-400 mt-1">📍 {settings.location}</p>
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2.5 rounded mt-4 font-semibold hover:bg-emerald-500 transition"
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        {links.map((col) => (
          <div key={col.title}>
            <p className="font-bold text-white text-sm mb-3">{col.title}</p>
            <div className="flex flex-col gap-2 text-sm">
              {col.items.map((it) => (
                <button key={it.label} onClick={it.action} className="text-left text-slate-400 hover:text-white transition">
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p>Safe & easy shopping 🛡️</p>
        </div>
      </div>
    </footer>
  )
}
