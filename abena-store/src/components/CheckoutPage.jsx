import { useMemo, useState } from 'react'
import { useStore, money } from '../StoreContext'

export default function CheckoutPage({ onOrderPlaced, goShop }) {
  const { cartDetails, settings, priceOf, placeOrder } = useStore()
  const { lines, subtotal } = cartDetails()

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [promo, setPromo] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(false)

  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0
    return subtotal * ((settings.promoDiscount || 0) / 100)
  }, [appliedPromo, subtotal, settings.promoDiscount])

  const discount = Math.round(promoDiscount * 100) / 100
  const total = subtotal - discount + Number(settings.deliveryFee || 0)

  function applyPromo() {
    if (promo.trim().toUpperCase() === settings.promoCode.toUpperCase()) {
      setAppliedPromo(true)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (lines.length === 0) return

    const order = placeOrder({
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: lines.map(({ item, product }) => ({
        productId: item.productId,
        name: product.name,
        qty: item.qty,
        price: priceOf(product),
      })),
      subtotal,
      discount,
      delivery: Number(settings.deliveryFee || 0),
      total,
      promoCode: appliedPromo ? settings.promoCode : null,
    })

    const linesText = lines
      .map(({ item, product }) => `• ${product.name} x${item.qty} — ${money(priceOf(product) * item.qty, settings.currency)}`)
      .join('\n')

    const msg =
      `🛍️ *NEW ORDER — ${order.id}*\n\n` +
      `👤 ${order.name}\n📞 ${order.phone}\n📍 ${order.address}\n\n` +
      `*Items:*\n${linesText}\n\n` +
      `Subtotal: ${money(order.subtotal, settings.currency)}\n` +
      `${order.discount > 0 ? `Discount: -${money(order.discount, settings.currency)}\n` : ''}` +
      `Delivery: ${money(order.delivery, settings.currency)}\n` +
      `*TOTAL: ${money(order.total, settings.currency)}*`

    const url = `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')

    onOrderPlaced(order.id)
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🧺</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Add some products before checking out.</p>
        <button
          onClick={goShop}
          className="px-6 py-3 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark"
        >
          Browse products
        </button>
      </div>
    )
  }

  const input =
    'w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold mb-4">1. Your details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ama Owusu"
                  className={input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone number</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 0244 000 000"
                  className={input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Delivery address</label>
                <textarea
                  required
                  rows="3"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. House number, street, town/city"
                  className={input}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold mb-3">2. Promo code</h2>
            {appliedPromo ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-medium">
                <span>🎉 Promo applied — {settings.promoDiscount}% off your order!</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter code"
                  className={input}
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:sticky md:top-24">
          <h2 className="font-bold mb-4">Order summary</h2>
          <div className="space-y-3">
            {lines.map(({ item, product }) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-slate-600 truncate pr-2">
                  {product.emoji} {product.name} × {item.qty}
                </span>
                <span className="font-medium">{money(priceOf(product) * item.qty, settings.currency)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-200 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{money(subtotal, settings.currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({settings.promoCode})</span>
                <span>-{money(discount, settings.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span>{money(Number(settings.deliveryFee || 0), settings.currency)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total</span>
              <span>{money(total, settings.currency)}</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            After you place your order, WhatsApp will open with your order details. Just press send and
            we will confirm your order right away.
          </p>

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
          >
            Place order via WhatsApp 📲
          </button>
        </div>
      </form>
    </div>
  )
}
