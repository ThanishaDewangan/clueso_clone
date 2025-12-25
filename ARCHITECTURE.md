# Clueso Clone - Architecture Documentation

## System Architecture Overview

This document provides a deep dive into the technical architecture, design patterns, and implementation decisions for the Clueso.io clone.

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Database Schema](#database-schema)
3. [Authentication Flow](#authentication-flow)
4. [Video Upload Flow](#video-upload-flow)
5. [AI Processing Pipeline](#ai-processing-pipeline)
6. [Browser Extension Integration](#browser-extension-integration)
7. [Security Model](#security-model)
8. [Scalability Considerations](#scalability-considerations)

## High-Level Architecture

### Three-Tier Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│  ┌──────────────────┐        ┌───────────────────┐            │
│  │ Next.js Frontend │        │ Browser Extension │            │
│  │  (React + TS)    │        │  (Chrome API)     │            │
│  └────────┬─────────┘        └─────────┬─────────┘            │
└───────────┼──────────────────────────────┼─────────────────────┘
            │                              │
            │ HTTPS/API                    │ HTTPS/API
            ▼                              ▼
┌────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Next.js API Routes (Backend)                 │ │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐│ │
│  │  │ Projects   │ │ AI       │ │ Upload   │ │ Auth      ││ │
│  │  │ API        │ │ API      │ │ API      │ │ Proxy     ││ │
│  │  └────────────┘ └──────────┘ └──────────┘ └───────────┘│ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────┬──────────────────┬───────────────────┬────────────┘
            │                  │                   │
            ▼                  ▼                   ▼
┌────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │  Supabase    │  │ Vercel Blob │  │  Vercel AI Gateway   │ │
│  │  PostgreSQL  │  │  Storage    │  │  (GPT-4)             │ │
│  │  + Auth      │  │             │  │                      │ │
│  └──────────────┘  └─────────────┘  └──────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│   profiles  │
│─────────────│
│ id (PK)     │───┐
│ email       │   │
│ full_name   │   │
│ avatar_url  │   │
│ created_at  │   │
└─────────────┘   │
                  │
                  │ 1:N
                  │
                  ▼
            ┌─────────────┐
            │  projects   │
            │─────────────│
            │ id (PK)     │───┐
            │ user_id (FK)│   │
            │ name        │   │
            │ description │   │ 1:N
            │ status      │   │
            │ thumbnail   │   ▼
            │ duration    │   ┌──────────────┐
            │ created_at  │   │  recordings  │
            └─────────────┘   │──────────────│
                  │           │ id (PK)      │
                  │ 1:N       │ project_id   │
                  │           │ file_url     │
                  ▼           │ file_name    │
            ┌─────────────┐   │ file_size    │
            │   scripts   │   │ duration     │
            │─────────────│   │ created_at   │
            │ id (PK)     │   └──────────────┘
            │ project_id  │
            │ content     │
            │ version     │
            │ language    │
            │ created_at  │
            └─────────────┘
```

### Table Definitions

**profiles**
- Primary user information
- Automatically created via trigger on auth.users insert
- 1:1 relationship with Supabase auth users

**projects**
- Main entity for video projects
- Belongs to one user
- Has many recordings and scripts
- Status: draft | processing | completed | error

**recordings**
- Stores video file metadata
- Links to Vercel Blob URLs
- Tracks file size and duration
- Belongs to one project

**scripts**
- AI-generated or user-edited scripts
- Version controlled
- Supports multiple languages
- Belongs to one project

**workspaces** (Collaboration)
- Team workspace container
- Has many members
- Has many shared projects

**workspace_members**
- Join table for users and workspaces
- Role: owner | admin | member
- Manages permissions

**comments**
- Project feedback and collaboration
- Nested comment threads
- Mentions support
- Belongs to project and user

### Row Level Security (RLS) Policies

**profiles**
```sql
-- Users can view any profile (for mentions, etc.)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);
```

**projects**
```sql
-- Users can view their own projects
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE USING (auth.uid() = user_id);
```

## Authentication Flow

### Sign Up Flow

```
User                    Frontend               Supabase              Database
  │                        │                      │                     │
  │ 1. Enter credentials   │                      │                     │
  ├───────────────────────>│                      │                     │
  │                        │ 2. signUp()          │                     │
  │                        ├─────────────────────>│                     │
  │                        │                      │ 3. Create user      │
  │                        │                      ├────────────────────>│
  │                        │                      │                     │
  │                        │                      │ 4. Trigger          │
  │                        │                      │    create_profile() │
  │                        │                      │<────────────────────│
  │                        │ 5. Confirmation email│                     │
  │<───────────────────────┼──────────────────────│                     │
  │                        │                      │                     │
  │ 6. Click link          │                      │                     │
  ├────────────────────────┼─────────────────────>│                     │
  │                        │                      │ 7. Verify email     │
  │                        │                      ├────────────────────>│
  │                        │ 8. Set session       │                     │
  │<───────────────────────┼──────────────────────│                     │
  │                        │                      │                     │
  │ 9. Redirect to dashboard                      │                     │
  ├───────────────────────>│                      │                     │
```

### Login Flow

```
User                Frontend            Middleware          Supabase
  │                    │                    │                  │
  │ 1. Submit login    │                    │                  │
  ├───────────────────>│                    │                  │
  │                    │ 2. signInWithPassword()             │
  │                    ├──────────────────────────────────────>│
  │                    │                    │                  │
  │                    │ 3. Return session  │                  │
  │                    │<──────────────────────────────────────│
  │                    │                    │                  │
  │                    │ 4. Redirect to /dashboard            │
  │<───────────────────│                    │                  │
  │                    │                    │                  │
  │ 5. Request /dashboard                   │                  │
  ├────────────────────┼───────────────────>│                  │
  │                    │                    │ 6. Check session │
  │                    │                    ├─────────────────>│
  │                    │                    │                  │
  │                    │                    │ 7. Valid session │
  │                    │                    │<─────────────────│
  │                    │ 8. Allow access    │                  │
  │<───────────────────┼────────────────────│                  │
```

## Video Upload Flow

### Client-Side Upload

```
User              Component           API Route         Vercel Blob      Database
  │                  │                    │                  │              │
  │ 1. Select file   │                    │                  │              │
  ├─────────────────>│                    │                  │              │
  │                  │ 2. Validate file   │                  │              │
  │                  │    (type, size)    │                  │              │
  │                  │                    │                  │              │
  │                  │ 3. POST /api/upload│                  │              │
  │                  ├───────────────────>│                  │              │
  │                  │                    │ 4. put()         │              │
  │                  │                    ├─────────────────>│              │
  │                  │                    │                  │              │
  │                  │                    │ 5. Return URL    │              │
  │                  │                    │<─────────────────│              │
  │                  │                    │                  │              │
  │                  │                    │ 6. Save metadata │              │
  │                  │                    ├─────────────────────────────────>│
  │                  │ 7. Return success  │                  │              │
  │                  │<───────────────────│                  │              │
  │                  │                    │                  │              │
  │ 8. Show success  │                    │                  │              │
  │<─────────────────│                    │                  │              │
```

### Browser Extension Upload

```
Extension         Background.js      API              Vercel Blob       Database
  │                   │                │                   │               │
  │ 1. Stop recording │                │                   │               │
  ├──────────────────>│                │                   │               │
  │                   │ 2. Get blob    │                   │               │
  │                   │    data        │                   │               │
  │                   │                │                   │               │
  │                   │ 3. POST to     │                   │               │
  │                   │    /api/upload │                   │               │
  │                   ├───────────────>│                   │               │
  │                   │                │ 4. Upload blob    │               │
  │                   │                ├──────────────────>│               │
  │                   │                │                   │               │
  │                   │                │ 5. Get URL        │               │
  │                   │                │<──────────────────│               │
  │                   │                │                   │               │
  │                   │                │ 6. Create project │               │
  │                   │                │   and recording   │               │
  │                   │                ├──────────────────────────────────>│
  │                   │ 7. Success     │                   │               │
  │                   │<───────────────│                   │               │
  │ 8. Notify user    │                │                   │               │
  │<──────────────────│                │                   │               │
```

## AI Processing Pipeline

### Script Generation Flow

```
Client          API Route        Vercel AI SDK      GPT-4         Database
  │                 │                  │               │              │
  │ 1. Request      │                  │               │              │
  │    generate     │                  │               │              │
  ├────────────────>│                  │               │              │
  │                 │ 2. Fetch video   │               │              │
  │                 │    metadata      │               │              │
  │                 ├─────────────────────────────────────────────────>│
  │                 │                  │               │              │
  │                 │ 3. Build prompt  │               │              │
  │                 │                  │               │              │
  │                 │ 4. generateText()│               │              │
  │                 ├─────────────────>│               │              │
  │                 │                  │ 5. API call   │              │
  │                 │                  ├──────────────>│              │
  │                 │                  │               │              │
  │                 │                  │ 6. Stream     │              │
  │                 │                  │    response   │              │
  │                 │                  │<──────────────│              │
  │                 │ 7. Return text   │               │              │
  │                 │<─────────────────│               │              │
  │                 │                  │               │              │
  │                 │ 8. Save script   │               │              │
  │                 ├─────────────────────────────────────────────────>│
  │                 │                  │               │              │
  │ 9. Display      │                  │               │              │
  │    script       │                  │               │              │
  │<────────────────│                  │               │              │
```

### Prompt Engineering

**Script Generation Prompt Template:**
```typescript
const prompt = `You are a professional video script writer. Generate a compelling script for a product demo video.

Video Context:
- Duration: ${duration} seconds
- Title: ${title}
- Description: ${description}

Requirements:
- Create an engaging hook in the first 5 seconds
- Explain key features clearly
- Use conversational, friendly tone
- Include clear call-to-action
- Keep sentences short and punchy
- Match the video duration

Generate the script:`
```

## Browser Extension Integration

### Manifest V3 Structure

```json
{
  "manifest_version": 3,
  "name": "Clueso Screen Recorder",
  "permissions": [
    "desktopCapture",
    "storage",
    "activeTab"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  }
}
```

### Recording Workflow

```
Popup UI        Background       Chrome API        MediaRecorder
  │                │                 │                   │
  │ 1. Click       │                 │                   │
  │    "Record"    │                 │                   │
  ├───────────────>│                 │                   │
  │                │ 2. Request      │                   │
  │                │    sources      │                   │
  │                ├────────────────>│                   │
  │                │                 │                   │
  │                │ 3. Return       │                   │
  │                │    sources      │                   │
  │                │<────────────────│                   │
  │                │                 │                   │
  │ 4. Show picker │                 │                   │
  │<───────────────│                 │                   │
  │                │                 │                   │
  │ 5. Select      │                 │                   │
  │    screen      │                 │                   │
  ├───────────────>│                 │                   │
  │                │ 6. Start        │                   │
  │                │    recording    │                   │
  │                ├─────────────────────────────────────>│
  │                │                 │                   │
  │ 7. Recording...│                 │                   │
  │<───────────────│                 │                   │
  │                │                 │                   │
  │ 8. Click "Stop"│                 │                   │
  ├───────────────>│                 │                   │
  │                │ 9. Stop & get   │                   │
  │                │    blob         │                   │
  │                ├─────────────────────────────────────>│
  │                │                 │                   │
  │                │ 10. Upload to   │                   │
  │                │     server      │                   │
  │                │                 │                   │
```

## Security Model

### Defense in Depth Layers

**1. Authentication Layer**
- Supabase Auth with JWT tokens
- HTTP-only cookies for session management
- Automatic token refresh
- Email verification required

**2. Authorization Layer**
- Row Level Security (RLS) on all tables
- User-owned data policies
- Workspace-based permissions
- Role-based access control (RBAC)

**3. API Layer**
- Authentication check on every API route
- Rate limiting (via Vercel)
- Input validation with Zod schemas
- CORS configuration

**4. Data Layer**
- Parameterized queries (SQL injection prevention)
- Encrypted connections (SSL/TLS)
- Database backup and recovery
- Audit logging

### Security Best Practices Implemented

✅ Never expose service role keys to client
✅ Always use RLS policies, never trust client
✅ Validate all inputs server-side
✅ Use TypeScript for type safety
✅ Sanitize user-generated content
✅ Rate limit expensive operations
✅ Log security-relevant events
✅ Regular dependency updates

## Scalability Considerations

### Current Architecture Limits

- **Database**: Supabase PostgreSQL (scales to millions of rows)
- **File Storage**: Vercel Blob (unlimited storage, CDN-backed)
- **Compute**: Vercel serverless functions (auto-scaling)
- **AI**: Rate-limited by Vercel AI Gateway

### Optimization Strategies

**1. Database Optimization**
- Indexes on frequently queried columns
- Pagination for large result sets
- Connection pooling via Supabase
- Query optimization with EXPLAIN

**2. Caching Strategy**
```typescript
// Client-side caching with SWR
const { data, error } = useSWR(
  '/api/projects',
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds
  }
)
```

**3. Image Optimization**
- Next.js Image component for automatic optimization
- Lazy loading for off-screen images
- Responsive images with srcset
- WebP format with fallbacks

**4. Code Splitting**
- Route-based code splitting (automatic in Next.js)
- Dynamic imports for heavy components
- Tree shaking unused code
- Bundle analysis with @next/bundle-analyzer

### Scaling Roadmap

**Phase 1: Current (Prototype)**
- Single-region deployment
- Serverless functions
- Direct database queries

**Phase 2: Production (100-1000 users)**
- Add Redis caching layer
- Implement CDN for static assets
- Background job processing
- Database read replicas

**Phase 3: Scale (1000-10000 users)**
- Multi-region deployment
- Queue-based video processing
- Edge functions for global latency
- Advanced monitoring and alerting

**Phase 4: Enterprise (10000+ users)**
- Dedicated database cluster
- Video transcoding pipeline
- Real-time collaboration infrastructure
- Multi-tenant architecture

## Performance Metrics

### Target Performance

- **Time to Interactive (TTI)**: < 3s
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time**: < 500ms (p95)

### Monitoring

- Vercel Analytics for Core Web Vitals
- Supabase Dashboard for database metrics
- Custom logging for error tracking
- User feedback collection

---

This architecture is designed to be:
- **Scalable**: Grows with user demand
- **Secure**: Multiple layers of protection
- **Maintainable**: Clean separation of concerns
- **Observable**: Comprehensive monitoring
- **Cost-effective**: Serverless, pay-per-use model
