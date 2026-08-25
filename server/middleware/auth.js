import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'abena-store-dev-secret-change-in-production'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  try {
    const decoded = verifyToken(header.slice(7))
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
