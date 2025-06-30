import { createClient } from './client'
import { getSupabaseServer } from './server'
import type {
  SchemaProject,
  InsertSchemaProject,
  UpdateSchemaProject,
  InsertGenerationHistory,
  ProjectWithHistory
} from './types'

// Client-side queries
export const clientQueries = {
  async getSchemaProjects(userId: string): Promise<SchemaProject[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('schema_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getSchemaProject(id: string): Promise<SchemaProject | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('schema_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  async createSchemaProject(project: InsertSchemaProject): Promise<SchemaProject> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('schema_projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSchemaProject(id: string, updates: UpdateSchemaProject): Promise<SchemaProject> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('schema_projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSchemaProject(id: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('schema_projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('schema_projects')
      .update({ is_favorite: isFavorite })
      .eq('id', id)

    if (error) throw error
  },

  async addGenerationHistory(history: InsertGenerationHistory): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from('generation_history')
      .insert(history)

    if (error) throw error
  }
}

// Server-side queries
export const serverQueries = {
  async getSchemaProjects(userId: string): Promise<SchemaProject[]> {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from('schema_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getSchemaProjectWithHistory(id: string): Promise<ProjectWithHistory | null> {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from('schema_projects')
      .select(`
        *,
        generation_history (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data as ProjectWithHistory
  },

  async getUserProjects(userId: string): Promise<SchemaProject[]> {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from('schema_projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async searchProjects(userId: string, searchTerm: string): Promise<SchemaProject[]> {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from('schema_projects')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

// Helper functions
export const dbHelpers = {
  generateProjectName(prompt?: string, uploadedFilename?: string): string {
    if (prompt && prompt.length > 0) {
      // Extract first few words from prompt
      const words = prompt.split(' ').slice(0, 4).join(' ')
      return words.length > 30 ? words.substring(0, 30) + '...' : words
    }

    if (uploadedFilename) {
      return `Schema from ${uploadedFilename}`
    }

    return `Untitled Schema ${new Date().toLocaleDateString()}`
  },

  extractTagsFromPrompt(prompt: string): string[] {
    const commonTags = [
      'blog', 'ecommerce', 'social', 'saas', 'analytics',
      'users', 'posts', 'orders', 'products', 'auth'
    ]

    const promptLower = prompt.toLowerCase()
    return commonTags.filter(tag => promptLower.includes(tag))
  },

  formatProjectPreview(project: SchemaProject): string {
    if (project.original_prompt) {
      return project.original_prompt.length > 100
        ? project.original_prompt.substring(0, 100) + '...'
        : project.original_prompt
    }

    if (project.uploaded_sql) {
      return 'SQL file uploaded'
    }

    return 'No description available'
  }
}
