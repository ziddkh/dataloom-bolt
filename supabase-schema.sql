-- Dataloom Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for input types
CREATE TYPE input_type AS ENUM ('prompt', 'sql_upload', 'mixed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema projects table - main table for storing generated schemas
CREATE TABLE public.schema_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    input_type input_type NOT NULL,
    original_prompt TEXT,
    uploaded_sql TEXT,
    generated_sql TEXT NOT NULL,
    ai_explanation TEXT,
    ai_suggestions TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generation history table - track AI generation attempts
CREATE TABLE public.generation_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.schema_projects(id) ON DELETE CASCADE NOT NULL,
    prompt_used TEXT NOT NULL,
    sql_generated TEXT NOT NULL,
    ai_model TEXT NOT NULL DEFAULT 'gpt-4',
    generation_time_ms INTEGER NOT NULL,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_schema_projects_user_id ON public.schema_projects(user_id);
CREATE INDEX idx_schema_projects_created_at ON public.schema_projects(created_at DESC);
CREATE INDEX idx_schema_projects_updated_at ON public.schema_projects(updated_at DESC);
CREATE INDEX idx_schema_projects_is_favorite ON public.schema_projects(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX idx_schema_projects_tags ON public.schema_projects USING GIN(tags);

CREATE INDEX idx_generation_history_project_id ON public.generation_history(project_id);
CREATE INDEX idx_generation_history_created_at ON public.generation_history(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only access their own schema projects
CREATE POLICY "Users can view own projects" ON public.schema_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.schema_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.schema_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.schema_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Users can only access generation history for their own projects
CREATE POLICY "Users can view own generation history" ON public.generation_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.schema_projects
            WHERE id = generation_history.project_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert generation history for own projects" ON public.generation_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.schema_projects
            WHERE id = generation_history.project_id
            AND user_id = auth.uid()
        )
    );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_schema_projects
    BEFORE UPDATE ON public.schema_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Optional: Create some sample data (remove this in production)
-- INSERT INTO public.schema_projects (user_id, name, description, input_type, original_prompt, generated_sql, ai_explanation, tags)
-- VALUES (
--     auth.uid(),
--     'Sample Blog Schema',
--     'A basic blog system with users, posts, and comments',
--     'prompt',
--     'Create a blog system with users, posts, and comments. Include proper relationships and indexing.',
--     'CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, username VARCHAR(100) UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);',
--     'This schema provides a solid foundation for a blog system with proper normalization and indexing.',
--     ARRAY['blog', 'users', 'posts']
-- );
