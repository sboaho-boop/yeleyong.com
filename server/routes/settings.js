import { Router } from 'express'
import { query, run, saveDB } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

const DEFAULT_SETTINGS = {
  storeName: 'YELEYONG PHONES AND ACCESSORIES',
  tagline: 'Quality phones and accessories at your doorstep',
  whatsapp: '233542391449',
  promoCode: 'YELO10',
  promoDiscount: 10,
  deliveryFee: 20,
  currency: 'GH₵',
  location: 'Adenta, Accra - Ghana',
}

const NUMERIC_KEYS = ['promoDiscount', 'deliveryFee']

router.get('/', (req, res) => {
  const settingsRows = query('SELECT * FROM settings')
  const settings = { ...DEFAULT_SETTINGS }
  for (const r of settingsRows) {
    if (NUMERIC_KEYS.includes(r.key)) {
      const num = Number(r.value)
      settings[r.key] = isNaN(num) ? r.value : num
    } else {
      settings[r.key] = r.value
    }
  }
  res.json(settings)
})

router.put('/', requireAdmin, (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    const existing = query('SELECT key FROM settings WHERE key = ?', [key])
    if (existing.length > 0) {
      run('UPDATE settings SET value = ? WHERE key = ?', [String(value), key])
    } else {
      run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, String(value)])
    }
  }
  saveDB()
  res.json({ ok: true })
})

export default router
