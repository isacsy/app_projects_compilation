import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import StockDetailCard from './components/stock/StockDetailCard'
import { ThemeProvider } from './context/ThemeContext'

function DashboardContent() {
  const [symbol, setSymbol] = useState(null)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar onSelectSymbol={setSymbol} />
        <main className="flex-1 p-4 sm:p-8">
          <StockDetailCard symbol={symbol} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  )
}
