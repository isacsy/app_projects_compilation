import { LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AuthButton() {
  const { user, loading, authError, signInWithGoogle, signOutUser } = useAuth()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
  }

  if (!user) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={signInWithGoogle}
          className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          <span className="sm:hidden">Sign in</span>
          <span className="hidden sm:inline">Sign in with Google</span>
        </button>
        {authError && <p className="max-w-[200px] text-right text-xs text-red-500">{authError}</p>}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {user.displayName?.charAt(0) ?? user.email?.charAt(0) ?? '?'}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.displayName ?? 'Signed in'}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              signOutUser()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
