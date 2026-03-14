import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { authApi } from '../api/client'
import type { SubscriptionInfo, UserProfile } from '../types'

// ── Storage keys ──────────────────────────────────────────────────────────────
const KEY_ACCESS  = 'NiSoko:access_token'
const KEY_REFRESH = 'NiSoko:refresh_token'
const KEY_API     = 'NiSoko:apiKey'

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthState {
  user: UserProfile | null
  subscription: SubscriptionInfo | null
  apiKey: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [apiKey, setApiKey]           = useState<string | null>(null)
  const [isLoading, setLoading]       = useState(true)
  const bootstrapped = useRef(false)

  // After we have an access token, fetch user profile + subscription + ensure an API key exists
  const bootstrap = useCallback(async (accessToken: string) => {
    // Set the API key from cache immediately so useSnapshot can fire in parallel
    // with the profile/subscription fetches rather than waiting for them.
    const stored = localStorage.getItem(KEY_API)
    if (stored) setApiKey(stored)

    const [profile, sub] = await Promise.all([
      authApi.me(accessToken),
      authApi.subscriptionMe(accessToken).catch(() => null),
    ])
    setUser(profile)
    setSubscription(sub)

    if (stored) return

    // No cached key: create one. The raw key is only returned at creation time,
    // so we must create a new key to cache it locally.
    const created = await authApi.createKey(accessToken)
    localStorage.setItem(KEY_API, created.key)
    setApiKey(created.key)
  }, [])

  // Restore session on mount
  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    const token = localStorage.getItem(KEY_ACCESS)
    if (!token) {
      setLoading(false)
      return
    }

    bootstrap(token)
      .catch(() => {
        // Token expired or invalid — clear everything
        clearStorage()
      })
      .finally(() => setLoading(false))
  }, [bootstrap])

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login(email, password)
    localStorage.setItem(KEY_ACCESS, tokens.access_token)
    localStorage.setItem(KEY_REFRESH, tokens.refresh_token)
    await bootstrap(tokens.access_token)
  }, [bootstrap])

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    const tokens = await authApi.register(email, password, fullName)
    localStorage.setItem(KEY_ACCESS, tokens.access_token)
    localStorage.setItem(KEY_REFRESH, tokens.refresh_token)
    await bootstrap(tokens.access_token)
  }, [bootstrap])

  const logout = useCallback(() => {
    clearStorage()
    setUser(null)
    setSubscription(null)
    setApiKey(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        apiKey,
        isLoading,
        isAuthenticated: !!user && !!apiKey,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function clearStorage() {
  localStorage.removeItem(KEY_ACCESS)
  localStorage.removeItem(KEY_REFRESH)
  localStorage.removeItem(KEY_API)
}
