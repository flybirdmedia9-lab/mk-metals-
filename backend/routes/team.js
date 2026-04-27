const express = require('express')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const db = require('../db/database.js')
const { verifyToken, requireRole } = require('../middleware/auth.js')

const router = express.Router()
const VALID_ROLES = ['owner', 'manager', 'staff', 'viewer']

// GET /api/team — owner only
router.get('/', verifyToken, requireRole('owner'), (req, res) => {
  return res.json(db.prepare('SELECT id, name, email, role, is_active, created_at, last_login FROM users ORDER BY created_at ASC').all())
})

// POST /api/team — owner only
router.post('/', verifyToken, requireRole('owner'), (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' })
  }
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` })
  }
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim())) {
    return res.status(400).json({ error: 'This email is already registered' })
  }
  const id = uuidv4()
  db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
    id, name.trim(), email.toLowerCase().trim(), bcrypt.hashSync(password, 10), role)
  return res.status(201).json(db.prepare('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?').get(id))
})

// PUT /api/team/:id — owner only
router.put('/:id', verifyToken, requireRole('owner'), (req, res) => {
  const member = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id)
  if (!member) return res.status(404).json({ error: 'Team member not found' })
  const { name, email, role, is_active, password } = req.body
  if (req.params.id === req.user.id && role && role !== 'owner') {
    return res.status(400).json({ error: 'You cannot change your own role' })
  }
  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` })
  }
  if (password) {
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), req.params.id)
  }
  db.prepare('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role), is_active = COALESCE(?, is_active) WHERE id = ?').run(
    name || null, email ? email.toLowerCase().trim() : null, role || null,
    is_active !== undefined ? (is_active ? 1 : 0) : null, req.params.id)
  return res.json(db.prepare('SELECT id, name, email, role, is_active, created_at, last_login FROM users WHERE id = ?').get(req.params.id))
})

// DELETE /api/team/:id — owner only
router.delete('/:id', verifyToken, requireRole('owner'), (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account' })
  if (!db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Team member not found' })
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  return res.json({ message: 'Team member removed' })
})

module.exports = router
