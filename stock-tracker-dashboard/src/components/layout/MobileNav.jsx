import { Briefcase, LayoutDashboard, Settings, Star } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Watchlist', icon: Star, to: '/watchlist' },
  { label: 'Portfolio', icon: Briefcase, to: '/portfolio' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
      {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
        <NavLink
          key={label}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
