import {
  adminCredentials,
  getCategories,
  getEnquiries,
  getProducts,
  initializeStorage,
  saveCategories,
  saveEnquiries,
  saveProducts,
} from '../data/storage.js'

const TOKEN_KEY = 'mk_jwt_token'
const ROLE_LEVELS = { viewer: 1, staff: 2, manager: 3, owner: 4 }

const LOCAL_KEYS = {
  team: 'mk_catalog_team',
  stockHistory: 'mk_catalog_stock_history',
}

const ENV_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim()
const BASE_URL = ENV_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')
const USE_LOCAL_API = import.meta.env.VITE_USE_LOCAL_API === 'true' || (import.meta.env.PROD && !ENV_BASE_URL)

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function nowIso() {
  return new Date().toISOString()
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

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

function parseNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function deriveStatus(stock) {
  if (stock <= 0) return 'Out of stock'
  if (stock <= 5) return 'Low stock'
  return 'In stock'
}

function createId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getLocalTeam() {
  ensureLocalData()
  return readJson(LOCAL_KEYS.team) || []
}

function saveLocalTeam(team) {
  writeJson(LOCAL_KEYS.team, team)
}

function getLocalStockHistory() {
  ensureLocalData()
  return readJson(LOCAL_KEYS.stockHistory) || []
}

function saveLocalStockHistory(history) {
  writeJson(LOCAL_KEYS.stockHistory, history)
}

function getCategoryMap() {
  const categories = getCategories()
  return new Map(categories.map((category) => [category.id, category]))
}

function normalizeProduct(product) {
  const categoryMap = getCategoryMap()
  const category = product.category || product.category_id || ''
  const createdAt = product.createdAt || product.created_at || nowIso()
  const updatedAt = product.updatedAt || product.updated_at || createdAt
  const stock = parseNumber(product.stock, 0)
  const specs = Array.isArray(product.specs)
    ? product.specs.filter((spec) => String(spec || '').trim())
    : []

  return {
    id: product.id,
    slug: product.slug || slugify(product.name || product.id),
    name: product.name || '',
    category,
    category_id: category || null,
    shortDescription: product.shortDescription ?? product.short_description ?? '',
    description: product.description || '',
    price: product.price || '',
    offerPrice: product.offerPrice ?? product.offer_price ?? '',
    contactForPrice: toBoolean(product.contactForPrice ?? product.contact_for_price),
    status: product.status || deriveStatus(stock),
    stock,
    featured: toBoolean(product.featured),
    popular: toBoolean(product.popular),
    latest: toBoolean(product.latest),
    image: product.image || '',
    brand: product.brand || '',
    sku: product.sku || '',
    unit: product.unit || 'pcs',
    technicalDetails: product.technicalDetails ?? product.technical_details ?? '',
    application: product.application || '',
    specs,
    metaTitle: product.metaTitle ?? product.meta_title ?? '',
    metaDescription: product.metaDescription ?? product.meta_description ?? '',
    whatsappEnabled: product.whatsappEnabled !== false && product.whatsapp_enabled !== 0,
    createdAt,
    updatedAt,
    created_at: createdAt,
    updated_at: updatedAt,
    categoryName: categoryMap.get(category)?.name || null,
  }
}

function normalizeEnquiry(enquiry) {
  const createdAt = enquiry.created_at || enquiry.createdAt || nowIso()
  const updatedAt = enquiry.updated_at || enquiry.updatedAt || createdAt
  return {
    id: enquiry.id,
    name: enquiry.name || '',
    phone: enquiry.phone || '',
    email: enquiry.email || '',
    company: enquiry.company || '',
    message: enquiry.message || '',
    subject: enquiry.subject || 'General Enquiry',
    status: enquiry.status || 'New',
    notes: enquiry.notes || '',
    created_at: createdAt,
    updated_at: updatedAt,
  }
}

function toStoredProduct(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    offerPrice: product.offerPrice,
    contactForPrice: product.contactForPrice,
    status: product.status,
    stock: product.stock,
    featured: product.featured,
    popular: product.popular,
    latest: product.latest,
    image: product.image,
    brand: product.brand,
    sku: product.sku,
    unit: product.unit,
    technicalDetails: product.technicalDetails,
    application: product.application,
    specs: product.specs,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    whatsappEnabled: product.whatsappEnabled,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

function createLocalToken(userId) {
  const payload = JSON.stringify({ userId, local: true, ts: Date.now() })
  return `local.${btoa(payload)}`
}

function parseLocalToken(token) {
  if (!token || !token.startsWith('local.')) return null
  try {
    const decoded = JSON.parse(atob(token.slice(6)))
    return decoded.userId
  } catch {
    return null
  }
}

function toPublicUser(member) {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    is_active: member.is_active ? 1 : 0,
    created_at: member.created_at,
    last_login: member.last_login || null,
  }
}

function ensureLocalData() {
  initializeStorage()

  const now = nowIso()

  if (!Array.isArray(readJson(LOCAL_KEYS.stockHistory))) {
    writeJson(LOCAL_KEYS.stockHistory, [])
  }

  const existingTeam = readJson(LOCAL_KEYS.team)
  if (!Array.isArray(existingTeam) || existingTeam.length === 0) {
    writeJson(LOCAL_KEYS.team, [
      {
        id: 'owner-1',
        name: 'Business Owner',
        email: normalizeEmail(adminCredentials.email || 'admin@mkmetals.in'),
        password: adminCredentials.password || '123456',
        role: 'owner',
        is_active: true,
        created_at: now,
        last_login: null,
      },
    ])
  }

  const categories = getCategories()
  const normalizedCategories = categories.map((category) => ({
    ...category,
    created_at: category.created_at || now,
    updated_at: category.updated_at || category.created_at || now,
  }))
  if (JSON.stringify(categories) !== JSON.stringify(normalizedCategories)) {
    saveCategories(normalizedCategories)
  }

  const products = getProducts()
  const normalizedProducts = products.map((product) => toStoredProduct(normalizeProduct(product)))
  if (JSON.stringify(products) !== JSON.stringify(normalizedProducts)) {
    saveProducts(normalizedProducts)
  }

  const enquiries = getEnquiries()
  const normalizedEnquiries = enquiries.map(normalizeEnquiry)
  if (JSON.stringify(enquiries) !== JSON.stringify(normalizedEnquiries)) {
    saveEnquiries(normalizedEnquiries)
  }
}

function getAuthenticatedLocalUser() {
  ensureLocalData()
  const userId = parseLocalToken(getToken())
  if (!userId) {
    removeToken()
    return null
  }
  const user = getLocalTeam().find((member) => member.id === userId && member.is_active)
  if (!user) {
    removeToken()
    return null
  }
  return user
}

function requireLocalAuth(minRole = 'viewer') {
  const user = getAuthenticatedLocalUser()
  if (!user) throw new Error('No token provided')
  if ((ROLE_LEVELS[user.role] || 0) < (ROLE_LEVELS[minRole] || 0)) {
    throw new Error('You do not have permission for this action')
  }
  return user
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error('Failed to fetch')
  }

  const contentType = res.headers.get('content-type') || ''
  let data = {}
  if (contentType.includes('application/json')) {
    try {
      data = await res.json()
    } catch {
      data = {}
    }
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  if (!contentType.includes('application/json')) {
    throw new Error('API returned an invalid response')
  }

  return data
}

function toBoolQuery(value) {
  return value === true || value === 'true'
}

function qs(params) {
  const query = new URLSearchParams(params).toString()
  return query ? `?${query}` : ''
}

const localAuthApi = {
  async login(email, password) {
    ensureLocalData()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPassword = String(password || '')
    const aliases = new Set([normalizedEmail])
    if (normalizedEmail === 'admin@mkmetals') aliases.add('admin@mkmetals.in')
    if (normalizedEmail === 'admin@mkmetals.in') aliases.add('admin@mkmetals')

    const team = getLocalTeam()
    const user = team.find((member) => aliases.has(normalizeEmail(member.email)) && member.is_active)
    if (!user || String(user.password || '') !== normalizedPassword) {
      throw new Error('Invalid email or password')
    }

    user.last_login = nowIso()
    saveLocalTeam(team)

    const token = createLocalToken(user.id)
    return { token, user: toPublicUser(user) }
  },

  async me() {
    const user = requireLocalAuth()
    return { user: toPublicUser(user) }
  },

  async logout() {
    removeToken()
    return { message: 'Logged out' }
  },

  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword || String(newPassword).length < 6) {
      throw new Error('Current password and new password (min 6 chars) required')
    }
    const user = requireLocalAuth()
    const team = getLocalTeam()
    const index = team.findIndex((member) => member.id === user.id)
    if (index < 0) throw new Error('Account not found or inactive')
    if (String(team[index].password || '') !== String(currentPassword)) {
      throw new Error('Current password is incorrect')
    }
    team[index].password = String(newPassword)
    saveLocalTeam(team)
    return { message: 'Password updated successfully' }
  },
}

