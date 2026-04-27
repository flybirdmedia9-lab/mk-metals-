const jwt = require('jsonwebtoken')
const db = require('../db/database.js')

const ROLE_LEVELS = { viewer: 1, staff: 2, manager: 3, owner: 4 }

function verifyToken(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = db.prepare('SELECT id, name, email, role, is_active FROM users WHERE id = ?').get(payload.userId)
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Account not found or inactive' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function requireRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if ((ROLE_LEVELS[req.user.role] || 0) < (ROLE_LEVELS[minRole] || 0)) {
      return res.status(403).json({ error: 'You do not have permission for this action' })
    }
    next()
  }
}

module.exports = { verifyToken, requireRole }
