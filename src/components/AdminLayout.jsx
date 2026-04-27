import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, LayoutDashboard, Box, PlusSquare, Layers, MessageSquare, Settings2, ShieldCheck, Globe, FileText, Image, Users, PackageCheck, LogOut, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { canAccess } from '../utils/roles.js'

const navSections = [
  {
    title: 'Business management',
    items: [
      { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard, minRole: 'viewer' },
      { label: 'Products', path: 'products', icon: Box, minRole: 'viewer' },
      { label: 'Add Product', path: 'add-product', icon: PlusSquare, minRole: 'manager' },
      { label: 'Categories', path: 'categories', icon: Layers, minRole: 'manager' },
      { label: 'Stock', path: 'stock', icon: PackageCheck, minRole: 'staff' },
      { label: 'Enquiries', path: 'enquiries', icon: MessageSquare, minRole: 'staff' },
      { label: 'Team', path: 'team', icon: Users, minRole: 'owner' },
    ],
  },
  {
    title: 'Website content',
    items: [
      { label: 'Content', path: 'content', icon: Globe, minRole: 'manager' },
      { label: 'Testimonials', path: 'testimonials', icon: FileText, minRole: 'manager' },
      { label: 'Media Library', path: 'media', icon: Image, minRole: 'manager' },
      { label: 'SEO Settings', path: 'seo', icon: ShieldCheck, minRole: 'manager' },
      { label: 'Settings', path: 'settings', icon: Settings2, minRole: 'owner' },
    ],
  },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, admin } = useAuth()
  const location = useLocation()

  const currentSection = useMemo(() => {
    const match = location.pathname.split('/').pop()
    for (const group of navSections) {
      const item = group.items.find((entry) => entry.path === match)
      if (item) return item.label
    }
    return 'Dashboard'
  }, [location.pathname])

  const userRole = admin?.role || 'viewer'

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark admin-brand-mark">MK</div>
          <div>
            <p className="sidebar-brand-title">MK Metals</p>
            <p className="sidebar-brand-subtitle">Business control</p>
          </div>
        </div>

        <div className="sidebar-content">
          {navSections.map((group) => (
            <div key={group.title} className="sidebar-group">
              <p className="sidebar-group-title">{group.title}</p>
              {group.items.filter((item) => canAccess(userRole, item.minRole)).map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === 'dashboard'}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-role-badge">
            <span className={`role-badge role-badge--${userRole}`}>{userRole}</span>
            <span>{admin?.name || admin?.email}</span>
          </div>
          <button type="button" className="button button--outline sidebar-logout" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar admin-topbar--layout">
          <button type="button" className="sidebar-toggle" onClick={() => setSidebarOpen((s) => !s)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <span className="section-label">Admin</span>
            <h2>{currentSection}</h2>
          </div>
          <div className="admin-profile">
            <div>
              <p>Signed in as</p>
              <strong>{admin?.name || admin?.email}</strong>
              <span className={`role-badge role-badge--${userRole}`} style={{ marginLeft: '8px' }}>{userRole}</span>
            </div>
            <button type="button" className="button button--outline" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
