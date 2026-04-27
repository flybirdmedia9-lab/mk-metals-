const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db/database.js')
const { verifyToken } = require('../middleware/auth.js')

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email.toLowerCase().trim())
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id)
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

router.get('/me', verifyToken, (req, res) => {
  return res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } })
})

router.post('/logout', verifyToken, (req, res) => {
  return res.json({ message: 'Logged out' })
})

router.post('/change-password', verifyToken, (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Current password and new password (min 6 chars) required' })
  }
  const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id)
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ error: 'Current password is incorrect' })
  }
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.user.id)
  return res.json({ message: 'Password updated successfully' })
})

module.exports = router
