const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../db/database.js')
const { verifyToken, requireRole } = require('../middleware/auth.js')

const router = express.Router()

function parseProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_id,
    category_id: row.category_id,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    offerPrice: row.offer_price,
    contactForPrice: Boolean(row.contact_for_price),
    status: row.status,
    stock: row.stock,
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    latest: Boolean(row.latest),
    image: row.image,
    brand: row.brand,
    sku: row.sku,
    unit: row.unit,
    technicalDetails: row.technical_details,
    application: row.application,
    specs: (() => { try { return JSON.parse(row.specs || '[]') } catch { return [] } })(),
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    whatsappEnabled: Boolean(row.whatsapp_enabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    categoryName: row.category_name || null,
  }
}

// GET /api/products — public
router.get('/', (req, res) => {
  const { category, featured, popular, latest, search, status } = req.query
  let q = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1'
  const params = []
  if (category) { q += ' AND p.category_id = ?'; params.push(category) }
  if (featured === 'true') q += ' AND p.featured = 1'
  if (popular === 'true') q += ' AND p.popular = 1'
  if (latest === 'true') q += ' AND p.latest = 1'
  if (status) { q += ' AND p.status = ?'; params.push(status) }
  if (search) { q += ' AND (p.name LIKE ? OR p.short_description LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
  q += ' ORDER BY p.created_at DESC'
  return res.json(db.prepare(q).all(...params).map(parseProduct))
})

// GET /api/products/:id — public
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? OR p.slug = ?').get(req.params.id, req.params.id)
  if (!row) return res.status(404).json({ error: 'Product not found' })
  return res.json(parseProduct(row))
})

// POST /api/products — manager+
router.post('/', verifyToken, requireRole('manager'), (req, res) => {
  const { name, slug, category, shortDescription, description, price, offerPrice, contactForPrice,
    status, stock, featured, popular, latest, image, brand, sku, unit,
    technicalDetails, application, specs, metaTitle, metaDescription, whatsappEnabled } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Product name is required' })
  const id = uuidv4()
  const productSlug = (slug || name).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-')
  if (db.prepare('SELECT id FROM products WHERE slug = ?').get(productSlug)) {
    return res.status(400).json({ error: 'A product with this slug already exists' })
  }
  db.prepare(`
    INSERT INTO products (id, slug, name, category_id, short_description, description, price, offer_price,
      contact_for_price, status, stock, featured, popular, latest, image, brand, sku, unit,
      technical_details, application, specs, meta_title, meta_description, whatsapp_enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, productSlug, name.trim(), category || null, shortDescription || '', description || '',
    price || '', offerPrice || '', contactForPrice ? 1 : 0, status || 'In stock',
    parseInt(stock) || 0, featured ? 1 : 0, popular ? 1 : 0, latest ? 1 : 0,
    image || '', brand || '', sku || '', unit || 'pcs',
    technicalDetails || '', application || '', JSON.stringify(specs || []),
    metaTitle || '', metaDescription || '', whatsappEnabled !== false ? 1 : 0)
  return res.status(201).json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(id)))
})

// PUT /api/products/:id — manager+
router.put('/:id', verifyToken, requireRole('manager'), (req, res) => {
  if (!db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Product not found' })
  }
  const { name, slug, category, shortDescription, description, price, offerPrice, contactForPrice,
    status, stock, featured, popular, latest, image, brand, sku, unit,
    technicalDetails, application, specs, metaTitle, metaDescription, whatsappEnabled } = req.body
  db.prepare(`
    UPDATE products SET name = ?, slug = ?, category_id = ?, short_description = ?, description = ?,
      price = ?, offer_price = ?, contact_for_price = ?, status = ?, stock = ?,
      featured = ?, popular = ?, latest = ?, image = ?, brand = ?, sku = ?, unit = ?,
      technical_details = ?, application = ?, specs = ?, meta_title = ?, meta_description = ?,
      whatsapp_enabled = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(name, slug, category || null, shortDescription || '', description || '',
    price || '', offerPrice || '', contactForPrice ? 1 : 0, status || 'In stock',
    parseInt(stock) || 0, featured ? 1 : 0, popular ? 1 : 0, latest ? 1 : 0,
    image || '', brand || '', sku || '', unit || 'pcs',
    technicalDetails || '', application || '', JSON.stringify(specs || []),
    metaTitle || '', metaDescription || '', whatsappEnabled !== false ? 1 : 0,
    req.params.id)
  return res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)))
})

// DELETE /api/products/:id — manager+
router.delete('/:id', verifyToken, requireRole('manager'), (req, res) => {
  if (!db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Product not found' })
  }
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  return res.json({ message: 'Product deleted' })
})

// PATCH /api/products/:id/stock — staff+
router.patch('/:id/stock', verifyToken, requireRole('staff'), (req, res) => {
  const { stock, change, reason } = req.body
  const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  let newStock
  if (typeof change === 'number') newStock = Math.max(0, product.stock + change)
  else if (typeof stock === 'number') newStock = Math.max(0, stock)
  else return res.status(400).json({ error: 'Provide stock or change value' })
  const newStatus = newStock === 0 ? 'Out of stock' : newStock <= 5 ? 'Low stock' : 'In stock'
  db.prepare("UPDATE products SET stock = ?, status = ?, updated_at = datetime('now') WHERE id = ?").run(newStock, newStatus, req.params.id)
  db.prepare('INSERT INTO stock_history (product_id, change, previous_stock, new_stock, reason, changed_by) VALUES (?, ?, ?, ?, ?, ?)').run(
    product.id, newStock - product.stock, product.stock, newStock, reason || '', req.user.email)
  return res.json({ id: product.id, stock: newStock, status: newStatus })
})

// PATCH /api/products/:id/featured — manager+
router.patch('/:id/featured', verifyToken, requireRole('manager'), (req, res) => {
  if (!db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ error: 'Product not found' })
  }
  const { featured, popular, latest } = req.body
  const sets = []
  const vals = []
  if (featured !== undefined) { sets.push('featured = ?'); vals.push(featured ? 1 : 0) }
  if (popular !== undefined) { sets.push('popular = ?'); vals.push(popular ? 1 : 0) }
  if (latest !== undefined) { sets.push('latest = ?'); vals.push(latest ? 1 : 0) }
  if (!sets.length) return res.status(400).json({ error: 'No fields to update' })
  vals.push(req.params.id)
  db.prepare(`UPDATE products SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...vals)
  return res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)))
})

// GET /api/products/:id/stock-history — staff+
router.get('/:id/stock-history', verifyToken, requireRole('staff'), (req, res) => {
  return res.json(db.prepare('SELECT * FROM stock_history WHERE product_id = ? ORDER BY created_at DESC LIMIT 50').all(req.params.id))
})

module.exports = router
