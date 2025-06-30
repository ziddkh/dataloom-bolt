export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schema_projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          input_type: 'prompt' | 'sql_upload' | 'mixed'
          original_prompt: string | null
          uploaded_sql: string | null
          generated_sql: string
          ai_explanation: string | null
          ai_suggestions: string | null
          tags: string[]
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          input_type: 'prompt' | 'sql_upload' | 'mixed'
          original_prompt?: string | null
          uploaded_sql?: string | null
          generated_sql: string
          ai_explanation?: string | null
          ai_suggestions?: string | null
          tags?: string[]
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          input_type?: 'prompt' | 'sql_upload' | 'mixed'
          original_prompt?: string | null
          uploaded_sql?: string | null
          generated_sql?: string
          ai_explanation?: string | null
          ai_suggestions?: string | null
          tags?: string[]
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      generation_history: {
        Row: {
          id: string
          project_id: string
          prompt_used: string
          sql_generated: string
          ai_model: string
          generation_time_ms: number
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          prompt_used: string
          sql_generated: string
          ai_model: string
          generation_time_ms: number
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          prompt_used?: string
          sql_generated?: string
          ai_model?: string
          generation_time_ms?: number
          tokens_used?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      input_type: 'prompt' | 'sql_upload' | 'mixed'
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type InsertUser = Database['public']['Tables']['users']['Insert']
export type UpdateUser = Database['public']['Tables']['users']['Update']

export type SchemaProject = Database['public']['Tables']['schema_projects']['Row']
export type InsertSchemaProject = Database['public']['Tables']['schema_projects']['Insert']
export type UpdateSchemaProject = Database['public']['Tables']['schema_projects']['Update']

export type GenerationHistory = Database['public']['Tables']['generation_history']['Row']
export type InsertGenerationHistory = Database['public']['Tables']['generation_history']['Insert']
export type UpdateGenerationHistory = Database['public']['Tables']['generation_history']['Update']

// Additional types for API responses
export interface SchemaGenerationResult {
  sql: string
  explanation: string
  suggestions: string[]
  executionTime: number
  tokensUsed?: number
}

export interface ProjectWithHistory extends SchemaProject {
  generation_history: GenerationHistory[]
}
