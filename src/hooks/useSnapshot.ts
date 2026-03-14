import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { RefreshInterval } from '../types'

export function useSnapshot(apiKey: string, refreshInterval: RefreshInterval) {
  return useQuery({
    queryKey: ['snapshot', apiKey],
    queryFn: () => api.getSnapshot(apiKey),
    enabled: apiKey.length > 0,
    refetchInterval: refreshInterval || false,
    staleTime: 30_000,
  })
}

export function useStockDetail(issuer: string | null, apiKey: string) {
  return useQuery({
    queryKey: ['stock-detail', issuer, apiKey],
    queryFn: () => api.getStockDetail(issuer!, apiKey),
    enabled: !!issuer && apiKey.length > 0,
    staleTime: 30_000,
  })
}
