import { useMemo, useState } from 'react'
import { enquiriesApi } from '../utils/api.js'

const initialState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
}

export default function EnquiryForm({ subject }) {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const subjectText = subject ? `Product: ${subject}` : 'General enquiry'

  const whatsappLink = useMemo(() => {
    const message = [
      subjectText,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      `Message: ${form.message}`,
    ].join('\n')
    return `https://wa.me/918125139139?text=${encodeURIComponent(message)}`
  }, [form, subjectText])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in your name, phone, and message.' })
      return
    }

    setSubmitting(true)
    setStatus(null)

    try {
      await enquiriesApi.submit({
        ...form,
        subject: subjectText,
      })
      setStatus({ type: 'success', message: 'Enquiry submitted. Our admin team will contact you shortly.' })
      setForm(initialState)
    } catch {
      setStatus({ type: 'error', message: 'Could not submit enquiry. Please use WhatsApp to contact us.' })
    } finally {
      setSubmitting(false)
    }
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
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
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
          <button className="button button--primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Enquiry'}
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
