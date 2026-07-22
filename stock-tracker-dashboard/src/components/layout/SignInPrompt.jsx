import { useAuth } from '../../context/AuthContext'

export default function SignInPrompt({ message }) {
  const { authError, signInWithGoogle } = useAuth()

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <button
        type="button"
        onClick={signInWithGoogle}
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
      >
        Sign in with Google
      </button>
      {authError && <p className="max-w-xs text-xs text-red-500">{authError}</p>}
    </div>
  )
}
