import { LogOut, Moon, RefreshCw, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from './ThemeWrapper'
import type { RefreshInterval } from '../types'

interface HeaderProps {
  refreshInterval: RefreshInterval
  onRefreshChange: (v: RefreshInterval) => void
  lastUpdated: string | null
  isLoading: boolean
}

const REFRESH_OPTIONS: { label: string; value: RefreshInterval }[] = [
  { label: 'Off', value: 0 },
  { label: '30s', value: 30000 },
  { label: '1m',  value: 60000 },
  { label: '2m',  value: 120000 },
]

const PLAN_COLORS: Record<string, string> = {
  free:       'plan-free',
  starter:    'plan-starter',
  pro:        'plan-pro',
  enterprise: 'plan-enterprise',
}

function trialDaysLeft(trialEndsAt: string): number {
  const end = new Date(trialEndsAt).getTime()
  return Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24)))
}

export function Header({ refreshInterval, onRefreshChange, lastUpdated, isLoading }: HeaderProps) {
  const { user, subscription, logout } = useAuth()
  const { theme, toggle } = useTheme()

  const plan = subscription?.plan ?? user?.plan ?? 'free'
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <span className="logo-icon">◈</span>
          <div>
            <span className="logo-name">NiSoko</span>
            <span className="logo-sub">NSE Market Intelligence</span>
          </div>
        </div>
      </div>

      <div className="header-controls">
        {lastUpdated && (
          <div className="last-updated">
            <RefreshCw size={12} className={isLoading ? 'spin' : ''} />
            <span>{lastUpdated}</span>
          </div>
        )}

        <div className="refresh-group">
          <span className="control-label">Refresh</span>
          <div className="segmented">
            {REFRESH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`seg-btn ${refreshInterval === opt.value ? 'active' : ''}`}
                onClick={() => onRefreshChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button className="icon-btn theme-btn" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="user-menu">
          <div className="user-avatar" title={user?.email}>{initials}</div>
          <div className="user-info">
            <span className="user-name">{user?.full_name ?? user?.email}</span>
            {subscription?.is_on_trial && subscription.trial_ends_at ? (
              <span className="plan-badge plan-trial">
                TRIAL · {trialDaysLeft(subscription.trial_ends_at)}d
              </span>
            ) : (
              <span className={`plan-badge ${PLAN_COLORS[plan] ?? 'plan-free'}`}>
                {plan.toUpperCase()}
              </span>
            )}
          </div>
          <button className="icon-btn logout-btn" onClick={logout} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
