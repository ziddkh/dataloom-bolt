# Supabase Setup Guide for Dataloom

## Quick Start Summary

✅ **Packages installed**: `@supabase/supabase-js`, `@supabase/ssr`
✅ **Clients created**: Browser & server-side Supabase clients
✅ **Auth hooks**: Custom React hooks for authentication
✅ **Database schema**: Complete SQL schema ready to deploy
✅ **Middleware**: Automatic auth session management

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Name: `dataloom`
4. Set a strong database password (save it!)
5. Choose region closest to your users
6. Click "Create new project"

## Step 2: Environment Variables

Create `.env.local` in your project root:

```bash
# Supabase - Get these from your project settings
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI for AI schema generation
OPENAI_API_KEY=your_openai_api_key_here

# App config
NEXTAUTH_SECRET=your_random_secret_string_here
NEXTAUTH_URL=http://localhost:3000
```

**Finding your Supabase keys:**
1. In Supabase dashboard → Settings → API
2. Copy "Project URL" and both API keys

## Step 3: Run Database Schema

1. In Supabase dashboard → SQL Editor
2. Copy entire `supabase-schema.sql` file content
3. Paste and run it

Creates:
- User profiles (auto-created on signup)
- Schema projects table
- Generation history tracking
- Row-level security policies
- Performance indexes

## Step 4: Configure Auth

1. Authentication → Settings
2. ✅ Enable email confirmations
3. Site URL: `http://localhost:3000`
4. (Optional) Customize email templates

## Step 5: Test Everything

```bash
npm run dev
```

Test flow:
1. Visit app → sign up → check email → verify
2. Go to `/dashboard/new-schema`
3. Create a test schema
4. Verify data in Supabase Table Editor

## What's Already Set Up

**✅ Client Architecture:**
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/middleware.ts` - Auth protection

**✅ React Hooks:**
- `useAuth()` - Get user state, sign out
- `useRequireAuth()` - Protect pages

**✅ Database Queries:**
- `clientQueries` - Browser operations
- `serverQueries` - Server operations
- Helper functions for common tasks

**✅ TypeScript Types:**
- Complete database types
- Insert/Update/Select types
- API response interfaces

## Usage Examples

### Protect a page:
```tsx
'use client'
import { useRequireAuth } from '@/hooks/use-auth'

export default function ProtectedPage() {
  const { user, loading } = useRequireAuth()

  if (loading) return <div>Loading...</div>

  return <div>Hello {user?.email}</div>
}
```

### Save a schema project:
```tsx
import { clientQueries } from '@/lib/supabase/queries'

const saveProject = async () => {
  const project = await clientQueries.createSchemaProject({
    user_id: user.id,
    name: 'My Blog Schema',
    input_type: 'prompt',
    original_prompt: 'Create a blog...',
    generated_sql: 'CREATE TABLE...',
    // ... other fields
  })
}
```

### Get user's projects:
```tsx
const projects = await clientQueries.getSchemaProjects(user.id)
```

## Production Checklist

- [ ] Update Site URL in Supabase auth settings
- [ ] Set production environment variables
- [ ] Enable database backups
- [ ] Review RLS policies
- [ ] Set up monitoring alerts

## Troubleshooting

**Can't connect?** Check environment variables are exact
**Auth errors?** Verify email confirmation is working
**Database errors?** Ensure schema SQL ran completely
**RLS errors?** User must be authenticated for data access

Your Dataloom app is now database-ready! 🚀
