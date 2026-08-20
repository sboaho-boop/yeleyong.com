import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const KEYS = {
  products: 'yeloyoung_products',
  cart: 'yeloyoung_cart',
  orders: 'yeloyoung_orders',
  settings: 'yeloyoung_settings',
  schema: 'yeloyoung_schema_version',
}

const SCHEMA_VERSION = 'v2-real-products'

export const DEFAULT_SETTINGS = {
  storeName: 'YELOYOUNG AND ACCESORIES',
  tagline: 'Quality general goods at your doorstep',
  whatsapp: '233542391449',
  promoCode: 'YELO10',
  promoDiscount: 10,
  deliveryFee: 20,
  currency: 'GH₵',
  location: 'Adenta, Accra - Ghana',
}

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

export const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Nike-Style Running Sneaker', category: 'Fashion', price: 350, discount: 10, image: img('1542291026-7eec264c27ff'), emoji: '👟', color: '#ef4444', inStock: true },
  { id: 'p2', name: 'Classic White Sneakers (Pair)', category: 'Fashion', price: 220, discount: 0, image: img('1549298916-b41d501d3772'), emoji: '👟', color: '#0ea5e9', inStock: true },
  { id: 'p3', name: 'Men\'s Leather Wristwatch', category: 'Fashion', price: 380, discount: 5, image: img('1523275335684-37898b6baf30'), emoji: '⌚', color: '#a855f7', inStock: true },
  { id: 'p4', name: 'Aviator Sunglasses', category: 'Fashion', price: 90, discount: 0, image: img('1572635196237-14b3f281503f'), emoji: '🕶️', color: '#f59e0b', inStock: true },
  { id: 'p5', name: '100% Cotton T-Shirt (Pack of 2)', category: 'Fashion', price: 130, discount: 0, image: img('1521572163474-6864f9cf17ab'), emoji: '👕', color: '#64748b', inStock: true },
  { id: 'p6', name: 'Ladies\' Classic Handbag', category: 'Fashion', price: 250, discount: 15, image: img('1584917865442-de89df76afd3'), emoji: '👜', color: '#f43f5e', inStock: true },
  { id: 'p7', name: 'Instant Camera', category: 'Electronics', price: 850, discount: 10, image: img('1526170375885-4d8ecf77b99f'), emoji: '📷', color: '#22c55e', inStock: true },
  { id: 'p8', name: 'Wireless Headphones', category: 'Electronics', price: 320, discount: 0, image: img('1505740420928-5e560c06d30e'), emoji: '🎧', color: '#06b6d4', inStock: true },
  { id: 'p9', name: 'Smartphone (Unlocked)', category: 'Electronics', price: 1200, discount: 0, image: img('1511707171634-5f897ff02aa9'), emoji: '📱', color: '#6366f1', inStock: true },
  { id: 'p10', name: 'Designer Perfume 100ml', category: 'Beauty', price: 260, discount: 0, image: img('1541643600914-78b084683601'), emoji: '🌸', color: '#8b5cf6', inStock: true },
  { id: 'p11', name: 'Skincare Cream Set', category: 'Beauty', price: 150, discount: 20, image: img('1526947425960-945c6e72858f'), emoji: '🧴', color: '#ec4899', inStock: true },
  { id: 'p12', name: 'Kitchen Utensils Set', category: 'Home', price: 480, discount: 5, image: img('1556911220-bff31c812dba'), emoji: '🍳', color: '#ef4444', inStock: true },
  { id: 'p13', name: 'Roasted Coffee Beans 250g', category: 'Food', price: 95, discount: 0, image: img('1447933601403-0c6688de566e'), emoji: '☕', color: '#92400e', inStock: true },
  { id: 'p14', name: 'Gold-Plated Necklace', category: 'Fashion', price: 310, discount: 0, image: img('1599643478518-a784e5dc4c8f'), emoji: '📿', color: '#d97706', inStock: true },
]

export const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Electronics', 'Home', 'Food']

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
