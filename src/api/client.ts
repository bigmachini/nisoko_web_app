import type {
  APIKeyCreateResponse,
  APIKeyOut,
  Mover,
  StockDetail,
  StockSnapshot,
  SubscriptionInfo,
  TokenResponse,
  UserProfile,
} from '../types'

const API_BASE = '/api/v1'

function apiKeyHeaders(apiKey: string): HeadersInit {
  return { 'Content-Type': 'application/json', 'X-API-Key': apiKey }
}

function bearerHeaders(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error((err as { detail?: string }).detail ?? res.statusText)
  }
  return res.json() as Promise<T>
}

// ── Market data (API key auth) ────────────────────────────────────────────────

export const api = {
  getSnapshot: (apiKey: string) =>
    request<StockSnapshot[]>('/stocks/snapshot', { headers: apiKeyHeaders(apiKey) }),

  getStockDetail: (issuer: string, apiKey: string) =>
    request<StockDetail>(`/stocks/${issuer}/snapshot`, { headers: apiKeyHeaders(apiKey) }),

  getMovers: (moverType: string, apiKey: string) => {
    const params = new URLSearchParams({ mover_type: moverType })
    return request<Mover[]>(`/movers/?${params}`, { headers: apiKeyHeaders(apiKey) })
  },
}

// ── Auth (Bearer JWT) ─────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<TokenResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, full_name?: string) =>
    request<TokenResponse>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    }),

  me: (token: string) =>
    request<UserProfile>('/auth/me', { headers: bearerHeaders(token) }),

  listKeys: (token: string) =>
    request<APIKeyOut[]>('/keys/', { headers: bearerHeaders(token) }),

  createKey: (token: string) =>
    request<APIKeyCreateResponse>('/keys/', {
      method: 'POST',
      headers: bearerHeaders(token),
      body: JSON.stringify({ name: 'dashboard' }),
    }),

  subscriptionMe: (token: string) =>
    request<SubscriptionInfo>('/subscriptions/me', { headers: bearerHeaders(token) }),
}
