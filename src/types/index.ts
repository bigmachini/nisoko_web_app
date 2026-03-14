// ── API Response Types ─────────────────────────────────────────────────────────

export interface StockSnapshot {
  id: number
  stock_id: string
  issuer: string
  prev_price: number | null
  today_open: number | null
  today_high: number | null
  today_low: number | null
  today_close: number | null
  price: number | null
  ltp: number | null
  volume: number | null
  turnover: number | null
  change: number | null
  last_updated: string
}

export interface StockDetail {
  id: number
  issuer: string
  status: string
  last_updated: string
  prev_price: number | null
  today_open: number | null
  today_high: number | null
  today_low: number | null
  today_close: number | null
  price: number | null
  ltp: number | null
  volume: number | null
  turnover: number | null
  change: number | null
}

export interface Mover {
  id: number
  captured_at: string
  issuer: string
  mover_type: string
  rank: number | null
  tier: number
  price: number | null
  change: number | null
  volume: number | null
  turnover: number | null
  today_open: number | null
  today_high: number | null
  today_low: number | null
  prev_price: number | null
  metric_value: number | null
}

// ── Auth Types ────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface UserProfile {
  id: number
  email: string
  full_name: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  last_login: string | null
  email_verified_at: string | null
  plan: string
}

export interface APIKeyOut {
  id: number
  prefix: string
  name: string | null
  is_active: boolean
  created_at: string
  last_used: string | null
  expires_at: string | null
}

export interface APIKeyCreateResponse {
  id: number
  key: string
  prefix: string
  name: string | null
  created_at: string
}

export interface SubscriptionInfo {
  plan: string           // effective plan (boosted by trial if active)
  base_plan: string      // stored plan (always "free" during trial)
  is_on_trial: boolean
  trial_ends_at: string | null
  is_active: boolean
  current_period_end: string | null
  requests_today: number
  requests_limit_day: number
}

// ── UI State Types ─────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light'
export type RefreshInterval = 0 | 30000 | 60000 | 120000
export type SortDir = 'asc' | 'desc'

export type SortKey = keyof Pick<
  StockSnapshot,
  'issuer' | 'price' | 'change' | 'volume' | 'turnover' | 'today_open' | 'today_high' | 'today_low'
>

export type MoverTab = 'TOP_GAINER' | 'TOP_LOSER' | 'VOLUME_LEADER'
