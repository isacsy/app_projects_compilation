import { useSearchParams } from 'react-router-dom'
import KpiRow from '../components/dashboard/KpiRow'
import PageHeader from '../components/layout/PageHeader'
import StockDetailCard from '../components/stock/StockDetailCard'
import { useAuth } from '../context/AuthContext'
import { useCash } from '../hooks/useCash'
import { usePortfolio } from '../hooks/usePortfolio'

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const symbol = searchParams.get('symbol')
  const { user } = useAuth()
  const { holdings } = usePortfolio(user)
  const { cash } = useCash(user)

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Look up any stock to see its latest price and trend." />
      <div className="space-y-6 p-4 sm:p-8">
        {user && <KpiRow holdings={holdings} cash={cash} />}
        <StockDetailCard symbol={symbol} />
      </div>
    </>
  )
}
