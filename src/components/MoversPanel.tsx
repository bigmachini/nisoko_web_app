import { TrendingDown, TrendingUp, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { useMovers } from '../hooks/useMovers'
import type { MoverTab, RefreshInterval } from '../types'
import { fmtPrice, fmtChange, fmtVolume, changePct } from '../utils/format'

interface MoversPanelProps {
  apiKey: string
  refreshInterval: RefreshInterval
  onSelectIssuer: (issuer: string) => void
  selectedIssuer: string | null
}

const TABS: { id: MoverTab; label: string; icon: React.ReactNode }[] = [
  { id: 'TOP_GAINER', label: 'Gainers', icon: <TrendingUp size={13} /> },
  { id: 'TOP_LOSER', label: 'Losers', icon: <TrendingDown size={13} /> },
  { id: 'VOLUME_LEADER', label: 'Volume', icon: <Volume2 size={13} /> },
]

export function MoversPanel({
  apiKey,
  refreshInterval,
  onSelectIssuer,
  selectedIssuer,
}: MoversPanelProps) {
  const [tab, setTab] = useState<MoverTab>('TOP_GAINER')
  const { data, isLoading, error } = useMovers(tab, apiKey, refreshInterval)

  return (
    <aside className="movers-panel">
      <div className="panel-header">
        <h2 className="panel-title">Market Movers</h2>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="movers-list">
        {isLoading && <div className="panel-placeholder">Loading…</div>}

        {error && (
          <div className="panel-error">
            {(error as Error).message.includes('STARTER')
              ? 'Upgrade to STARTER plan to view movers.'
              : (error as Error).message}
          </div>
        )}

        {data?.map((m, i) => {
          const pct = changePct(m.change, m.prev_price)
          const isGain = tab === 'TOP_GAINER'
          const isLoss = tab === 'TOP_LOSER'

          return (
            <button
              key={m.id}
              className={`mover-row ${selectedIssuer === m.issuer ? 'selected' : ''}`}
              onClick={() => onSelectIssuer(m.issuer)}
            >
              <span className="mover-rank">{i + 1}</span>
              <div className="mover-info">
                <span className="mover-issuer">{m.issuer}</span>
                {tab === 'VOLUME_LEADER' ? (
                  <span className="mover-meta">{fmtVolume(m.volume)}</span>
                ) : (
                  <span className="mover-meta">{fmtPrice(m.price)}</span>
                )}
              </div>
              <div className={`mover-change ${isGain ? 'up' : isLoss ? 'down' : ''}`}>
                {tab !== 'VOLUME_LEADER' && (
                  <>
                    <span>{fmtChange(m.change)}</span>
                    {pct !== null && (
                      <span className="mover-pct">{pct > 0 ? '+' : ''}{pct.toFixed(2)}%</span>
                    )}
                  </>
                )}
                {tab === 'VOLUME_LEADER' && m.metric_value && (
                  <span className="mover-pct">{fmtVolume(m.metric_value)}</span>
                )}
              </div>
            </button>
          )
        })}

        {data?.length === 0 && !isLoading && (
          <div className="panel-placeholder">No data available</div>
        )}
      </div>
    </aside>
  )
}

