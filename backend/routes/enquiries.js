const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../db/database.js')
const { verifyToken, requireRole } = require('../middleware/auth.js')

const router = express.Router()

// POST /api/enquiries — public (from website contact forms)
router.post('/', (req, res) => {
  const { name, phone, email, company, message, subject } = req.body
  if (!name || !name.trim() || !message || !message.trim()) {
    return res.status(400).json({ error: 'Name and message are required' })
  }
  const id = uuidv4()
  db.prepare(`
    INSERT INTO enquiries (id, name, phone, email, company, message, subject)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name.trim(), phone || '', email || '', company || '', message.trim(), subject || 'General Enquiry')
  return res.status(201).json({ message: 'Enquiry submitted successfully', id })
})

// GET /api/enquiries — staff+
router.get('/', verifyToken, requireRole('staff'), (req, res) => {
  const { status } = req.query
  let q = 'SELECT * FROM enquiries WHERE 1=1'
  const params = []
  if (status && status !== 'All') { q += ' AND status = ?'; params.push(status) }
  q += ' ORDER BY created_at DESC'
  return res.json(db.prepare(q).all(...params))
})

// GET /api/enquiries/:id — staff+
router.get('/:id', verifyToken, requireRole('staff'), (req, res) => {
  const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id)
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
  return res.json(enquiry)
})

// PUT /api/enquiries/:id — staff+ (update status and notes)
router.put('/:id', verifyToken, requireRole('staff'), (req, res) => {
  if (!db.prepare('SELECT id FROM enquiries WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Enquiry not found' })
  }
  const { status, notes } = req.body
  db.prepare("UPDATE enquiries SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?").run(
    status || 'New', notes !== undefined ? notes : '', req.params.id)
  return res.json(db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id))
})

// DELETE /api/enquiries/:id — manager+
router.delete('/:id', verifyToken, requireRole('manager'), (req, res) => {
  if (!db.prepare('SELECT id FROM enquiries WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Enquiry not found' })
  }
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id)
  return res.json({ message: 'Enquiry deleted' })
})

module.exports = router
