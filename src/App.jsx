import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
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
import AdminSectionPage from './pages/AdminSectionPage.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import NotFound from './pages/NotFound.jsx'

import { useEffect } from 'react'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    document.body.classList.toggle('admin-route', isAdminRoute)
    return () => {
      document.body.classList.remove('admin-route')
    }
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
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="add-product" element={<AdminAddProduct />} />
          <Route path="edit-product" element={<AdminEditProduct />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="orders" element={<AdminSectionPage section="Orders / Cart Enquiries" description="Track cart enquiries, quote requests and bulk enquiries from customers before purchase." />} />
          <Route path="inventory" element={<AdminSectionPage section="Inventory Management" description="Track stock levels, low stock alerts, out-of-stock items and inventory updates." />} />
          <Route path="featured" element={<AdminSectionPage section="Featured Sections" description="Manage featured, popular and latest products shown on the homepage." />} />
          <Route path="content" element={<AdminSectionPage section="Website Content" description="Update homepage banners, hero copy, CTA sections and contact details." />} />
          <Route path="testimonials" element={<AdminSectionPage section="Testimonials & Clients" description="Add and manage client testimonials, partner logos and frontend visibility." />} />
          <Route path="media" element={<AdminSectionPage section="Media Library" description="Upload and reuse images for products, banners and website content." />} />
          <Route path="seo" element={<AdminSectionPage section="SEO Settings" description="Control page meta titles, descriptions, open graph images, and URL slugs." />} />
          <Route path="settings" element={<AdminSectionPage section="Admin Settings" description="Update admin access, business contact info, WhatsApp number and company details." />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App
