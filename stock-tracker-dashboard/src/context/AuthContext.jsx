import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    // Picks up the result (or error) after signInWithRedirect sends the
    // browser to Google and back. Popup-based sign-in is unreliable on
    // Safari/iOS due to tracking prevention, so we use the redirect flow.
    getRedirectResult(auth).catch((err) => {
      setAuthError(`${err.code ?? 'auth-error'}: ${err.message}`)
    })

    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    setAuthError(null)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithRedirect(auth, provider)
    } catch (err) {
      setAuthError(`${err.code ?? 'auth-error'}: ${err.message}`)
    }
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
