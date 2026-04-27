import { useMemo, useState } from 'react'
import { addEnquiry } from '../data/storage.js'

const initialState = {
  name: '',
  phone: '',
  company: '',
  message: '',
}

export default function EnquiryForm({ subject }) {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState(null)

  const subjectText = subject ? `Product: ${subject}` : 'General enquiry'

  const whatsappLink = useMemo(() => {
    const message = `${subjectText}\nName: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}\nMessage: ${form.message}`
    return `https://wa.me/918125139139?text=${encodeURIComponent(message)}`
  }, [form, subjectText])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in your name, phone and message.' })
      return
    }

    addEnquiry({ ...form, subject: subjectText })
    setStatus({ type: 'success', message: 'Your enquiry was saved. Use WhatsApp to follow up.' })
    setForm(initialState)
  }

  return (
    <section className="enquiry-panel">
      <div className="panel-header">
        <span>Need a custom quote?</span>
        <h3>{subject || 'Quick enquiry form'}</h3>
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Mobile number" />
          </label>
          <label>
            Company
            <input name="company" value={form.company} onChange={handleChange} placeholder="Optional company name" />
          </label>
          <label className="form-message">
            Message
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what you need" rows="4" />
          </label>
        </div>

        <div className="form-actions">
          <button className="button button--primary" type="submit">
            Save Enquiry
          </button>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button--outline">
            Send via WhatsApp
          </a>
        </div>

        {status ? <p className={`form-status form-status--${status.type}`}>{status.message}</p> : null}
      </form>
    </section>
  )
}