const localProductsApi = {
  async getAll(params = {}) {
    ensureLocalData()
    let products = getProducts().map(normalizeProduct)
    if (params.category) products = products.filter((product) => product.category === params.category)
    if (toBoolQuery(params.featured)) products = products.filter((product) => product.featured)
    if (toBoolQuery(params.popular)) products = products.filter((product) => product.popular)
    if (toBoolQuery(params.latest)) products = products.filter((product) => product.latest)
    if (params.status) products = products.filter((product) => product.status === params.status)
    if (params.search) {
      const searchTerm = String(params.search).toLowerCase()
      products = products.filter((product) =>
        `${product.name} ${product.shortDescription}`.toLowerCase().includes(searchTerm),
      )
    }
    return products.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
  },

  async getById(id) {
    ensureLocalData()
    const product = getProducts()
      .map(normalizeProduct)
      .find((item) => item.id === id || item.slug === id)
    if (!product) throw new Error('Product not found')
    return product
  },

  async create(data) {
    requireLocalAuth('manager')
    ensureLocalData()
    if (!data?.name || !String(data.name).trim()) throw new Error('Product name is required')

    const existing = getProducts().map(normalizeProduct)
    const nextSlug = slugify(data.slug || data.name)
    if (existing.some((product) => product.slug === nextSlug)) {
      throw new Error('A product with this slug already exists')
    }

    const stock = parseNumber(data.stock, 0)
    const createdAt = nowIso()
    const nextProduct = normalizeProduct({
      id: createId('product'),
      ...data,
      slug: nextSlug,
      stock,
      status: data.status || deriveStatus(stock),
      createdAt,
      updatedAt: createdAt,
      created_at: createdAt,
      updated_at: createdAt,
    })

    saveProducts([toStoredProduct(nextProduct), ...existing.map(toStoredProduct)])
    return nextProduct
  },

  async update(id, data) {
    requireLocalAuth('manager')
    ensureLocalData()
    const products = getProducts().map(normalizeProduct)
    const index = products.findIndex((product) => product.id === id)
    if (index < 0) throw new Error('Product not found')

    const current = products[index]
    const nextSlug = slugify(data.slug || data.name || current.slug)
    if (products.some((product) => product.id !== id && product.slug === nextSlug)) {
      throw new Error('A product with this slug already exists')
    }

    const stock = parseNumber(data.stock, current.stock)
    const updated = normalizeProduct({
      ...current,
      ...data,
      slug: nextSlug,
      stock,
      status: data.status || current.status || deriveStatus(stock),
      createdAt: current.createdAt,
      created_at: current.created_at,
      updatedAt: nowIso(),
      updated_at: nowIso(),
    })

    products[index] = updated
    saveProducts(products.map(toStoredProduct))
    return updated
  },

  async delete(id) {
    requireLocalAuth('manager')
    ensureLocalData()
    const products = getProducts().map(normalizeProduct)
    if (!products.some((product) => product.id === id)) throw new Error('Product not found')
    saveProducts(products.filter((product) => product.id !== id).map(toStoredProduct))
    return { message: 'Product deleted' }
  },

  async updateStock(id, data) {
    const user = requireLocalAuth('staff')
    ensureLocalData()
    const products = getProducts().map(normalizeProduct)
    const index = products.findIndex((product) => product.id === id)
    if (index < 0) throw new Error('Product not found')

    const current = products[index]
    let newStock
    if (typeof data.change === 'number') newStock = Math.max(0, current.stock + data.change)
    else if (typeof data.stock === 'number') newStock = Math.max(0, data.stock)
    else throw new Error('Provide stock or change value')

    const newStatus = deriveStatus(newStock)
    products[index] = normalizeProduct({
      ...current,
      stock: newStock,
      status: newStatus,
      updatedAt: nowIso(),
      updated_at: nowIso(),
    })
    saveProducts(products.map(toStoredProduct))

    const history = getLocalStockHistory()
    history.unshift({
      id: createId('stock'),
      product_id: id,
      change: newStock - current.stock,
      previous_stock: current.stock,
      new_stock: newStock,
      reason: data.reason || '',
      changed_by: user.email,
      created_at: nowIso(),
    })
    saveLocalStockHistory(history)

    return { id, stock: newStock, status: newStatus }
  },

  async updateFeatured(id, data) {
    requireLocalAuth('manager')
    ensureLocalData()
    const products = getProducts().map(normalizeProduct)
    const index = products.findIndex((product) => product.id === id)
    if (index < 0) throw new Error('Product not found')

    const updated = normalizeProduct({
      ...products[index],
      featured: data.featured !== undefined ? toBoolean(data.featured) : products[index].featured,
      popular: data.popular !== undefined ? toBoolean(data.popular) : products[index].popular,
      latest: data.latest !== undefined ? toBoolean(data.latest) : products[index].latest,
      updatedAt: nowIso(),
      updated_at: nowIso(),
    })

    products[index] = updated
    saveProducts(products.map(toStoredProduct))
    return updated
  },

  async getStockHistory(id) {
    requireLocalAuth('staff')
    ensureLocalData()
    return getLocalStockHistory().filter((entry) => entry.product_id === id).slice(0, 50)
  },
}

