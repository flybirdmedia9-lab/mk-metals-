import { useEffect, useState } from 'react'
import { teamApi } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const ROLES = ['owner', 'manager', 'staff', 'viewer']
const ROLE_DESCRIPTIONS = {
  owner: 'Full access — products, categories, enquiries, stock, team management',
  manager: 'Add & edit products/categories, manage enquiries, update stock',
  staff: 'Update stock levels and view enquiries',
  viewer: 'Read-only access to the admin dashboard',
}

const emptyForm = { name: '', email: '', password: '', role: 'staff' }

export default function AdminTeam() {
  const { admin } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    teamApi.getAll()
      .then(setMembers)
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.password || !form.role) {
      setStatus({ type: 'error', message: 'All fields are required.' })
      return
    }
    setSaving(true)
    try {
      const member = await teamApi.create(form)
      setMembers((prev) => [...prev, member])
      setForm(emptyForm)
      setStatus({ type: 'success', message: `${member.name} added successfully.` })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (m) => { setEditingId(m.id); setEditForm({ name: m.name, email: m.email, role: m.role, is_active: m.is_active, password: '' }) }

  const handleEdit = async (id) => {
    setSaving(true)
    try {
      const updated = await teamApi.update(id, editForm)
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)))
      setEditingId(null)
      setStatus({ type: 'success', message: 'Member updated.' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name} from the team?`)) return
    try {
      await teamApi.delete(id)
      setMembers((prev) => prev.filter((m) => m.id !== id))
      setStatus({ type: 'success', message: `${name} removed.` })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  if (loading) return <main className="admin-section-shell"><p className="admin-loading">Loading team…</p></main>

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <div><span className="section-label">Team</span><h1>Manage team members</h1></div>
          </div>
          <p>Add team members and assign access levels. Only the owner can manage team membership.</p>

          <div className="role-guide">
            {ROLES.map((r) => (
              <div key={r} className="role-item">
                <strong className={`role-badge role-badge--${r}`}>{r}</strong>
                <span>{ROLE_DESCRIPTIONS[r]}</span>
              </div>
            ))}
          </div>

          <form className="admin-form" onSubmit={handleAdd}>
            <div className="form-grid">
              <label>Full name<input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></label>
              <label>Email address<input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></label>
              <label>Password (min 6 chars)<input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></label>
              <label>
                Access role
                <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                  {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </label>
            </div>
            <button type="submit" className="button button--primary" disabled={saving}>{saving ? 'Adding…' : 'Add team member'}</button>
            {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
          </form>
        </div>

        <div className="admin-panel admin-panel--wide">
          <div className="panel-head"><h2>Team members ({members.length})</h2></div>
          <div className="admin-table">
            <div className="table-row table-head">
              <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Last login</span><span>Actions</span>
            </div>
            {members.map((m) => (
              <div key={m.id} className="table-row">
                {editingId === m.id ? (
                  <>
                    <span><input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} /></span>
                    <span><input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} /></span>
                    <span>
                      <select value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </span>
                    <span>
                      <select value={editForm.is_active ? 'active' : 'inactive'} onChange={(e) => setEditForm((p) => ({ ...p, is_active: e.target.value === 'active' }))}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </span>
                    <span>
                      <input type="password" placeholder="New password (optional)" value={editForm.password} onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))} />
                    </span>
                    <span className="table-actions">
                      <button type="button" className="text-button" onClick={() => handleEdit(m.id)} disabled={saving}>Save</button>
                      <button type="button" className="text-button" onClick={() => setEditingId(null)}>Cancel</button>
                    </span>
                  </>
                ) : (
                  <>
                    <span>{m.name} {m.id === admin?.id && <em>(you)</em>}</span>
                    <span>{m.email}</span>
                    <span><span className={`role-badge role-badge--${m.role}`}>{m.role}</span></span>
                    <span>{m.is_active ? 'Active' : 'Inactive'}</span>
                    <span>{m.last_login ? new Date(m.last_login).toLocaleDateString() : 'Never'}</span>
                    <span className="table-actions">
                      <button type="button" className="text-button" onClick={() => startEdit(m)}>Edit</button>
                      {m.id !== admin?.id && (
                        <button type="button" className="text-button text-button--danger" onClick={() => handleDelete(m.id, m.name)}>Remove</button>
                      )}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
