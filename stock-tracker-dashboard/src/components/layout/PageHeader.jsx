export default function PageHeader({ title, subtitle }) {
  return (
    <div className="px-4 pt-4 sm:px-8 sm:pt-6">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  )
}
