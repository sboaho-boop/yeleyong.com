import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://yeleyong-com.onrender.com'

const StoreContext = createContext(null)

export const DEFAULT_SETTINGS = {
  storeName: 'YELEYONG PHONES AND ACCESSORIES',
  tagline: 'Quality phones and accessories at your doorstep',
  whatsapp: '233542391449',
  promoCode: 'YELO10',
  promoDiscount: 10,
  deliveryFee: 20,
  currency: 'GH₵',
  location: 'Adenta, Accra - Ghana',
}

export const CATEGORIES = ['All', 'Phones', 'Accessories']

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-sky-100 text-sky-700' },
  { id: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
]

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('yeleyong_cart')) || []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem('yeleyong_cart', JSON.stringify(cart))
}

function getToken() {
  return localStorage.getItem('yeleyong_admin_token') || ''
}

function setToken(token) {
  localStorage.setItem('yeleyong_admin_token', token)
}

function clearToken() {
  localStorage.removeItem('yeleyong_admin_token')
}

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, { ...opts, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(loadCart)
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pollingRef = useRef(null)

  useEffect(() => {
    async function init() {
      try {
        const [p, s] = await Promise.all([api('/api/products'), api('/api/settings')])
        setProducts(p)
        setSettings(s)

        const authRes = await api('/api/auth/me')
        if (authRes.loggedIn) {
          setAdminUser({ email: authRes.email })
        }
      } catch (e) {
        console.error('Init error:', e)
      }
      setLoading(false)
    }
    init()

    pollingRef.current = setInterval(async () => {
      try {
        const [p, s, o] = await Promise.all([
          api('/api/products'),
          api('/api/settings'),
          adminUser ? api('/api/orders') : Promise.resolve(null),
        ])
        setProducts(p)
        setSettings(s)
        if (o) setOrders(o)
      } catch {}
    }, 3000)

    return () => clearInterval(pollingRef.current)
  }, [adminUser])

  useEffect(() => saveCart(cart), [cart])

  const isAdminLoggedIn = !!adminUser

  async function registerAdmin(email, password) {
    try {
      const res = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(res.token)
      setAdminUser({ email })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  async function loginAdmin(email, password) {
    try {
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(res.token)
      setAdminUser({ email })
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  function logoutAdmin() {
    clearToken()
    setAdminUser(null)
  }

  function hasAdminAccount() {
    return true
  }

  function priceOf(product) {
    return product.price * (1 - (product.discount || 0) / 100)
  }

  function addToCart(productId, qty = 1) {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId)
      if (found) {
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { productId, qty }]
    })
  }

  function setQty(productId, qty) {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    )
  }

  function clearCart() {
    setCart([])
  }

  function cartDetails() {
    const lines = cart
      .map((i) => ({ item: i, product: products.find((p) => p.id === i.productId) }))
      .filter((l) => l.product)
    const subtotal = lines.reduce((s, l) => s + priceOf(l.product) * l.item.qty, 0)
    return { lines, subtotal }
  }

  async function placeOrder(details) {
    const res = await api('/api/orders', {
      method: 'POST',
      body: JSON.stringify(details),
    })
    clearCart()
    return { id: res.id, ...details }
  }

  async function updateOrderStatus(id, status) {
    await api(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  function getOrder(id) {
    return orders.find((o) => o.id.toUpperCase() === String(id).trim().toUpperCase())
  }

  async function saveProduct(product) {
    await api(`/api/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  async function deleteProduct(id) {
    await api(`/api/products/${id}`, { method: 'DELETE' })
  }

  async function saveSettings(newSettings) {
    await api('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(newSettings),
    })
  }

  const value = useMemo(
    () => ({
      products,
      setProducts: saveProduct,
      cart,
      addToCart,
      setQty,
      clearCart,
      cartDetails,
      priceOf,
      orders,
      placeOrder,
      updateOrderStatus,
      getOrder,
      settings,
      setSettings: saveSettings,
      adminUser,
      isAdminLoggedIn,
      registerAdmin,
      loginAdmin,
      logoutAdmin,
      hasAdminAccount,
      loading,
      deleteProduct,
    }),
    [products, cart, orders, settings, adminUser, loading],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function money(n, currency) {
  return `${currency}${n.toFixed(2)}`
}

export function orderStatusMeta(id) {
  return ORDER_STATUSES.find((s) => s.id === id) || ORDER_STATUSES[0]
}
