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

/** Thrown when an API request fails. Includes status for 401 handling. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

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
    const message = (err as { detail?: string }).detail ?? res.statusText
    throw new ApiError(message, res.status)
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

  refresh: (refreshToken: string) =>
    request<TokenResponse>('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
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
