const express = require('express')
const db = require('../db/database.js')
const { verifyToken, requireRole } = require('../middleware/auth.js')

const router = express.Router()

function slugify(v) {
  return v.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '')
}

// GET /api/categories — public
router.get('/', (req, res) => {
  const cats = db.prepare('SELECT * FROM categories ORDER BY name ASC').all()
  return res.json(cats.map(c => ({
    ...c,
    productCount: db.prepare('SELECT COUNT(*) as n FROM products WHERE category_id = ?').get(c.id).n,
  })))
})

// GET /api/categories/:id — public
router.get('/:id', (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  if (!cat) return res.status(404).json({ error: 'Category not found' })
  return res.json(cat)
})

// POST /api/categories — manager+
router.post('/', verifyToken, requireRole('manager'), (req, res) => {
  const { name, description } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' })
  const id = slugify(name)
  if (db.prepare('SELECT id FROM categories WHERE id = ?').get(id)) {
    return res.status(400).json({ error: 'A category with this name already exists' })
  }
  db.prepare('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)').run(id, name.trim(), description || '')
  return res.status(201).json(db.prepare('SELECT * FROM categories WHERE id = ?').get(id))
})

// PUT /api/categories/:id — manager+
router.put('/:id', verifyToken, requireRole('manager'), (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  if (!cat) return res.status(404).json({ error: 'Category not found' })
  const { name, description } = req.body
  db.prepare("UPDATE categories SET name = ?, description = ?, updated_at = datetime('now') WHERE id = ?").run(
    name || cat.name, description !== undefined ? description : cat.description, req.params.id)
  return res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id))
})

// DELETE /api/categories/:id — owner only
router.delete('/:id', verifyToken, requireRole('owner'), (req, res) => {
  if (!db.prepare('SELECT id FROM categories WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Category not found' })
  }
  const count = db.prepare('SELECT COUNT(*) as n FROM products WHERE category_id = ?').get(req.params.id).n
  if (count > 0) return res.status(400).json({ error: `Remove or reassign the ${count} product(s) in this category first` })
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id)
  return res.json({ message: 'Category deleted' })
})

module.exports = router
