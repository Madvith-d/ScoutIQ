import { createContext, useContext, useState } from 'react'

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const value = { currentAnalysis, setCurrentAnalysis }
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
