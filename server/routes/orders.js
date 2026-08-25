import { Router } from 'express'
import { query, run, saveDB } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAdmin, (req, res) => {
  const orders = query('SELECT * FROM orders ORDER BY createdAt DESC').map((r) => ({ ...r, items: JSON.parse(r.items || '[]') }))
  res.json(orders)
})

router.post('/', (req, res) => {
  const { customerName, phone, address, notes, paymentMethod, items, subtotal, deliveryFee, promoCode, discount, total } = req.body
  const orderId = `YL-${Date.now().toString().slice(-6)}`

  run('INSERT INTO orders (id, customerName, phone, address, notes, paymentMethod, items, subtotal, deliveryFee, promoCode, discount, total, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [orderId, customerName || '', phone || '', address || '', notes || '', paymentMethod || 'cod', JSON.stringify(items || []), subtotal || 0, deliveryFee || 0, promoCode || '', discount || 0, total || 0, 'pending', new Date().toISOString()])
  saveDB()
  res.json({ ok: true, id: orderId })
})

router.patch('/:id', requireAdmin, (req, res) => {
  const { status } = req.body
  run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
  saveDB()
  res.json({ ok: true })
})

router.get('/:id', (req, res) => {
  const r = query('SELECT * FROM orders WHERE id = ?', [req.params.id])
  if (r.length === 0) return res.status(404).json({ error: 'Order not found' })
  res.json({ ...r[0], items: JSON.parse(r[0].items || '[]') })
})

export default router
