import { useEffect, useState } from 'react'

export default function StockLogo({ symbol, logoUrl }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [logoUrl])

  if (logoUrl && !failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
        <img src={logoUrl} alt="" className="h-full w-full object-contain" onError={() => setFailed(true)} />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-semibold text-white">
      {symbol?.charAt(0) ?? '?'}
    </div>
  )
}
