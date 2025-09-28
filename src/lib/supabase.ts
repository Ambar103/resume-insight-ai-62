import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string
          filename: string
          file_url: string | null
          file_content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          file_url?: string | null
          file_content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          file_url?: string | null
          file_content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          resume_id: string
          personal_info: any
          ats_score: any
          skills_analysis: any
          compatibility_analysis: any
          created_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          personal_info?: any
          ats_score?: any
          skills_analysis?: any
          compatibility_analysis?: any
          created_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          personal_info?: any
          ats_score?: any
          skills_analysis?: any
          compatibility_analysis?: any
          created_at?: string
        }
      }
      job_requirements: {
        Row: {
          id: string
          job_title: string
          required_skills: string[]
          preferred_skills: string[] | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_title: string
          required_skills: string[]
          preferred_skills?: string[] | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_title?: string
          required_skills?: string[]
          preferred_skills?: string[] | null
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}