export function fmtPrice(v: number | null | undefined): string {
  if (v == null) return '—'
  return v.toFixed(2)
}

export function fmtChange(v: number | null | undefined): string {
  if (v == null) return '—'
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}`
}

export function fmtVolume(v: number | null | undefined): string {
  if (v == null) return '—'
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v.toFixed(0)
}

export function fmtTurnover(v: number | null | undefined): string {
  if (v == null) return '—'
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v.toFixed(0)
}

export function changePct(
  change: number | null | undefined,
  prevPrice: number | null | undefined,
): number | null {
  if (change == null || prevPrice == null || prevPrice === 0) return null
  return (change / prevPrice) * 100
}
