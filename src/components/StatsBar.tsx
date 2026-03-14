import { Activity, ArrowDown, ArrowUp, Minus } from 'lucide-react'
import type { StockSnapshot } from '../types'
import { fmtVolume, fmtTurnover } from '../utils/format'

interface StatsBarProps {
  data: StockSnapshot[]
}

export function StatsBar({ data }: StatsBarProps) {
  const gainers = data.filter((s) => (s.change ?? 0) > 0).length
  const losers = data.filter((s) => (s.change ?? 0) < 0).length
  const unchanged = data.length - gainers - losers

  const totalTurnover = data.reduce((sum, s) => sum + (s.turnover ?? 0), 0)
  const totalVolume = data.reduce((sum, s) => sum + (s.volume ?? 0), 0)

  return (
    <div className="stats-bar">
      <Stat icon={<Activity size={14} />} label="Listed" value={data.length.toString()} />
      <div className="stats-divider" />
      <Stat
        icon={<ArrowUp size={14} className="up" />}
        label="Gainers"
        value={gainers.toString()}
        valueClass="up"
      />
      <Stat
        icon={<ArrowDown size={14} className="down" />}
        label="Losers"
        value={losers.toString()}
        valueClass="down"
      />
      <Stat icon={<Minus size={14} />} label="Unchanged" value={unchanged.toString()} />
      <div className="stats-divider" />
      <Stat label="Total Volume" value={fmtVolume(totalVolume)} />
      <Stat label="Total Turnover" value={'KES ' + fmtTurnover(totalTurnover)} />
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  valueClass,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="stat-item">
      {icon && <span className="stat-icon">{icon}</span>}
      <div>
        <div className={`stat-value ${valueClass ?? ''}`}>{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

