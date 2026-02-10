import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient, type User, type Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Extend Supabase User type or create a compatible one
interface SimpleUser extends Partial<User> {
  id: string
  phone?: string
  gene_profile?: any
  user_metadata: {
    name?: string
    hometown?: string
    [key: string]: any
  }
}

interface AuthContextType {
  user: SimpleUser | null
  session: Session | null
  loading: boolean
  signInWithPhone: (phone: string) => Promise<{ error: any }>
  verifyOtp: (phone: string, token: string) => Promise<{ error: any, session: Session | null, user: User | null }>
  simpleLogin: (phone: string, name: string, hometown: string) => Promise<{ error: any, user: SimpleUser | null }>
  updateUserGene: (geneData: any) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithPhone: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null, session: null, user: null }),
  simpleLogin: async () => ({ error: null, user: null }),
  updateUserGene: async () => {},
  signOut: async () => {},
})

const LOCAL_STORAGE_KEY = 'year-of-horse-user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Try to recover session from Supabase Auth (if any)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session)
        setUser(session.user)
        setLoading(false)
        return
      }
      
      // 2. If no Supabase session, check LocalStorage for "Simple Login" user
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (e) {
          console.error("Failed to parse stored user", e)
          localStorage.removeItem(LOCAL_STORAGE_KEY)
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session)
        setUser(session.user)
      } else {
        // If Supabase signs out, we might still want to keep the simple user logged in?
        // Or strictly follow sign out. Let's follow strict sign out for now.
        // But since simpleLogin doesn't use Supabase Auth, this event won't trigger for it.
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Legacy methods kept for compatibility
  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone })
    return { error }
  }

  const verifyOtp = async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    return { error, session: data.session, user: data.user }
  }

  // New Simplified Login Logic
  const simpleLogin = async (phone: string, name: string, hometown: string) => {
    try {
      // 1. Check if user exists in public.users
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .maybeSingle()

      if (searchError) throw searchError

      let userId = existingUsers?.id
      let finalUser: SimpleUser

      if (existingUsers) {
        // User exists, update info if changed
        userId = existingUsers.id
        const { error: updateError } = await supabase
          .from('users')
          .update({ name, hometown })
          .eq('id', userId)
        
        if (updateError) throw updateError
        
        finalUser = {
          id: userId,
          phone: phone,
          user_metadata: { name, hometown },
          gene_profile: existingUsers.gene_profile,
          role: 'user'
        }
      } else {
        // Create new user
        // Note: We need RLS to allow anon insert to public.users for this to work
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({ 
            phone, 
            name, 
            hometown,
            role: 'user'
          })
          .select()
          .single()

        if (createError) throw createError
        
        userId = newUser.id
        finalUser = {
          id: userId,
          phone: phone,
          user_metadata: { name, hometown },
          role: 'user'
        }
      }

      // Persist to local state and storage
      setUser(finalUser)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalUser))
      
      return { error: null, user: finalUser }
    } catch (err: any) {
      console.error("Simple login failed:", err)
      return { error: err, user: null }
    }
  }

  const updateUserGene = async (geneData: any) => {
    if (!user) return
    
    try {
      // Update DB
      await supabase
        .from('users')
        .update({ gene_profile: geneData })
        .eq('id', user.id)

      // Update Local State & Storage
      const updatedUser = { ...user, gene_profile: geneData }
      setUser(updatedUser)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser))
    } catch (err) {
      console.error("Failed to update gene:", err)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithPhone, verifyOtp, simpleLogin, updateUserGene, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
