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
                <p>#3, TSK Chambers, Opp. Ranigunj Bus Depot</p>
                <p>M.G. Road, Ranigunj, SECUNDERABAD - 500003</p>
                <p>Telangana, India</p>
              </article>
              <article>
                <h3>Phone</h3>
                <p>Murali Krishna: <a href="tel:+918125139139">+91 81251 39139</a></p>
                <p>Mobile: <a href="tel:+918500065222">+91 85000 65222</a></p>
                <p>Landline: <a href="tel:+9104042700227">040 427 00 227</a></p>
              </article>
              <article>
                <h3>Email</h3>
                <a href="mailto:info@mkmetals.in">info@mkmetals.in</a>
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
