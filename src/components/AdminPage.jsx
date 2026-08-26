import { useState } from 'react'
import { useStore, money, orderStatusMeta, ORDER_STATUSES } from '../StoreContext'

const PRESET_COLORS = ['#f43f5e', '#0ea5e9', '#a855f7', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1', '#ef4444', '#f97316', '#78716c']

const CATEGORIES = ['Fashion', 'Beauty', 'Electronics', 'Home', 'Food']

const EMPTY_FORM = {
  id: null,
  name: '',
  category: CATEGORIES[0],
  price: '',
  discount: 0,
  description: '',
  emoji: '📦',
  color: PRESET_COLORS[0],
  image: '',
  images: [],
  inStock: true,
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminPage() {
  const { products, setProducts, deleteProduct: removeProduct, settings, setSettings, orders, updateOrderStatus, logoutAdmin, adminUser } = useStore()
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState(EMPTY_FORM)

  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'orders', label: `Orders (${orders.length})` },
    { id: 'settings', label: 'Store Settings' },
  ]

  function resetForm() {
    setForm(EMPTY_FORM)
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readFileAsDataURL(file)
      setForm((f) => ({ ...f, image: dataUrl }))
    } catch {
      alert('Could not read that file. Please try another image.')
    }
  }

  async function handleGalleryUpload(e) {
    const files = e.target.files
    if (!files || files.length === 0) return
    try {
      const dataUrls = await Promise.all(Array.from(files).map(readFileAsDataURL))
      setForm((f) => ({ ...f, images: [...(f.images || []), ...dataUrls] }))
    } catch {
      alert('Could not read one or more files.')
    }
  }

  function removeGalleryImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  async function saveProduct(e) {
    e.preventDefault()
    const data = { ...form, price: Number(form.price) || 0, discount: Number(form.discount) || 0, images: form.images || [] }
    if (form.id) {
      await setProducts({ ...data, id: form.id })
    } else {
      const id = `p${Date.now()}`
      await setProducts({ ...data, id })
    }
    resetForm()
  }

  function deleteProduct(id) {
    if (confirm('Delete this product?')) {
      removeProduct(id)
    }
  }

  const input =
    'w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand text-sm'
  const label = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold">Admin Panel</h1>
        <div className="flex items-center gap-3">
          {adminUser && <span className="text-sm text-slate-500">{adminUser.email}</span>}
          <button onClick={logoutAdmin} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition">
            Logout
          </button>
        </div>
      </div>
      <p className="text-slate-500 mb-6">Manage your products, orders and store settings.</p>

      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
          <form onSubmit={saveProduct} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 lg:sticky lg:top-24">
            <h2 className="font-bold">{form.id ? 'Edit product' : 'Add product'}</h2>

            <div>
              <label className={label}>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
            </div>

            <div>
              <label className={label}>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product details, specs, features..."
                className={input}
              />
            </div>

            <div>
              <label className={label}>Main photo</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="Paste an image URL, or upload below"
                className={input}
              />
              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                  📷 Upload photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                ) : (
                  <span className="w-14 h-14 rounded-lg grid place-items-center text-2xl border border-dashed border-slate-300 text-slate-400">
                    {form.emoji}
                  </span>
                )}
              </div>
              {form.image && (
                <button type="button" onClick={() => setForm({ ...form, image: '' })} className="text-xs text-slate-500 hover:text-brand mt-1">
                  Remove photo (fall back to emoji)
                </button>
              )}
            </div>

            <div>
              <label className={label}>Additional gallery images</label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                🖼️ Add images (select multiple)
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              </label>
              {form.images && form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold grid place-items-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Emoji</label>
                <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className={input} />
              </div>
              <div>
                <label className={label}>Price ({settings.currency})</label>
                <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={input} />
              </div>
              <div>
                <label className={label}>Discount (%)</label>
                <input type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className={input} />
              </div>
            </div>

            <div>
              <label className={label}>Background color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full border-2 ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="w-4 h-4"
              />
              In stock
            </label>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark">
                {form.id ? 'Save changes' : 'Add product'}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden grid place-items-center text-3xl" style={{ background: `${p.color}33` }}>
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {p.name}
                    {!p.inStock && <span className="ml-2 text-[10px] font-bold uppercase text-rose-500">Out of stock</span>}
                  </p>
                  <p className="text-sm text-slate-500">
                    {money(p.price, settings.currency)}
                    {p.discount > 0 && <span className="text-emerald-600 font-medium"> · -{p.discount}%</span>}
                    {p.images && p.images.length > 0 && <span className="ml-2 text-xs text-slate-400">+{p.images.length} images</span>}
                  </p>
                </div>
                <button onClick={() => setForm(p)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-sm font-semibold hover:bg-slate-200">
                  Edit
                </button>
                <button onClick={() => deleteProduct(p.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <div className="text-6xl mb-3">🧾</div>
              <p className="font-medium">No orders yet. They will appear here when customers place them.</p>
            </div>
          ) : (
            orders.map((o) => {
              const meta = orderStatusMeta(o.status)
              return (
                <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">{o.id}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(o.createdAt).toLocaleString()} · {o.customerName} · {o.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-600">📍 {o.address}</p>
                    <div className="mt-2 space-y-1">
                      {o.items.map((i) => (
                        <p key={i.productId} className="text-slate-600">
                          • {i.name} × {i.qty} — {money(i.price * i.qty, settings.currency)}
                        </p>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{money(o.total, settings.currency)}</span>
                    </div>
                    {o.promoCode && <p className="mt-1 text-xs text-emerald-600 font-medium">Promo {o.promoCode} applied</p>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          {[
            { key: 'storeName', label: 'Store name' },
            { key: 'tagline', label: 'Tagline' },
            { key: 'whatsapp', label: 'WhatsApp number (for orders)', placeholder: 'e.g. 233241234567' },
            { key: 'currency', label: 'Currency symbol', placeholder: 'e.g. GH₵' },
          ].map((f) => (
            <div key={f.key}>
              <label className={label}>{f.label}</label>
              <input
                value={settings[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className={input}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Delivery fee</label>
              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Promo code</label>
              <input
                value={settings.promoCode}
                onChange={(e) => setSettings({ ...settings, promoCode: e.target.value.toUpperCase() })}
                className={input}
              />
            </div>
          </div>

          <div>
            <label className={label}>Promo discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.promoDiscount}
              onChange={(e) => setSettings({ ...settings, promoDiscount: e.target.value })}
              className={input}
            />
          </div>

          <p className="text-xs text-slate-500">All changes save automatically to the cloud.</p>
        </div>
      )}
    </div>
  )
}
