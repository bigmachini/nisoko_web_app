import { useState } from 'react'
import { Header } from './components/Header'
import { MarketTable } from './components/MarketTable'
import { MoversPanel } from './components/MoversPanel'
import { StatsBar } from './components/StatsBar'
import { StockDetail } from './components/StockDetail'
import { useAuth } from './context/AuthContext'
import { useSnapshot } from './hooks/useSnapshot'
import type { RefreshInterval } from './types'

export function App() {
  const { apiKey } = useAuth()
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(60000)
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null)

  const { data, isLoading, error, dataUpdatedAt } = useSnapshot(apiKey ?? '', refreshInterval)

  function handleSelectIssuer(issuer: string) {
    setSelectedIssuer((cur) => (cur === issuer ? null : issuer))
  }

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-KE', { timeStyle: 'medium' })
    : null

  return (
    <div className="app">
      <Header
        refreshInterval={refreshInterval}
        onRefreshChange={setRefreshInterval}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
      />

      {data && data.length > 0 && <StatsBar data={data} />}

      <div className="main-layout">
        <MoversPanel
          apiKey={apiKey ?? ''}
          refreshInterval={refreshInterval}
          onSelectIssuer={handleSelectIssuer}
          selectedIssuer={selectedIssuer}
        />

        <div className="content-area">
          {isLoading && !data && (
            <div className="loading-state">
              <div className="spinner" />
              <span>Fetching market data…</span>
            </div>
          )}

          {error && !data && (
            <div className="error-state">
              <span>Failed to load market data: {(error as Error).message}</span>
            </div>
          )}

          {data && (
            <MarketTable
              data={data}
              onSelectIssuer={handleSelectIssuer}
              selectedIssuer={selectedIssuer}
            />
          )}
        </div>
      </div>

      {selectedIssuer && (
        <div className="detail-overlay">
          <StockDetail
            issuer={selectedIssuer}
            apiKey={apiKey ?? ''}
            onClose={() => setSelectedIssuer(null)}
          />
        </div>
      )}
    </div>
  )
}
