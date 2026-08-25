import { Router } from 'express'
import { query, run, saveDB } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', (req, res) => {
  const products = query('SELECT * FROM products').map((r) => ({ ...r, inStock: !!r.inStock }))
  res.json(products)
})

router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params
  const { name, category, price, discount, image, emoji, color, inStock } = req.body

  const existing = query('SELECT id FROM products WHERE id = ?', [id])
  if (existing.length > 0) {
    run('UPDATE products SET name = ?, category = ?, price = ?, discount = ?, image = ?, emoji = ?, color = ?, inStock = ? WHERE id = ?',
      [name, category, price, discount || 0, image || '', emoji || '', color || '#6366f1', inStock ? 1 : 0, id])
  } else {
    run('INSERT INTO products (id, name, category, price, discount, image, emoji, color, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, category, price, discount || 0, image || '', emoji || '', color || '#6366f1', inStock ? 1 : 0])
  }
  saveDB()
  res.json({ ok: true })
})

router.delete('/:id', requireAdmin, (req, res) => {
  run('DELETE FROM products WHERE id = ?', [req.params.id])
  saveDB()
  res.json({ ok: true })
})

export default router
