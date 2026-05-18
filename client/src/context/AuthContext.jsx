/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, getApiError } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const clearError = useCallback(() => setError(''), [])

  useEffect(() => {
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      clearError,
      register: async (payload) => {
        setError('')
        const data = await authApi.register(payload).catch((err) => {
          const message = getApiError(err)
          setError(message)
          throw new Error(message)
        })
        setUser(data.user)
        return data.user
      },
      login: async (payload) => {
        setError('')
        const data = await authApi.login(payload).catch((err) => {
          const message = getApiError(err)
          setError(message)
          throw new Error(message)
        })
        setUser(data.user)
        return data.user
      },
      logout: async () => {
        await authApi.logout()
        setUser(null)
      },
    }),
    [user, loading, error, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return value
}
