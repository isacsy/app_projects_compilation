import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'

export function useWatchlist(user) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(collection(db, 'users', user.uid, 'watchlist'), orderBy('addedAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  async function addSymbol(symbol) {
    const clean = symbol.trim().toUpperCase()
    if (!clean || !user) return
    await setDoc(doc(db, 'users', user.uid, 'watchlist', clean), {
      symbol: clean,
      addedAt: serverTimestamp(),
    })
  }

  async function removeSymbol(symbol) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'watchlist', symbol))
  }

  return { items, loading, addSymbol, removeSymbol }
}
