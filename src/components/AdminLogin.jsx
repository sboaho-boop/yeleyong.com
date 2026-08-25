import { useState } from 'react'
import { useStore } from '../StoreContext'

export default function AdminLogin() {
  const { registerAdmin, loginAdmin } = useStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const result = mode === 'register'
        ? await registerAdmin(email, password)
        : await loginAdmin(email, password)
      if (!result.ok) {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm'

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-900 text-white grid place-items-center text-2xl font-bold mb-3">
            Y
          </div>
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'register' ? 'Create your admin account' : 'Login to manage your store'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yeleyong.com"
              className={input}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className={input}
            />
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 transition"
          >
            {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError('') }} className="font-semibold text-slate-900 hover:underline">Register</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError('') }} className="font-semibold text-slate-900 hover:underline">Login</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
