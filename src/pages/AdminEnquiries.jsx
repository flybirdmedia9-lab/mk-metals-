import { useEffect, useMemo, useState } from 'react'
import { getEnquiries, saveEnquiries } from '../data/storage.js'

const STATUS_OPTIONS = ['New', 'Contacted', 'Quotation Sent', 'Closed']

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [filter, setFilter] = useState('All')
  const [activeEnquiry, setActiveEnquiry] = useState(null)

  useEffect(() => {
    setEnquiries(getEnquiries())
  }, [])

  const filteredEnquiries = useMemo(() => {
    if (filter === 'All') return enquiries
    return enquiries.filter((item) => item.status === filter)
  }, [enquiries, filter])

  const updateStatus = (id, status) => {
    const next = enquiries.map((item) => (item.id === id ? { ...item, status } : item))
    saveEnquiries(next)
    setEnquiries(next)
  }

  const updateNotes = (id, notes) => {
    const next = enquiries.map((item) => (item.id === id ? { ...item, notes } : item))
    saveEnquiries(next)
    setEnquiries(next)
  }

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <div>
              <span className="section-label">Enquiries</span>
              <h1>Customer enquiries</h1>
            </div>
            <div className="checkbox-group">
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                {['All', ...STATUS_OPTIONS].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="empty-state">
              <h2>No enquiries found</h2>
              <p>Enquiry records will appear here when customers contact you.</p>
            </div>
          ) : (
            <div className="enquiry-list">
              {filteredEnquiries.map((enquiry) => (
                <article key={enquiry.id} className="enquiry-card">
                  <div className="enquiry-row">
                    <div>
                      <span className="enquiry-meta">{new Date(enquiry.createdAt).toLocaleString()}</span>
                      <h3>{enquiry.subject || 'Product enquiry'}</h3>
                      <p>{enquiry.message}</p>
                    </div>
                    <div className="enquiry-contact">
                      <span>{enquiry.name || 'Unknown customer'}</span>
                      <span>{enquiry.company || 'No company'}</span>
                      <a href={`tel:${enquiry.phone}`}>{enquiry.phone || 'No phone'}</a>
                      <a href={`mailto:${enquiry.email || 'info@mkmetals.com'}`}>{enquiry.email || 'info@mkmetals.com'}</a>
                    </div>
                  </div>
                  <div className="panel-head">
                    <div className="form-grid">
                      <label>
                        Status
                        <select value={enquiry.status || 'New'} onChange={(event) => updateStatus(enquiry.id, event.target.value)}>
                          {STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Notes
                        <textarea
                          value={enquiry.notes || ''}
                          onChange={(event) => updateNotes(enquiry.id, event.target.value)}
                          rows="2"
                        />
                      </label>
                    </div>
                    <div className="form-actions">
                      <a href={`https://wa.me/91${enquiry.phone}?text=${encodeURIComponent(`Hi ${enquiry.name}, I'm following up on your enquiry.`)}`} target="_blank" rel="noreferrer" className="button button--secondary">
                        WhatsApp
                      </a>
                      <a href={`tel:${enquiry.phone}`} className="button button--secondary">
                        Call
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
