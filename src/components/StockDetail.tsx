import { X } from 'lucide-react'
import { useStockDetail } from '../hooks/useSnapshot'
import { changePct, fmtChange, fmtPrice, fmtTurnover, fmtVolume } from '../utils/format'

interface StockDetailProps {
  issuer: string
  apiKey: string
  onClose: () => void
}

export function StockDetail({ issuer, apiKey, onClose }: StockDetailProps) {
  const { data, isLoading, error } = useStockDetail(issuer, apiKey)

  const pct = data ? changePct(data.change, data.prev_price) : null
  const isUp = (data?.change ?? 0) > 0
  const isDown = (data?.change ?? 0) < 0

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-title">
          <span className="detail-issuer">{issuer}</span>
          {data && (
            <span className="detail-status" data-status={data.status}>
              {data.status}
            </span>
          )}
        </div>
        <button className="icon-btn" onClick={onClose} title="Close">
          <X size={16} />
        </button>
      </div>

      {isLoading && <div className="detail-loading">Loading…</div>}
      {error && <div className="detail-error">{(error as Error).message}</div>}

      {data && (
        <div className="detail-body">
          <div className="detail-price-block">
            <div className="detail-price">{fmtPrice(data.price)}</div>
            <div className={`detail-change ${isUp ? 'up' : isDown ? 'down' : ''}`}>
              {fmtChange(data.change)}
              {pct !== null && (
                <span className="detail-pct">
                  {' '}({pct > 0 ? '+' : ''}{pct.toFixed(2)}%)
                </span>
              )}
            </div>
            <div className="detail-prev">Prev close: {fmtPrice(data.prev_price)}</div>
          </div>

          <div className="detail-grid">
            <MetricCard label="Open" value={fmtPrice(data.today_open)} />
            <MetricCard label="High" value={fmtPrice(data.today_high)} highlight="up" />
            <MetricCard label="Low" value={fmtPrice(data.today_low)} highlight="down" />
            <MetricCard label="LTP" value={fmtPrice(data.ltp)} />
            <MetricCard label="Volume" value={fmtVolume(data.volume)} />
            <MetricCard label="Turnover" value={fmtTurnover(data.turnover)} />
          </div>

          <div className="detail-updated">
            Updated: {new Date(data.last_updated).toLocaleString('en-KE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'up' | 'down'
}) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${highlight ?? ''}`}>{value}</div>
    </div>
  )
}
