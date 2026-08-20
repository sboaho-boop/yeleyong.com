import { useStore, money } from '../StoreContext'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { setQty, clearCart, cartDetails, settings, priceOf } = useStore()
  const { lines, subtotal } = cartDetails()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-lg">Your Cart</h2>
          <button
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {lines.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-medium">Your cart is empty.</p>
            </div>
          ) : (
            lines.map(({ item, product }) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div
                  className="w-16 h-16 rounded-xl shrink-0 overflow-hidden grid place-items-center text-3xl"
                  style={{ background: `${product.color}33` }}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    product.emoji
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-sm text-slate-600">
                    {money(priceOf(product), settings.currency)} × {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setQty(item.productId, item.qty - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold"
                  >
                    −
                  </button>
                  <span className="w-7 text-center font-semibold">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.productId, item.qty + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {money(subtotal, settings.currency)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition"
            >
              Proceed to Checkout →
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-slate-500 hover:text-rose-600"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
