import { createContext, ReactNode, useEffect, useState } from 'react'
import { auth } from '../services/firebase'

export const AuthContext = createContext({} as AuthContextType)

type UserType = {
  id: string
  name: string
  avatar: string
}

type AuthContextType = {
  user: UserType | undefined
  signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserType>()
  const instance = auth.getAuth()

  const signInWithGoogle = async () => {
    const provider = new auth.GoogleAuthProvider()

    try {
      const result = await auth.signInWithPopup(instance, provider)

      if (result.user) {
        const { displayName, photoURL, uid } = result.user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    } catch (e) {}
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(instance, user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [instance])
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>{props.children}</AuthContext.Provider>
  )
}
