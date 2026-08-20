import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const KEYS = {
  products: 'yeloyoung_products',
  cart: 'yeloyoung_cart',
  orders: 'yeloyoung_orders',
  settings: 'yeloyoung_settings',
  schema: 'yeloyoung_schema_version',
}

const SCHEMA_VERSION = 'v3-phones-accessories'

export const DEFAULT_SETTINGS = {
  storeName: 'YELOYOUNG PHONES AND ACCESSORIES',
  tagline: 'Quality phones and accessories at your doorstep',
  whatsapp: '233542391449',
  promoCode: 'YELO10',
  promoDiscount: 10,
  deliveryFee: 20,
  currency: 'GH₵',
  location: 'Adenta, Accra - Ghana',
}

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

export const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Samsung Galaxy A15', category: 'Phones', price: 1500, discount: 5, image: img('1511707171634-5f897ff02aa9'), emoji: '📱', color: '#6366f1', inStock: true },
  { id: 'p2', name: 'iPhone 14 Pro', category: 'Phones', price: 5500, discount: 0, image: img('1592743399245-40052a05e8e4'), emoji: '📱', color: '#0ea5e9', inStock: true },
  { id: 'p3', name: 'Tecno Spark 20', category: 'Phones', price: 1200, discount: 10, image: img('1585060750685-32af941e7fd0'), emoji: '📱', color: '#22c55e', inStock: true },
  { id: 'p4', name: 'Infinix Hot 40', category: 'Phones', price: 1100, discount: 0, image: img('1565849904461-a8e81571b385'), emoji: '📱', color: '#f59e0b', inStock: true },
  { id: 'p5', name: 'Samsung Galaxy S24', category: 'Phones', price: 6200, discount: 5, image: img('1610945415295-d9bbf067e59c'), emoji: '📱', color: '#a855f7', inStock: true },
  { id: 'p6', name: 'Wireless Earbuds Pro', category: 'Accessories', price: 180, discount: 15, image: img('1505740420928-5e560c06d30e'), emoji: '🎧', color: '#06b6d4', inStock: true },
  { id: 'p7', name: 'Bluetooth Headphones', category: 'Accessories', price: 250, discount: 0, image: img('1583394838336-acd977736f90'), emoji: '🎧', color: '#8b5cf6', inStock: true },
  { id: 'p8', name: 'Fast Charger 65W', category: 'Accessories', price: 120, discount: 10, image: img('1609091839314-dc0bfbe60f56'), emoji: '🔌', color: '#ef4444', inStock: true },
  { id: 'p9', name: 'Power Bank 20000mAh', category: 'Accessories', price: 200, discount: 0, image: img('1609582148258-3240f3e38065'), emoji: '🔋', color: '#22c55e', inStock: true },
  { id: 'p10', name: 'Tempered Glass Screen Protector', category: 'Accessories', price: 30, discount: 0, image: img('1592899677977-9c10ca588bbd'), emoji: '🛡️', color: '#64748b', inStock: true },
  { id: 'p11', name: 'Silicone Phone Case', category: 'Accessories', price: 50, discount: 0, image: img('1601784551446-20c9e07cdbdb'), emoji: '📱', color: '#f43f5e', inStock: true },
  { id: 'p12', name: 'USB-C Charging Cable (2m)', category: 'Accessories', price: 25, discount: 0, image: img('1558618666-fcd25c85f82e'), emoji: '🔌', color: '#d97706', inStock: true },
  { id: 'p13', name: 'Smart Watch Series 8', category: 'Accessories', price: 350, discount: 10, image: img('1546868871-af0de0ae72be'), emoji: '⌚', color: '#a855f7', inStock: true },
  { id: 'p14', name: 'Car Phone Mount', category: 'Accessories', price: 60, discount: 0, image: img('1558618666-fcd25c85f82e'), emoji: '🚗', color: '#0ea5e9', inStock: true },
]

export const CATEGORIES = ['All', 'Phones', 'Accessories']

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-sky-100 text-sky-700' },
  { id: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    if (localStorage.getItem(KEYS.schema) !== SCHEMA_VERSION) {
      return DEFAULT_PRODUCTS
    }
    return load(KEYS.products, DEFAULT_PRODUCTS)
  })
  const [cart, setCart] = useState(() => load(KEYS.cart, []))
  const [orders, setOrders] = useState(() => load(KEYS.orders, []))
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...load(KEYS.settings, {}) }))

  useEffect(() => save(KEYS.products, products), [products])
  useEffect(() => {
    localStorage.setItem(KEYS.schema, SCHEMA_VERSION)
  }, [])
  useEffect(() => save(KEYS.cart, cart), [cart])
  useEffect(() => save(KEYS.orders, orders), [orders])
  useEffect(() => save(KEYS.settings, settings), [settings])

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

  function placeOrder(details) {
    const order = {
      id: `YL-${Date.now().toString().slice(-6)}`,
      ...details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    clearCart()
    return order
  }

  function updateOrderStatus(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  function getOrder(id) {
    return orders.find((o) => o.id.toUpperCase() === String(id).trim().toUpperCase())
  }

  const value = useMemo(
    () => ({
      products,
      setProducts,
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
      setSettings,
    }),
    [products, cart, orders, settings],
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
