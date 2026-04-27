const BASE_URL = 'http://localhost:5000/api'
const TOKEN_KEY = 'mk_jwt_token'

export function getToken() { return localStorage.getItem(TOKEN_KEY) }
export function setToken(t) { localStorage.setItem(TOKEN_KEY, t) }
export function removeToken() { localStorage.removeItem(TOKEN_KEY) }

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  let data
  try { data = await res.json() } catch { data = {} }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

function qs(params) {
  const q = new URLSearchParams(params).toString()
  return q ? `?${q}` : ''
}

export const authApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  logout: () => { removeToken(); return Promise.resolve() },
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
}

export const productsApi = {
  getAll: (params = {}) => request(`/products${qs(params)}`),
  getById: (id) => request(`/products/${id}`),
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  updateStock: (id, data) => request(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateFeatured: (id, data) => request(`/products/${id}/featured`, { method: 'PATCH', body: JSON.stringify(data) }),
  getStockHistory: (id) => request(`/products/${id}/stock-history`),
}

export const categoriesApi = {
  getAll: () => request('/categories'),
  getById: (id) => request(`/categories/${id}`),
  create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}

export const enquiriesApi = {
  submit: (data) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (params = {}) => request(`/enquiries${qs(params)}`),
  getById: (id) => request(`/enquiries/${id}`),
  update: (id, data) => request(`/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),
}

export const teamApi = {
  getAll: () => request('/team'),
  create: (data) => request('/team', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/team/${id}`, { method: 'DELETE' }),
}

export const statsApi = {
  get: () => request('/stats'),
}
