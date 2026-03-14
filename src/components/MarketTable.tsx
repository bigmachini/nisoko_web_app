import { ArrowUpDown, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SortDir, SortKey, StockSnapshot } from '../types'
import { changePct, fmtChange, fmtPrice, fmtVolume, fmtTurnover } from '../utils/format'

interface MarketTableProps {
  data: StockSnapshot[]
  onSelectIssuer: (issuer: string) => void
  selectedIssuer: string | null
}

const COLUMNS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'issuer', label: 'Issuer', align: 'left' },
  { key: 'price', label: 'Price (KES)', align: 'right' },
  { key: 'change', label: 'Change', align: 'right' },
  { key: 'today_open', label: 'Open', align: 'right' },
  { key: 'today_high', label: 'High', align: 'right' },
  { key: 'today_low', label: 'Low', align: 'right' },
  { key: 'volume', label: 'Volume', align: 'right' },
  { key: 'turnover', label: 'Turnover', align: 'right' },
]

export function MarketTable({ data, onSelectIssuer, selectedIssuer }: MarketTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('issuer')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filtered = useMemo(() => {
    const q = search.trim().toUpperCase()
    return q ? data.filter((s) => s.issuer.includes(q)) : data
  }, [data, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? (sortDir === 'asc' ? Infinity : -Infinity)
      const bv = b[sortKey] ?? (sortDir === 'asc' ? Infinity : -Infinity)
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc'
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number)
    })
  }, [filtered, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'issuer' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search issuer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>×</button>
          )}
        </div>
        <span className="row-count">{sorted.length} stocks</span>
      </div>

      <div className="table-scroll">
        <table className="market-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`th-${col.align}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="th-inner">
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </span>
                </th>
              ))}
              <th className="th-right">Chg %</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const pct = changePct(s.change, s.prev_price)
              const isUp = (s.change ?? 0) > 0
              const isDown = (s.change ?? 0) < 0

              return (
                <tr
                  key={s.id}
                  className={`table-row ${selectedIssuer === s.issuer ? 'selected' : ''}`}
                  onClick={() => onSelectIssuer(s.issuer)}
                >
                  <td className="td-issuer">
                    <span className="issuer-badge">{s.issuer}</span>
                  </td>
                  <td className="td-num">{fmtPrice(s.price)}</td>
                  <td className={`td-num ${isUp ? 'up' : isDown ? 'down' : ''}`}>
                    {fmtChange(s.change)}
                  </td>
                  <td className="td-num">{fmtPrice(s.today_open)}</td>
                  <td className="td-num">{fmtPrice(s.today_high)}</td>
                  <td className="td-num">{fmtPrice(s.today_low)}</td>
                  <td className="td-num">{fmtVolume(s.volume)}</td>
                  <td className="td-num">{fmtTurnover(s.turnover)}</td>
                  <td className={`td-num td-pct ${isUp ? 'up' : isDown ? 'down' : ''}`}>
                    {pct !== null ? (
                      <span className={`pct-badge ${isUp ? 'up' : isDown ? 'down' : ''}`}>
                        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown size={11} className="sort-icon inactive" />
  return dir === 'asc' ? (
    <ChevronUp size={11} className="sort-icon active" />
  ) : (
    <ChevronDown size={11} className="sort-icon active" />
  )
}
