import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'

export function usePortfolio(user) {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setHoldings([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(collection(db, 'users', user.uid, 'holdings'), orderBy('addedAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHoldings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  async function addHolding({ symbol, quantity, buyPrice }) {
    if (!user) return
    await addDoc(collection(db, 'users', user.uid, 'holdings'), {
      symbol: symbol.trim().toUpperCase(),
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      addedAt: serverTimestamp(),
    })
  }

  async function removeHolding(id) {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'holdings', id))
  }

  return { holdings, loading, addHolding, removeHolding }
}
