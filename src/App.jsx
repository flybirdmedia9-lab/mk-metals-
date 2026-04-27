import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Categories from './pages/Categories.jsx'
import Cart from './pages/Cart.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import AdminAddProduct from './pages/AdminAddProduct.jsx'
import AdminEditProduct from './pages/AdminEditProduct.jsx'
import AdminCategories from './pages/AdminCategories.jsx'
import AdminEnquiries from './pages/AdminEnquiries.jsx'
import AdminTeam from './pages/AdminTeam.jsx'
import AdminStock from './pages/AdminStock.jsx'
import AdminSectionPage from './pages/AdminSectionPage.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import NotFound from './pages/NotFound.jsx'
import { useEffect } from 'react'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    document.body.classList.toggle('admin-route', isAdminRoute)
    return () => document.body.classList.remove('admin-route')
  }, [isAdminRoute])

  return (
    <div className="app-shell">
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<RoleRoute minRole="viewer"><AdminDashboard /></RoleRoute>} />
          <Route path="products" element={<RoleRoute minRole="viewer"><AdminProducts /></RoleRoute>} />
          <Route path="add-product" element={<RoleRoute minRole="manager"><AdminAddProduct /></RoleRoute>} />
          <Route path="edit-product" element={<RoleRoute minRole="manager"><AdminEditProduct /></RoleRoute>} />
          <Route path="categories" element={<RoleRoute minRole="manager"><AdminCategories /></RoleRoute>} />
          <Route path="enquiries" element={<RoleRoute minRole="staff"><AdminEnquiries /></RoleRoute>} />
          <Route path="stock" element={<RoleRoute minRole="staff"><AdminStock /></RoleRoute>} />
          <Route path="team" element={<RoleRoute minRole="owner"><AdminTeam /></RoleRoute>} />
          <Route path="content" element={<RoleRoute minRole="manager"><AdminSectionPage section="Website Content" description="Update homepage banners, hero copy, CTA sections and contact details." /></RoleRoute>} />
          <Route path="testimonials" element={<RoleRoute minRole="manager"><AdminSectionPage section="Testimonials & Clients" description="Add and manage client testimonials, partner logos and frontend visibility." /></RoleRoute>} />
          <Route path="media" element={<RoleRoute minRole="manager"><AdminSectionPage section="Media Library" description="Upload and reuse images for products, banners and website content." /></RoleRoute>} />
          <Route path="seo" element={<RoleRoute minRole="manager"><AdminSectionPage section="SEO Settings" description="Control page meta titles, descriptions, open graph images, and URL slugs." /></RoleRoute>} />
          <Route path="settings" element={<RoleRoute minRole="owner"><AdminSectionPage section="Admin Settings" description="Update admin access, business contact info, WhatsApp number and company details." /></RoleRoute>} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App
