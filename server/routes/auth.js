import { Router } from 'express'
import bcrypt from 'bcrypt'
import { query, run, saveDB } from '../db.js'
import { signToken, verifyToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const existing = query('SELECT id FROM admins WHERE email = ?', [email])
  if (existing.length > 0) return res.status(409).json({ error: 'An admin account already exists. Please login instead.' })

  const hash = await bcrypt.hash(password, 10)
  run('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hash])
  saveDB()
  const token = signToken({ email })
  res.json({ ok: true, token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const r = query('SELECT * FROM admins WHERE email = ?', [email])
  if (r.length === 0) return res.status(401).json({ error: 'Incorrect email or password.' })

  const match = await bcrypt.compare(password, r[0].password)
  if (!match) return res.status(401).json({ error: 'Incorrect email or password.' })

  const token = signToken({ email })
  res.json({ ok: true, token })
})

router.get('/me', (req, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return res.json({ loggedIn: false })
  try {
    const decoded = verifyToken(header.slice(7))
    res.json({ loggedIn: true, email: decoded.email })
  } catch {
    res.json({ loggedIn: false })
  }
})

export default router
