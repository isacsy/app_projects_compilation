import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import SignInPrompt from '../components/layout/SignInPrompt'
import { useAuth } from '../context/AuthContext'
import { useCash } from '../hooks/useCash'

export default function SettingsPage() {
  const { user, signOutUser } = useAuth()
  const { cash, loading, updateCash } = useCash(user)
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading) setInput(String(cash))
  }, [cash, loading])

  if (!user) {
    return (
      <>
        <PageHeader title="Settings" subtitle="Manage your account and cash balance." />
        <div className="p-4 sm:p-8">
          <SignInPrompt message="Sign in to manage your settings." />
        </div>
      </>
    )
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateCash(input)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and cash balance." />
      <div className="max-w-lg space-y-6 p-4 sm:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Account</h2>
          <div className="mt-3 flex items-center gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOutUser}
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Available Cash</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cash you're holding that isn't invested. Shown on your Dashboard.
          </p>
          <form onSubmit={handleSave} className="mt-3 flex gap-2">
            <input
              type="number"
              step="any"
              min="0"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setSaved(false)
              }}
              className="w-full max-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              Save
            </button>
          </form>
          {saved && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">Saved.</p>}
        </div>
      </div>
    </>
  )
}
