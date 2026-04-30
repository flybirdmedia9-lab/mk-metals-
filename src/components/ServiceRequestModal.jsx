import { useState, useMemo } from 'react'
import { X, Send, Phone } from 'lucide-react'
import { enquiriesApi } from '../utils/api.js'

const initialState = {
  name: '',
  phone: '',
  location: '',
  message: '',
}

export default function ServiceRequestModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const whatsappLink = useMemo(() => {
    const text = [
      '*REBARING SERVICE REQUEST*',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Location: ${form.location}`,
      `Message: ${form.message}`,
    ].join('\n')
    return `https://wa.me/918125139139?text=${encodeURIComponent(text)}`
  }, [form])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setStatus({ type: 'error', message: 'Please provide at least your name and phone number.' })
      return
    }

    setSubmitting(true)
    setStatus(null)

    try {
      await enquiriesApi.submit({
        ...form,
        subject: 'Rebaring Service Request',
      })
      // After successful submission, open WhatsApp
      window.open(whatsappLink, '_blank')
      setStatus({ type: 'success', message: 'Request recorded. Redirecting to WhatsApp...' })
      setTimeout(() => {
        onClose()
        setForm(initialState)
        setStatus(null)
      }, 2000)
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Please click "Send to WhatsApp" directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="icon-badge">
            <Send size={20} />
          </div>
          <h3>Request Rebaring Service</h3>
          <p>Fill in the details below to send a request via WhatsApp.</p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sr-name">Your Name</label>
            <input
              id="sr-name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sr-phone">Phone Number</label>
            <input
              id="sr-phone"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sr-location">Project Location</label>
            <input
              id="sr-location"
              name="location"
              placeholder="Hyderabad, Telangana"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sr-message">Service Details / Requirements</label>
            <textarea
              id="sr-message"
              name="message"
              rows="3"
              placeholder="Tell us about your rebaring needs..."
              value={form.message}
              onChange={handleChange}
            />
          </div>

          {status && (
            <div className={`form-status form-status--${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="submit" 
              className="button button--primary w-full"
              disabled={submitting}
            >
              <Phone size={16} />
              <span>{submitting ? 'Processing...' : 'Send to WhatsApp'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
