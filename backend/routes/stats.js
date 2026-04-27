const express = require('express')
const db = require('../db/database.js')
const { verifyToken } = require('../middleware/auth.js')

const router = express.Router()

// GET /api/stats — all authenticated users
router.get('/', verifyToken, (req, res) => {
  const g = (q, ...p) => db.prepare(q).get(...p)
  const stats = {
    totalProducts: g('SELECT COUNT(*) as n FROM products').n,
    totalCategories: g('SELECT COUNT(*) as n FROM categories').n,
    totalEnquiries: g('SELECT COUNT(*) as n FROM enquiries').n,
    newEnquiries: g("SELECT COUNT(*) as n FROM enquiries WHERE status = 'New'").n,
    featured: g('SELECT COUNT(*) as n FROM products WHERE featured = 1').n,
    popular: g('SELECT COUNT(*) as n FROM products WHERE popular = 1').n,
    latest: g('SELECT COUNT(*) as n FROM products WHERE latest = 1').n,
    lowStock: g("SELECT COUNT(*) as n FROM products WHERE status = 'Low stock'").n,
    outOfStock: g("SELECT COUNT(*) as n FROM products WHERE status = 'Out of stock'").n,
    totalTeam: g('SELECT COUNT(*) as n FROM users').n,
  }
  const recentEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5').all()
  const recentProducts = db.prepare(`
    SELECT p.*, c.name as category_name FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC LIMIT 6
  `).all().map(p => ({ ...p, featured: Boolean(p.featured), popular: Boolean(p.popular), latest: Boolean(p.latest) }))

  return res.json({ stats, recentEnquiries, recentProducts })
})

module.exports = router
