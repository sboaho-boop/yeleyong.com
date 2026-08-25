import { useState, useEffect } from 'react'
import { StoreProvider, useStore } from './StoreContext'
import Navbar from './components/Navbar'
import ShopPage from './components/ShopPage'
import CartDrawer from './components/CartDrawer'
import CheckoutPage from './components/CheckoutPage'
import TrackPage from './components/TrackPage'
import AdminPage from './components/AdminPage'
import AdminLogin from './components/AdminLogin'
import Footer from './components/Footer'

function App() {
  const { addToCart, isAdminLoggedIn, loading } = useStore()
  const [page, setPage] = useState(() => window.location.hash === '#admin' ? 'admin' : 'shop')
  const [cartOpen, setCartOpen] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState(null)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === '#admin') {
        setPage('admin')
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(newPage) {
    setPage(newPage)
    if (newPage === 'admin') {
      window.location.hash = 'admin'
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  function handleAdd(productId) {
    addToCart(productId)
  }

  function goCheckout() {
    setCartOpen(false)
    navigate('checkout')
  }

  function handleOrderPlaced(orderId) {
    setPlacedOrderId(orderId)
    navigate('track')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        setPage={navigate}
        onCartOpen={() => setCartOpen(true)}
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />

      <main className="flex-1">
        {page === 'shop' && (
          <ShopPage
            onAdd={handleAdd}
            goCheckout={goCheckout}
            category={category}
            setCategory={setCategory}
            query={query}
          />
        )}
        {page === 'checkout' && (
          <CheckoutPage
            onOrderPlaced={handleOrderPlaced}
            goShop={() => navigate('shop')}
          />
        )}
        {page === 'track' && (
          <TrackPage
            placedOrderId={placedOrderId}
            onDismissPlaced={() => setPlacedOrderId(null)}
          />
        )}
        {page === 'admin' && (isAdminLoggedIn ? <AdminPage /> : <AdminLogin />)}
      </main>

      <Footer setPage={navigate} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={goCheckout}
      />
    </div>
  )
}

export default function Root() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  )
}
