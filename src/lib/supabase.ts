import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with error handling
let supabase: any = null

try {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    // Mock client for development when Supabase is not configured
    supabase = {
      auth: {
        signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null })
      })
    }
  }
} catch (error) {
  console.warn('Supabase initialization failed:', error)
  // Fallback mock client
  supabase = {
    auth: {
      signUp: async () => ({ data: null, error: { message: 'Supabase connection failed' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase connection failed' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    })
  }
}

export { supabase }

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          target_field: string | null
          target_salary: number | null
          experience_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          target_field?: string | null
          target_salary?: number | null
          experience_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          target_field?: string | null
          target_salary?: number | null
          experience_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resume_analyses: {
        Row: {
          id: string
          user_id: string
          resume_text: string
          extracted_skills: any
          match_score: number
          gaps: any
          strengths: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_text: string
          extracted_skills: any
          match_score: number
          gaps: any
          strengths: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_text?: string
          extracted_skills?: any
          match_score?: number
          gaps?: any
          strengths?: any
          created_at?: string
        }
      }
    }
  }
}