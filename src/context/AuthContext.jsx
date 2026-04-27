import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, removeToken, setToken } from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mk_jwt_token')
    if (token) {
      authApi.me()
        .then(({ user }) => setAdmin(user))
        .catch(() => { removeToken(); setAdmin(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const { token, user } = await authApi.login(email, password)
    setToken(token)
    setAdmin(user)
    return user
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setAdmin(null)
  }, [])

  const value = useMemo(
    () => ({ admin, isAuthenticated: Boolean(admin), login, logout, loading }),
    [admin, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
