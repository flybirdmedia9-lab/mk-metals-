import { initialCategories, initialProducts } from './defaultData.js'

const STORAGE_KEYS = {
  products: 'mk_catalog_products',
  categories: 'mk_catalog_categories',
  enquiries: 'mk_catalog_enquiries',
  cart: 'mk_catalog_cart',
  adminToken: 'mk_admin_token',
}

const ADMIN_CREDENTIALS = {
  email: 'admin@mkmetals.in',
  password: '123456',
}

function readJson(key) {
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function initializeStorage() {
  if (!readJson(STORAGE_KEYS.categories)) {
    writeJson(STORAGE_KEYS.categories, initialCategories)
  }
  if (!readJson(STORAGE_KEYS.products)) {
    writeJson(STORAGE_KEYS.products, initialProducts)
  }
  if (!readJson(STORAGE_KEYS.enquiries)) {
    writeJson(STORAGE_KEYS.enquiries, [])
  }
  if (!readJson(STORAGE_KEYS.cart)) {
    writeJson(STORAGE_KEYS.cart, [])
  }
}

export function getProducts() {
  initializeStorage()
  return readJson(STORAGE_KEYS.products) || []
}

export function saveProducts(products) {
  writeJson(STORAGE_KEYS.products, products)
}

export function getCategories() {
  initializeStorage()
  return readJson(STORAGE_KEYS.categories) || []
}

export function saveCategories(categories) {
  writeJson(STORAGE_KEYS.categories, categories)
}

export function getEnquiries() {
  initializeStorage()
  return readJson(STORAGE_KEYS.enquiries) || []
}

export function saveEnquiries(enquiries) {
  writeJson(STORAGE_KEYS.enquiries, enquiries)
}

export function addEnquiry(enquiry) {
  const stored = getEnquiries()
  saveEnquiries([{ ...enquiry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...stored])
}

export function getCartItems() {
  initializeStorage()
  return readJson(STORAGE_KEYS.cart) || []
}

export function saveCartItems(items) {
  writeJson(STORAGE_KEYS.cart, items)
}

export function clearCartItems() {
  saveCartItems([])
}

export function getAdminToken() {
  return readJson(STORAGE_KEYS.adminToken)
}

export function setAdminToken(token) {
  writeJson(STORAGE_KEYS.adminToken, token)
}

export function clearAdminToken() {
  window.localStorage.removeItem(STORAGE_KEYS.adminToken)
}

export const adminCredentials = ADMIN_CREDENTIALS
