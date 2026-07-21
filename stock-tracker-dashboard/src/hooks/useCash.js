import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'

export function useCash(user) {
  const [cash, setCash] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setCash(0)
      setLoading(false)
      return
    }
    setLoading(true)
    const ref = doc(db, 'users', user.uid)
    const unsubscribe = onSnapshot(ref, (snap) => {
      setCash(snap.exists() ? Number(snap.data().availableCash ?? 0) : 0)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  async function updateCash(value) {
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), { availableCash: Number(value) }, { merge: true })
  }

  return { cash, loading, updateCash }
}
