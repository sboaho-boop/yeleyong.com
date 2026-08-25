import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'store.db')

let db = null

function save() {
  const data = db.export()
  fs.writeFileSync(DB_PATH, Buffer.from(data))
}

let saveTimer = null
export function saveDB() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(save, 300)
}

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Samsung Galaxy A15', category: 'Phones', price: 1500, discount: 5, image: img('1511707171634-5f897ff02aa9'), emoji: '📱', color: '#6366f1', inStock: 1 },
  { id: 'p2', name: 'iPhone 14 Pro', category: 'Phones', price: 5500, discount: 0, image: img('1592743399245-40052a05e8e4'), emoji: '📱', color: '#0ea5e9', inStock: 1 },
  { id: 'p3', name: 'Tecno Spark 20', category: 'Phones', price: 1200, discount: 10, image: img('1585060750685-32af941e7fd0'), emoji: '📱', color: '#22c55e', inStock: 1 },
  { id: 'p4', name: 'Infinix Hot 40', category: 'Phones', price: 1100, discount: 0, image: img('1565849904461-a8e81571b385'), emoji: '📱', color: '#f59e0b', inStock: 1 },
  { id: 'p5', name: 'Samsung Galaxy S24', category: 'Phones', price: 6200, discount: 5, image: img('1610945415295-d9bbf067e59c'), emoji: '📱', color: '#a855f7', inStock: 1 },
  { id: 'p6', name: 'Wireless Earbuds Pro', category: 'Accessories', price: 180, discount: 15, image: img('1505740420928-5e560c06d30e'), emoji: '🎧', color: '#06b6d4', inStock: 1 },
  { id: 'p7', name: 'Bluetooth Headphones', category: 'Accessories', price: 250, discount: 0, image: img('1583394838336-acd977736f90'), emoji: '🎧', color: '#8b5cf6', inStock: 1 },
  { id: 'p8', name: 'Fast Charger 65W', category: 'Accessories', price: 120, discount: 10, image: img('1609091839314-dc0bfbe60f56'), emoji: '🔌', color: '#ef4444', inStock: 1 },
  { id: 'p9', name: 'Power Bank 20000mAh', category: 'Accessories', price: 200, discount: 0, image: img('1609582148258-3240f3e38065'), emoji: '🔋', color: '#22c55e', inStock: 1 },
  { id: 'p10', name: 'Tempered Glass Screen Protector', category: 'Accessories', price: 30, discount: 0, image: img('1592899677977-9c10ca588bbd'), emoji: '🛡️', color: '#64748b', inStock: 1 },
  { id: 'p11', name: 'Silicone Phone Case', category: 'Accessories', price: 50, discount: 0, image: img('1601784551446-20c9e07cdbdb'), emoji: '📱', color: '#f43f5e', inStock: 1 },
  { id: 'p12', name: 'USB-C Charging Cable (2m)', category: 'Accessories', price: 25, discount: 0, image: img('1558618666-fcd25c85f82e'), emoji: '🔌', color: '#d97706', inStock: 1 },
  { id: 'p13', name: 'Smart Watch Series 8', category: 'Accessories', price: 350, discount: 10, image: img('1546868871-af0de0ae72be'), emoji: '⌚', color: '#a855f7', inStock: 1 },
  { id: 'p14', name: 'Car Phone Mount', category: 'Accessories', price: 60, discount: 0, image: img('1558618666-fcd25c85f82e'), emoji: '🚗', color: '#0ea5e9', inStock: 1 },
]

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

export function query(sql, params = []) {
  if (params.length > 0) {
    const stmt = db.prepare(sql)
    stmt.bind(params)
    const results = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  }
  const result = db.exec(sql)
  if (result.length === 0) return []
  const { columns, values } = result[0]
  return values.map((row) => {
    const obj = {}
    columns.forEach((col, i) => { obj[col] = row[i] })
    return obj
  })
}

export function run(sql, params = []) {
  db.run(sql, params)
}

export async function initDB() {
  const SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      image TEXT DEFAULT '',
      emoji TEXT DEFAULT '',
      color TEXT DEFAULT '#6366f1',
      inStock INTEGER DEFAULT 1
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customerName TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT DEFAULT '',
      paymentMethod TEXT DEFAULT 'cod',
      items TEXT DEFAULT '[]',
      subtotal REAL DEFAULT 0,
      deliveryFee REAL DEFAULT 0,
      promoCode TEXT DEFAULT '',
      discount REAL DEFAULT 0,
      total REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      createdAt TEXT
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `)

  const r = query('SELECT COUNT(*) as count FROM products')
  if (r[0].count === 0) {
    for (const p of DEFAULT_PRODUCTS) {
      run('INSERT INTO products (id, name, category, price, discount, image, emoji, color, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.name, p.category, p.price, p.discount, p.image, p.emoji, p.color, p.inStock])
    }
  }

  const sr = query('SELECT COUNT(*) as count FROM settings')
  if (sr[0].count === 0) {
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, String(value)])
    }
  }

  save()
  return db
}

export function getDB() {
  return db
}
