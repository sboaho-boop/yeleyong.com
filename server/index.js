import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDB } from './db.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import settingsRouter from './routes/settings.js'
import authRouter from './routes/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function start() {
  await initDB()
  console.log('Database initialized')

  const app = express()
  const PORT = process.env.PORT || 3001

  app.use(cors())
  app.use(express.json())

  app.use('/api/products', productsRouter)
  app.use('/api/orders', ordersRouter)
  app.use('/api/settings', settingsRouter)
  app.use('/api/auth', authRouter)

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() })
  })

  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'))
    }
  })

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
