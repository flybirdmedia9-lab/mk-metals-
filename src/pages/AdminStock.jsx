import { useEffect, useMemo, useState } from 'react'
import { productsApi } from '../utils/api.js'

export default function AdminStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [updates, setUpdates] = useState({})
  const [saving, setSaving] = useState({})
  const [history, setHistory] = useState({ productId: null, records: [] })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    productsApi.getAll()
      .then(setProducts)
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => products.filter((p) => {
    const sm = p.name.toLowerCase().includes(search.toLowerCase())
    const stm = filterStatus === 'All' || p.status === filterStatus
    return sm && stm
  }), [products, search, filterStatus])

  const setUpdate = (id, field, value) => {
    setUpdates((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }))
  }

  const applyUpdate = async (product) => {
    const u = updates[product.id] || {}
    const newStock = parseInt(u.stock ?? product.stock)
    if (isNaN(newStock) || newStock < 0) { setStatus({ type: 'error', message: 'Invalid stock value.' }); return }
    setSaving((prev) => ({ ...prev, [product.id]: true }))
    try {
      const result = await productsApi.updateStock(product.id, { stock: newStock, reason: u.reason || '' })
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, stock: result.stock, status: result.status } : p))
      setUpdates((prev) => { const n = { ...prev }; delete n[product.id]; return n })
      setStatus({ type: 'success', message: `${product.name} stock updated to ${result.stock}.` })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSaving((prev) => ({ ...prev, [product.id]: false }))
    }
  }

  const loadHistory = async (productId, productName) => {
    if (history.productId === productId) { setHistory({ productId: null, records: [] }); return }
    try {
      const records = await productsApi.getStockHistory(productId)
      setHistory({ productId, productName, records })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  if (loading) return <main className="admin-section-shell"><p className="admin-loading">Loading stock data…</p></main>

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--full">
          <div className="panel-head">
            <div><span className="section-label">Inventory</span><h1>Stock management</h1></div>
          </div>
          <p>Update stock quantities for your products. Changes are logged automatically.</p>
          {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}

          <div className="filter-bar">
            <input type="search" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All statuses</option>
              <option value="In stock">In stock</option>
              <option value="Low stock">Low stock</option>
              <option value="Out of stock">Out of stock</option>
            </select>
          </div>

          <div className="admin-table">
            <div className="table-row table-head">
              <span>Product</span>
              <span>Current stock</span>
              <span>Status</span>
              <span>New quantity</span>
              <span>Reason / note</span>
              <span>Actions</span>
            </div>
            {filtered.map((p) => {
              const u = updates[p.id] || {}
              const stockVal = u.stock !== undefined ? u.stock : p.stock
              const isDirty = u.stock !== undefined && parseInt(u.stock) !== p.stock
              return (
                <div key={p.id} className={`table-row ${p.status === 'Out of stock' ? 'table-row--danger' : p.status === 'Low stock' ? 'table-row--warning' : ''}`}>
                  <span>{p.name}</span>
                  <span><strong>{p.stock}</strong></span>
                  <span>{p.status}</span>
                  <span>
                    <input
                      type="number"
                      min="0"
                      value={stockVal}
                      onChange={(e) => setUpdate(p.id, 'stock', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </span>
                  <span>
                    <input
                      placeholder="Optional reason…"
                      value={u.reason || ''}
                      onChange={(e) => setUpdate(p.id, 'reason', e.target.value)}
                    />
                  </span>
                  <span className="table-actions">
                    {isDirty && (
                      <button type="button" className="text-button" onClick={() => applyUpdate(p)} disabled={saving[p.id]}>
                        {saving[p.id] ? 'Saving…' : 'Update'}
                      </button>
                    )}
                    <button type="button" className="text-button" onClick={() => loadHistory(p.id, p.name)}>
                      {history.productId === p.id ? 'Hide history' : 'History'}
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {history.productId && history.records.length > 0 && (
          <div className="admin-panel admin-panel--full">
            <div className="panel-head">
              <h2>Stock history — {history.productName}</h2>
              <button type="button" className="text-button" onClick={() => setHistory({ productId: null, records: [] })}>Close</button>
            </div>
            <div className="admin-table">
              <div className="table-row table-head">
                <span>Date</span><span>Change</span><span>Previous</span><span>New stock</span><span>Reason</span><span>Updated by</span>
              </div>
              {history.records.map((r) => (
                <div key={r.id} className="table-row">
                  <span>{new Date(r.created_at).toLocaleString()}</span>
                  <span style={{ color: r.change >= 0 ? 'var(--color-success, #16a34a)' : 'var(--color-danger, #dc2626)' }}>
                    {r.change >= 0 ? `+${r.change}` : r.change}
                  </span>
                  <span>{r.previous_stock}</span>
                  <span>{r.new_stock}</span>
                  <span>{r.reason || '—'}</span>
                  <span>{r.changed_by}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
