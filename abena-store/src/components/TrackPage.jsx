import { useEffect, useState } from 'react'
import { useStore, money, orderStatusMeta } from '../StoreContext'

const FLOW = ['pending', 'confirmed', 'shipped', 'delivered']

export default function TrackPage({ placedOrderId, onDismissPlaced }) {
  const { getOrder, settings } = useStore()
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (placedOrderId) {
      setQuery(placedOrderId)
      setOrder(getOrder(placedOrderId))
    }
  }, [placedOrderId])

  function search(e) {
    e.preventDefault()
    setOrder(getOrder(query))
  }

  const meta = order ? orderStatusMeta(order.status) : null
  const step = order ? FLOW.indexOf(order.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Track your order</h1>
      <p className="text-slate-500 mb-6">
        Enter the order ID you received after placing your order.
      </p>

      <form onSubmit={search} className="flex gap-2 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. YL-123456"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
        <button className="px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700">
          Track
        </button>
      </form>

      {order && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Order</p>
              <p className="font-bold text-lg">{order.id}</p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${meta.color}`}>
              {meta.label}
            </span>
          </div>

          <div className="flex items-center mb-6">
            {FLOW.map((s, i) => {
              const m = orderStatusMeta(s)
              const done = i <= step
              const cancelled = order.status === 'cancelled'
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${
                        done && !cancelled
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {done && !cancelled ? '✓' : i + 1}
                    </div>
                    <span className="text-[11px] mt-1.5 text-slate-500">{m.label}</span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1.5 mb-5 rounded ${
                        done && !cancelled ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {order.status === 'cancelled' && (
            <p className="text-sm text-rose-600 font-medium mb-4">
              This order was cancelled. Contact us on WhatsApp for help.
            </p>
          )}

          <div className="border-t border-slate-100 pt-4 space-y-2">
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">Customer:</span> {order.name} · {order.phone}
            </p>
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">Address:</span> {order.address}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {order.items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-slate-600">• {i.name} × {i.qty}</span>
                <span className="font-medium">{money(i.price * i.qty, settings.currency)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>{money(order.total, settings.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {!order && (
        <div className="py-16 text-center text-slate-400">
          <div className="text-6xl mb-3">📦</div>
          <p className="font-medium">No order found. Check your order ID and try again.</p>
        </div>
      )}

      {placedOrderId && order && (
        <button
          onClick={onDismissPlaced}
          className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Track another order
        </button>
      )}
    </div>
  )
}
