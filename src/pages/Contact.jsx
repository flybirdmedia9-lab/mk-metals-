import EnquiryForm from '../components/EnquiryForm.jsx'

export default function Contact() {
  return (
    <main className="container page-container">
      <section className="section section--wide contact-shell">
        <div className="grid contact-grid">
          <div className="contact-copy">
            <span className="section-label">Contact sales</span>
            <h1>Send a product enquiry or discuss a project.</h1>
            <p>
              Use the form to reach our team, or open WhatsApp directly for a faster response. Our catalog is designed for specification-driven conversations, not direct checkout.
            </p>

            <div className="contact-cards">
              <article>
                <h3>Office</h3>
                <p>Shop No. 3, TSK Chambers, Opp. Ranigunj Bus Depot</p>
                <p>Hyderabad, Telangana 500003</p>
              </article>
              <article>
                <h3>Phone</h3>
                <a href="tel:+918125139139">+91 81251 39139</a>
              </article>
              <article>
                <h3>Email</h3>
                <a href="mailto:info@mkmetals.com">info@mkmetals.com</a>
              </article>
            </div>
          </div>

          <div className="contact-panel">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </main>
  )
}
