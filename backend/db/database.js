const { DatabaseSync } = require('node:sqlite')
const path = require('path')

const DB_PATH = path.join(__dirname, '..', 'mk_metalsand.db')
const db = new DatabaseSync(DB_PATH)

db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id TEXT,
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    price TEXT DEFAULT '',
    offer_price TEXT DEFAULT '',
    contact_for_price INTEGER DEFAULT 0,
    status TEXT DEFAULT 'In stock',
    stock INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    popular INTEGER DEFAULT 0,
    latest INTEGER DEFAULT 0,
    image TEXT DEFAULT '',
    brand TEXT DEFAULT '',
    sku TEXT DEFAULT '',
    unit TEXT DEFAULT 'pcs',
    technical_details TEXT DEFAULT '',
    application TEXT DEFAULT '',
    specs TEXT DEFAULT '[]',
    meta_title TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    whatsapp_enabled INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    company TEXT DEFAULT '',
    message TEXT DEFAULT '',
    subject TEXT DEFAULT 'General Enquiry',
    status TEXT DEFAULT 'New',
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS stock_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    change INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT DEFAULT '',
    changed_by TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

module.exports = db
