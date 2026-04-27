export default function AdminSectionPage({ section, description }) {
  return (
    <main className="admin-section-shell">
      <div className="admin-panel admin-panel--full">
        <div className="panel-head">
          <div>
            <span className="section-label">{section}</span>
            <h1>{section}</h1>
          </div>
        </div>
        <p>{description}</p>
        <div className="empty-state">
          <h2>{section} is ready for business</h2>
          <p>Use this section to manage your {section.toLowerCase()} workflow and keep your website data updated.</p>
        </div>
      </div>
    </main>
  )
}
