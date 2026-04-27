require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const db = require('./database.js')

function seed() {
  const existingOwner = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@mkmetals.in')
  if (!existingOwner) {
    const hash = bcrypt.hashSync('Admin@123', 10)
    db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
      uuidv4(), 'Business Owner', 'admin@mkmetals.in', hash, 'owner'
    )
    console.log('Owner created — email: admin@mkmetals.in  password: Admin@123')
  }

  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c
  if (catCount === 0) {
    const cats = [
      { id: 'chemical-fixings', name: 'Chemical Fixings', description: 'High-performance anchors, injection mortars and resin systems for heavy-duty construction.' },
      { id: 'steel-fixings', name: 'Steel Fixings', description: 'Robust steel anchors, bolts and fasteners for structural installations.' },
      { id: 'sanitary-fixings', name: 'Sanitary Fixings', description: 'Reliable fixtures and mounting systems for bathrooms and sanitary environments.' },
      { id: 'plumbing-accessories', name: 'Plumbing Accessories', description: 'Water-saving components and spares designed for modern plumbing systems.' },
    ]
    const ins = db.prepare('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)')
    cats.forEach(c => ins.run(c.id, c.name, c.description))
    console.log('Default categories seeded.')
  }

  const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c
  if (prodCount === 0) {
    const products = [
      {
        id: 'fischer-em-plus', slug: 'fischer-em-plus',
        name: 'Fischer Injection Mortar FIS EM Plus', category_id: 'chemical-fixings',
        short_description: 'Structural injection mortar for rebar anchoring and heavy-load fixing.',
        description: 'FIS EM Plus is an approved epoxy mortar for highly demanding applications in concrete, cracked concrete and masonry.',
        price: '2,950', status: 'In stock', stock: 22, featured: 1, popular: 1,
        specs: JSON.stringify(['Pack size: 300 ml', 'Curing time: 24 h', 'Temperature range: -40°C to 80°C']),
      },
      {
        id: 'fischer-v-plus', slug: 'fischer-v-plus',
        name: 'Fischer Injection Mortar FIS V Plus', category_id: 'chemical-fixings',
        short_description: 'Versatile vinyl ester mortar for demanding anchoring applications.',
        description: 'FIS V Plus offers high adhesion and fast curing for critical anchoring installations.',
        price: '1,250', status: 'In stock', stock: 35, popular: 1,
        specs: JSON.stringify(['Pack size: 300 ml', 'Approvals: ETA, ICC-ES', 'Curing time: 5 min']),
      },
      {
        id: 'fischer-sto-z', slug: 'fischer-sto-z',
        name: 'Fischer Steel Anchor STO Z', category_id: 'steel-fixings',
        short_description: 'Heavy-duty through-bolt anchor for concrete and solid masonry.',
        description: 'Reliable carbon steel through-bolt for structural applications in concrete.',
        price: '450', status: 'In stock', stock: 120, latest: 1,
        specs: JSON.stringify(['Material: Carbon steel', 'Sizes: M8–M20', 'Corrosion protection: Zinc-plated']),
      },
      {
        id: 'neoperl-aerator', slug: 'neoperl-aerator',
        name: 'Neoperl Tap Aerator Set', category_id: 'plumbing-accessories',
        short_description: 'Water-saving tap aerators with flow restriction for Indian plumbing.',
        description: 'Neoperl aerators are high-quality, German-engineered flow regulators that reduce water consumption.',
        price: '350', status: 'In stock', stock: 200, featured: 1,
        specs: JSON.stringify(['Flow rate: 4–8 L/min', 'Thread: M22/M24', 'Material: Brass + plastic']),
      },
      {
        id: 'azud-filter', slug: 'azud-filter',
        name: 'Azud Helix Advanced Filter', category_id: 'plumbing-accessories',
        short_description: 'Self-cleaning disc filter for industrial and agricultural water filtration.',
        description: 'AZUD Helix Advanced uses patented disc technology for efficient filtration.',
        price: '', contact_for_price: 1, status: 'In stock', stock: 15, latest: 1,
        specs: JSON.stringify(['Filtration degree: 20–400 micron', 'Max pressure: 10 bar', 'Self-cleaning: Manual / automatic']),
      },
      {
        id: 'fischer-sanitary', slug: 'fischer-sanitary',
        name: 'Fischer Sanitary Frame Fixing Set', category_id: 'sanitary-fixings',
        short_description: 'Complete fixing kit for sanitary frames and heavy bathroom equipment.',
        description: 'Fischer sanitary fixing set provides a reliable, corrosion-resistant solution.',
        price: '890', status: 'Low stock', stock: 4, popular: 1,
        specs: JSON.stringify(['Includes: Anchors, bolts, seals', 'Suitable for: Ceramic, stone', 'Certification: CE']),
      },
    ]
    const ins = db.prepare(`
      INSERT INTO products (id, slug, name, category_id, short_description, description, price,
        contact_for_price, status, stock, featured, popular, latest, specs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    products.forEach(p => ins.run(
      p.id, p.slug, p.name, p.category_id, p.short_description || '', p.description || '',
      p.price || '', p.contact_for_price || 0, p.status, p.stock,
      p.featured || 0, p.popular || 0, p.latest || 0, p.specs
    ))
    console.log('Default products seeded.')
  }

  console.log('Seed complete.')
}

seed()
