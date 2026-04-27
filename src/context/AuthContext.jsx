import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { adminCredentials, clearAdminToken, getAdminToken, setAdminToken } from '../data/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = getAdminToken()
    if (token?.authenticated) {
      setAdmin({ email: token.email })
    }
  }, [])

  const login = ({ email, password }) => {
    if (email === adminCredentials.email && password === adminCredentials.password) {
      const token = { authenticated: true, email }
      setAdminToken(token)
      setAdmin({ email })
      return true
    }
    return false
  }

  const logout = () => {
    clearAdminToken()
    setAdmin(null)
  }

  const value = useMemo(
    () => ({ admin, isAuthenticated: Boolean(admin), login, logout }),
    [admin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
