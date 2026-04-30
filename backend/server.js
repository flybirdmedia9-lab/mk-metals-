require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth.js')
const productRoutes = require('./routes/products.js')
const categoryRoutes = require('./routes/categories.js')
const enquiryRoutes = require('./routes/enquiries.js')
const teamRoutes = require('./routes/team.js')
const statsRoutes = require('./routes/stats.js')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/stats', statsRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`MK Metalsand backend running at http://localhost:${PORT}`)
  })
}

module.exports = app

