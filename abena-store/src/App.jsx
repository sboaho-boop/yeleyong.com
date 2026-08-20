import { useState } from 'react'
import { StoreProvider, useStore } from './StoreContext'
import Navbar from './components/Navbar'
import ShopPage from './components/ShopPage'
import CartDrawer from './components/CartDrawer'
import CheckoutPage from './components/CheckoutPage'
import TrackPage from './components/TrackPage'
import AdminPage from './components/AdminPage'
import Footer from './components/Footer'

function App() {
  const { addToCart } = useStore()
  const [page, setPage] = useState('shop')
  const [cartOpen, setCartOpen] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState(null)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  function handleAdd(productId) {
    addToCart(productId)
  }

  function goCheckout() {
    setCartOpen(false)
    setPage('checkout')
  }

  function handleOrderPlaced(orderId) {
    setPlacedOrderId(orderId)
    setPage('track')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        setPage={setPage}
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
            goShop={() => setPage('shop')}
          />
        )}
        {page === 'track' && (
          <TrackPage
            placedOrderId={placedOrderId}
            onDismissPlaced={() => setPlacedOrderId(null)}
          />
        )}
        {page === 'admin' && <AdminPage />}
      </main>

      <Footer setPage={setPage} />

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
