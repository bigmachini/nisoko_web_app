import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { MoverTab, RefreshInterval } from '../types'

export function useMovers(tab: MoverTab, apiKey: string, refreshInterval: RefreshInterval) {
  return useQuery({
    queryKey: ['movers', tab, apiKey],
    queryFn: () => api.getMovers(tab, apiKey),
    enabled: apiKey.length > 0,
    refetchInterval: refreshInterval || false,
    staleTime: 30_000,
  })
}