const localCategoriesApi = {
  async getAll() {
    ensureLocalData()
    const products = getProducts().map(normalizeProduct)
    return getCategories()
      .map((category) => ({
        ...category,
        productCount: products.filter((product) => product.category === category.id).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  },

  async getById(id) {
    ensureLocalData()
    const category = getCategories().find((item) => item.id === id)
    if (!category) throw new Error('Category not found')
    return category
  },

  async create(data) {
    requireLocalAuth('manager')
    ensureLocalData()
    if (!data?.name || !String(data.name).trim()) throw new Error('Category name is required')
    const categories = getCategories()
    const id = slugify(data.name)
    if (categories.some((category) => category.id === id)) {
      throw new Error('A category with this name already exists')
    }

    const created = {
      id,
      name: String(data.name).trim(),
      description: data.description || '',
      created_at: nowIso(),
      updated_at: nowIso(),
    }
    saveCategories([created, ...categories])
    return created
  },

  async update(id, data) {
    requireLocalAuth('manager')
    ensureLocalData()
    const categories = getCategories()
    const index = categories.findIndex((category) => category.id === id)
    if (index < 0) throw new Error('Category not found')

    const updated = {
      ...categories[index],
      name: data.name || categories[index].name,
      description: data.description !== undefined ? data.description : categories[index].description,
      updated_at: nowIso(),
    }
    categories[index] = updated
    saveCategories(categories)
    return updated
  },

  async delete(id) {
    const user = requireLocalAuth('owner')
    void user
    ensureLocalData()
    const categories = getCategories()
    if (!categories.some((category) => category.id === id)) throw new Error('Category not found')

    const count = getProducts().map(normalizeProduct).filter((product) => product.category === id).length
    if (count > 0) throw new Error(`Remove or reassign the ${count} product(s) in this category first`)

    saveCategories(categories.filter((category) => category.id !== id))
    return { message: 'Category deleted' }
  },
}

const localEnquiriesApi = {
  async submit(data) {
    ensureLocalData()
    if (!data?.name || !String(data.name).trim() || !data?.message || !String(data.message).trim()) {
      throw new Error('Name and message are required')
    }
    const created = normalizeEnquiry({
      id: createId('enquiry'),
      name: String(data.name).trim(),
      phone: data.phone || '',
      email: data.email || '',
      company: data.company || '',
      message: String(data.message).trim(),
      subject: data.subject || 'General Enquiry',
      status: 'New',
      notes: '',
      created_at: nowIso(),
      updated_at: nowIso(),
    })
    saveEnquiries([created, ...getEnquiries().map(normalizeEnquiry)])
    return { message: 'Enquiry submitted successfully', id: created.id }
  },

  async getAll(params = {}) {
    requireLocalAuth('staff')
    ensureLocalData()
    let enquiries = getEnquiries().map(normalizeEnquiry)
    if (params.status && params.status !== 'All') {
      enquiries = enquiries.filter((enquiry) => enquiry.status === params.status)
    }
    return enquiries.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
  },

  async getById(id) {
    requireLocalAuth('staff')
    ensureLocalData()
    const enquiry = getEnquiries().map(normalizeEnquiry).find((item) => item.id === id)
    if (!enquiry) throw new Error('Enquiry not found')
    return enquiry
  },

  async update(id, data) {
    requireLocalAuth('staff')
    ensureLocalData()
    const enquiries = getEnquiries().map(normalizeEnquiry)
    const index = enquiries.findIndex((enquiry) => enquiry.id === id)
    if (index < 0) throw new Error('Enquiry not found')

    const updated = normalizeEnquiry({
      ...enquiries[index],
      status: data.status || enquiries[index].status || 'New',
      notes: data.notes !== undefined ? data.notes : enquiries[index].notes || '',
      updated_at: nowIso(),
    })
    enquiries[index] = updated
    saveEnquiries(enquiries)
    return updated
  },

  async delete(id) {
    requireLocalAuth('manager')
    ensureLocalData()
    const enquiries = getEnquiries().map(normalizeEnquiry)
    if (!enquiries.some((enquiry) => enquiry.id === id)) throw new Error('Enquiry not found')
    saveEnquiries(enquiries.filter((enquiry) => enquiry.id !== id))
    return { message: 'Enquiry deleted' }
  },
}

const localTeamApi = {
  async getAll() {
    requireLocalAuth('owner')
    ensureLocalData()
    return getLocalTeam().map(toPublicUser).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
  },

  async create(data) {
    requireLocalAuth('owner')
    ensureLocalData()
    const name = String(data?.name || '').trim()
    const email = normalizeEmail(data?.email)
    const password = String(data?.password || '')
    const role = data?.role
    const validRoles = ['owner', 'manager', 'staff', 'viewer']

    if (!name || !email || !password || !role) {
      throw new Error('Name, email, password and role are required')
    }
    if (!validRoles.includes(role)) {
      throw new Error(`Role must be one of: ${validRoles.join(', ')}`)
    }
    if (password.length < 6) throw new Error('Password must be at least 6 characters')

    const team = getLocalTeam()
    if (team.some((member) => normalizeEmail(member.email) === email)) {
      throw new Error('This email is already registered')
    }

    const member = {
      id: createId('user'),
      name,
      email,
      password,
      role,
      is_active: true,
      created_at: nowIso(),
      last_login: null,
    }
    team.push(member)
    saveLocalTeam(team)
    return toPublicUser(member)
  },

  async update(id, data) {
    const currentUser = requireLocalAuth('owner')
    ensureLocalData()
    const team = getLocalTeam()
    const index = team.findIndex((member) => member.id === id)
    if (index < 0) throw new Error('Team member not found')

    const validRoles = ['owner', 'manager', 'staff', 'viewer']
    const nextRole = data.role || team[index].role
    if (!validRoles.includes(nextRole)) {
      throw new Error(`Role must be one of: ${validRoles.join(', ')}`)
    }
    if (id === currentUser.id && nextRole !== 'owner') {
      throw new Error('You cannot change your own role')
    }

    const nextEmail = data.email ? normalizeEmail(data.email) : team[index].email
    if (team.some((member) => member.id !== id && normalizeEmail(member.email) === nextEmail)) {
      throw new Error('This email is already registered')
    }
    if (data.password && String(data.password).length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    team[index] = {
      ...team[index],
      name: data.name || team[index].name,
      email: nextEmail,
      role: nextRole,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : team[index].is_active,
      password: data.password ? String(data.password) : team[index].password,
    }
    saveLocalTeam(team)
    return toPublicUser(team[index])
  },

  async delete(id) {
    const currentUser = requireLocalAuth('owner')
    ensureLocalData()
    if (id === currentUser.id) throw new Error('You cannot delete your own account')

    const team = getLocalTeam()
    if (!team.some((member) => member.id === id)) throw new Error('Team member not found')
    saveLocalTeam(team.filter((member) => member.id !== id))
    return { message: 'Team member removed' }
  },
}

const localStatsApi = {
  async get() {
    requireLocalAuth('viewer')
    ensureLocalData()
    const products = getProducts().map(normalizeProduct)
    const categories = getCategories()
    const enquiries = getEnquiries().map(normalizeEnquiry)
    const team = getLocalTeam()

    const stats = {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((enquiry) => enquiry.status === 'New').length,
      featured: products.filter((product) => product.featured).length,
      popular: products.filter((product) => product.popular).length,
      latest: products.filter((product) => product.latest).length,
      lowStock: products.filter((product) => product.status === 'Low stock').length,
      outOfStock: products.filter((product) => product.status === 'Out of stock').length,
      totalTeam: team.length,
    }

    const recentEnquiries = [...enquiries]
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, 5)

    const recentProducts = [...products]
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, 6)
      .map((product) => ({
        ...product,
        category_name: product.categoryName,
      }))

    return { stats, recentEnquiries, recentProducts }
  },
}

export const authApi = USE_LOCAL_API
  ? localAuthApi
  : {
      login: (email, password) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
      me: () => request('/auth/me'),
      logout: () => {
        removeToken()
        return Promise.resolve()
      },
      changePassword: (currentPassword, newPassword) =>
        request('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
    }

export const productsApi = USE_LOCAL_API
  ? localProductsApi
  : {
      getAll: (params = {}) => request(`/products${qs(params)}`),
      getById: (id) => request(`/products/${id}`),
      create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
      updateStock: (id, data) => request(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(data) }),
      updateFeatured: (id, data) => request(`/products/${id}/featured`, { method: 'PATCH', body: JSON.stringify(data) }),
      getStockHistory: (id) => request(`/products/${id}/stock-history`),
    }

export const categoriesApi = USE_LOCAL_API
  ? localCategoriesApi
  : {
      getAll: () => request('/categories'),
      getById: (id) => request(`/categories/${id}`),
      create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
    }

export const enquiriesApi = USE_LOCAL_API
  ? localEnquiriesApi
  : {
      submit: (data) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
      getAll: (params = {}) => request(`/enquiries${qs(params)}`),
      getById: (id) => request(`/enquiries/${id}`),
      update: (id, data) => request(`/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),
    }

export const teamApi = USE_LOCAL_API
  ? localTeamApi
  : {
      getAll: () => request('/team'),
      create: (data) => request('/team', { method: 'POST', body: JSON.stringify(data) }),
      update: (id, data) => request(`/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id) => request(`/team/${id}`, { method: 'DELETE' }),
    }

export const statsApi = USE_LOCAL_API
  ? localStatsApi
  : {
      get: () => request('/stats'),
    }
