import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, LayoutDashboard, Box, PlusSquare, Layers, MessageSquare, ShoppingCart, Database, Star, Image, Settings2, ShieldCheck, Globe, FileText, Briefcase, LogOut, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const navSections = [
  {
    title: 'Business management',
    items: [
      { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
      { label: 'Products', path: 'products', icon: Box },
      { label: 'Add Product', path: 'add-product', icon: PlusSquare },
      { label: 'Categories', path: 'categories', icon: Layers },
      { label: 'Enquiries', path: 'enquiries', icon: MessageSquare },
      { label: 'Orders', path: 'orders', icon: ShoppingCart },
      { label: 'Inventory', path: 'inventory', icon: Database },
      { label: 'Featured', path: 'featured', icon: Star },
    ],
  },
  {
    title: 'Website content',
    items: [
      { label: 'Content', path: 'content', icon: Globe },
      { label: 'Testimonials', path: 'testimonials', icon: FileText },
      { label: 'Media Library', path: 'media', icon: Image },
      { label: 'SEO Settings', path: 'seo', icon: ShieldCheck },
      { label: 'Settings', path: 'settings', icon: Settings2 },
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
              {group.items.map((item) => {
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
          <button type="button" className="button button--outline sidebar-logout" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar admin-topbar--layout">
          <button type="button" className="sidebar-toggle" onClick={() => setSidebarOpen((state) => !state)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <span className="section-label">Admin</span>
            <h2>{currentSection}</h2>
          </div>
          <div className="admin-profile">
            <div>
              <p>Signed in as</p>
              <strong>{admin?.email || 'admin@mkmetals.in'}</strong>
            </div>
            <button type="button" className="button button--outline" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
