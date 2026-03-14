import { createContext, useContext, useState } from 'react'
import type { Theme } from '../types'

const STORAGE_KEY = 'NiSoko:theme'

function loadTheme(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark'
}

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(loadTheme)

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
