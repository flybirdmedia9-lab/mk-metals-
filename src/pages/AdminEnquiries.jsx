import { useEffect, useMemo, useState } from 'react'
import { enquiriesApi } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_OPTIONS = ['New', 'Contacted', 'Quotation Sent', 'Closed']

export default function AdminEnquiries() {
  const { admin } = useAuth()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [saving, setSaving] = useState({})

  useEffect(() => {
    enquiriesApi.getAll()
      .then(setEnquiries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (filter === 'All' ? enquiries : enquiries.filter((e) => e.status === filter)),
    [enquiries, filter],
  )

  const updateField = async (id, field, value) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
    setSaving((prev) => ({ ...prev, [id]: true }))
    try {
      const enquiry = enquiries.find((e) => e.id === id)
      await enquiriesApi.update(id, { status: enquiry.status, notes: enquiry.notes, [field]: value })
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this enquiry?')) return
    try {
      await enquiriesApi.delete(id)
      setEnquiries((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <main className="admin-section-shell"><p className="admin-loading">Loading enquiries…</p></main>

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <div><span className="section-label">Enquiries</span><h1>Customer enquiries</h1></div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              {['All', ...STATUS_OPTIONS].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <h2>No enquiries found</h2>
              <p>Enquiry records will appear here when customers contact you.</p>
            </div>
          ) : (
            <div className="enquiry-list">
              {filtered.map((e) => (
                <article key={e.id} className="enquiry-card">
                  <div className="enquiry-row">
                    <div>
                      <span className="enquiry-meta">{new Date(e.created_at).toLocaleString()}</span>
                      <h3>{e.subject || 'Product enquiry'}</h3>
                      <p>{e.message}</p>
                    </div>
                    <div className="enquiry-contact">
                      <span>{e.name}</span>
                      <span>{e.company || 'No company'}</span>
                      {e.phone && <a href={`tel:${e.phone}`}>{e.phone}</a>}
                      {e.email && <a href={`mailto:${e.email}`}>{e.email}</a>}
                    </div>
                  </div>
                  <div className="panel-head">
                    <div className="form-grid">
                      <label>
                        Status
                        <select value={e.status || 'New'} onChange={(ev) => updateField(e.id, 'status', ev.target.value)}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </label>
                      <label>
                        Notes
                        <textarea
                          value={e.notes || ''}
                          onChange={(ev) => setEnquiries((prev) => prev.map((x) => (x.id === e.id ? { ...x, notes: ev.target.value } : x)))}
                          onBlur={(ev) => updateField(e.id, 'notes', ev.target.value)}
                          rows="2"
                        />
                      </label>
                    </div>
                    <div className="form-actions">
                      {e.phone && (
                        <a href={`https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hi ${e.name}, following up on your enquiry.`)}`} target="_blank" rel="noreferrer" className="button button--secondary">
                          WhatsApp
                        </a>
                      )}
                      {e.phone && <a href={`tel:${e.phone}`} className="button button--secondary">Call</a>}
                      {(admin?.role === 'owner' || admin?.role === 'manager') && (
                        <button type="button" className="button button--danger" onClick={() => handleDelete(e.id)}>Delete</button>
                      )}
                    </div>
                  </div>
                  {saving[e.id] && <p className="form-status form-status--info">Saving…</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
