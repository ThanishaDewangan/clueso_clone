# Clueso.io Clone

A full-stack clone of Clueso.io - an AI-powered screen recording and video creation platform that helps teams create professional product videos, documentation, and tutorials.

## Overview

This project replicates the core functionality of Clueso.io, including:

- Screen recording via Chrome extension
- AI-powered script generation and improvement
- Professional video editing interface
- Project management dashboard
- User authentication and data persistence
- Team collaboration features
- Multi-language support

## Architecture

The application consists of three main components:

### 1. Web Application (Next.js 16)
- **Framework**: Next.js 16 with App Router
- **UI**: React 19.2, Tailwind CSS v4, shadcn/ui components
- **Authentication**: Supabase Auth with email/password
- **Database**: PostgreSQL via Supabase with Row Level Security
- **API**: Next.js API routes and Server Actions
- **File Storage**: Vercel Blob
- **AI Features**: Vercel AI SDK (GPT-4)

### 2. Browser Extension (Chrome)
- **Manifest**: v3
- **Features**: Screen/window/tab recording, quality settings, direct upload
- **Integration**: Seamless connection with web app

### 3. Database (Supabase)
- **Tables**: profiles, projects, recordings, scripts, workspaces, workspace_members, comments
- **Security**: Row Level Security (RLS) on all tables
- **Storage**: Video files and thumbnails

## Features Implemented

### Core Features

#### User Authentication
- Email/password signup and login
- Protected routes with middleware
- Session management
- Automatic profile creation

#### Dashboard
- Project overview with statistics
- Project cards with thumbnails and status
- Create new projects
- Quick actions (edit, delete)

#### Screen Recording
- Chrome extension for capturing screen/window/tab
- Quality settings (480p, 720p, 1080p)
- FPS control (24, 30, 60 fps)
- Pause/resume functionality
- Automatic upload to dashboard

#### AI Features
- **Script Generator**: Real AI-powered script generation using Vercel AI SDK (GPT-4)
- **Script Improvement**: AI-enhanced script optimization with streaming responses
- **Voiceover**: AI voice generation with multiple voice options (alloy, echo, fable, onyx, nova, shimmer)
- **Auto Captions**: Customizable caption styles with AI assistance
- **Smart Effects**: Auto zoom, highlights, background blur
- **Translation**: Multi-language support (EN, ES, FR, DE, IT, PT, ZH, JA, KO)

#### Video Editor
- Professional timeline interface
- Video player with playback controls
- Multi-track support (video, audio, captions)
- AI panel integration
- Export and share functionality

#### Team Collaboration
- Workspaces for team organization
- Member management with roles (Owner, Admin, Member)
- Invite system for adding team members
- Project sharing within workspaces
- Comment system for feedback and discussions

#### Video Storage
- Vercel Blob integration for scalable video storage
- CDN-backed video delivery
- Automatic metadata extraction (duration, dimensions, format)
- Thumbnail generation
- Secure file upload with validation

## Tech Stack

**Frontend**
- Next.js 16 (React 19.2)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

**Backend**
- Next.js API Routes
- Server Actions
- Supabase (PostgreSQL)
- Vercel Blob (File Storage)
- Vercel AI SDK (AI Features)

**Authentication**
- Supabase Auth
- Row Level Security

**Browser Extension**
- Chrome Extension Manifest v3
- MediaRecorder API
- Chrome Desktop Capture API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (integration already configured)
- Chrome browser (for extension)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd clueso-clone
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**

The following environment variables are already configured via integrations:

**Supabase (Database & Auth):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

**Vercel Blob (File Storage):**
- `BLOB_READ_WRITE_TOKEN`

**Vercel AI Gateway (AI Features):**
- Automatically configured, no API keys needed
- Supports: OpenAI, Anthropic, AWS Bedrock, Google Vertex, Fireworks AI

4. **Set up the database**

Run the SQL scripts to set up your database:
```bash
# The scripts are in the scripts/ folder
# Script 001: Core schema (profiles, projects, recordings, scripts)
# Script 002: Collaboration features (workspaces, members, comments)
```

You can run these directly in the Supabase SQL editor or they will run automatically when you first start the application.

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Installing the Browser Extension

1. Navigate to `chrome://extensions/` in Chrome
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. The Clueso Clone icon will appear in your toolbar

## Project Structure

```
clueso-clone/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── projects/           # Project CRUD operations
│   │   ├── recordings/         # Video upload handling
│   │   ├── upload/             # Vercel Blob upload
│   │   ├── delete/             # File deletion
│   │   ├── ai/                 # AI features
│   │   │   ├── generate-script/
│   │   │   ├── improve-script/
│   │   │   ├── generate-voiceover/
│   │   │   └── translate/
│   │   ├── video/              # Video processing
│   │   │   ├── process/
│   │   │   └── extract-metadata/
│   │   ├── workspaces/         # Team workspaces
│   │   └── comments/           # Comment system
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── sign-up/
│   ├── dashboard/               # Main dashboard
│   └── editor/[projectId]/     # Video editor
├── components/                   # React components
│   ├── dashboard/              # Dashboard components
│   ├── editor/                 # Editor components
│   └── ui/                     # shadcn/ui components
├── extension/                    # Chrome extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   └── content.js
├── lib/                         # Utilities
│   ├── supabase/               # Supabase clients
│   └── actions/                # Server actions
├── scripts/                     # Database scripts
│   ├── 001_create_schema.sql
│   └── 002_add_collaboration.sql
├── ARCHITECTURE.md              # Technical architecture docs
├── FEATURE_CHECKLIST.md         # Feature comparison
└── README.md
```

## Database Schema

### profiles
- `id` (uuid, primary key)
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `created_at` (timestamp)

### projects
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `title` (text)
- `description` (text)
- `status` (text: draft, processing, completed)
- `thumbnail_url` (text)
- `duration` (integer)
- `created_at` (timestamp)

### recordings
- `id` (uuid, primary key)
- `project_id` (uuid, foreign key)
- `video_url` (text)
- `duration` (integer)
- `thumbnail_url` (text)
- `status` (text)
- `created_at` (timestamp)

### scripts
- `id` (uuid, primary key)
- `project_id` (uuid, foreign key)
- `content` (text)
- `version` (integer)
- `language` (text, default: 'en')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### workspaces
- `id` (uuid, primary key)
- `name` (text)
- `owner_id` (uuid, foreign key)
- `created_at` (timestamp)

### workspace_members
- `id` (uuid, primary key)
- `workspace_id` (uuid, foreign key)
- `user_id` (uuid, foreign key)
- `role` (text: owner, admin, member)
- `created_at` (timestamp)

### comments
- `id` (uuid, primary key)
- `project_id` (uuid, foreign key)
- `user_id` (uuid, foreign key)
- `content` (text)
- `parent_id` (uuid, nullable - for nested comments)
- `created_at` (timestamp)

All tables have Row Level Security enabled with policies that ensure users can only access their own data.

## API Documentation

### Projects

**GET /api/projects**
- Returns all projects for authenticated user
- Response: `{ projects: Project[] }`

**POST /api/projects**
- Creates a new project
- Body: `{ title: string, description?: string }`
- Response: `{ project: Project }`

**GET /api/projects/[projectId]**
- Returns project with recordings and scripts
- Response: `{ project: Project }`

**PATCH /api/projects/[projectId]**
- Updates project
- Body: `{ title?, description?, status? }`
- Response: `{ project: Project }`

**DELETE /api/projects/[projectId]**
- Deletes project
- Response: `{ success: true }`

### Recordings

**POST /api/recordings**
- Uploads video recording
- Body: `{ project_id, video_url, duration, thumbnail_url }`
- Response: `{ recording: Recording }`

### File Upload

**POST /api/upload**
- Uploads video file to Vercel Blob
- Body: FormData with video file
- Response: `{ url: string, pathname: string, contentType: string }`

**POST /api/delete**
- Deletes file from Vercel Blob
- Body: `{ url: string }`
- Response: `{ success: true }`

### AI Features

**POST /api/ai/generate-script**
- Generates AI script for project using GPT-4
- Body: `{ projectId: string, title: string, description: string, duration: number }`
- Response: `{ script: string }` (streaming)

**POST /api/ai/improve-script**
- Improves existing script with AI
- Body: `{ script: string, improvements: string }`
- Response: `{ improvedScript: string }` (streaming)

**POST /api/ai/generate-voiceover**
- Generates AI voiceover audio
- Body: `{ script: string, voice: string }`
- Response: `{ audioUrl: string }`

**POST /api/ai/translate**
- Translates script to another language
- Body: `{ script: string, targetLanguage: string }`
- Response: `{ translatedScript: string, language: string }`

### Video Processing

**POST /api/video/process**
- Processes video with effects
- Body: `{ videoUrl: string, effects: Effect[] }`
- Response: `{ processedVideoUrl: string }`

**POST /api/video/extract-metadata**
- Extracts video metadata
- Body: `{ videoUrl: string }`
- Response: `{ duration: number, width: number, height: number, format: string }`

### Workspaces

**GET /api/workspaces**
- Returns user's workspaces
- Response: `{ workspaces: Workspace[] }`

**POST /api/workspaces**
- Creates new workspace
- Body: `{ name: string }`
- Response: `{ workspace: Workspace }`

### Comments

**GET /api/comments?projectId=xxx**
- Returns comments for project
- Response: `{ comments: Comment[] }`

**POST /api/comments**
- Creates new comment
- Body: `{ projectId: string, content: string, parentId?: string }`
- Response: `{ comment: Comment }`

## Design Decisions

### Authentication
- Chose Supabase Auth for robust authentication with minimal setup
- Implemented RLS for security at the database level
- Used server-side Supabase client for secure API operations

### Video Storage
- Vercel Blob for scalable, CDN-backed storage
- Client-side uploads with secure tokens
- Automatic metadata extraction from videos
- Thumbnail generation on upload
- Efficient file management with deletion API

### AI Features
- Integrated Vercel AI SDK for production-ready AI capabilities
- Using GPT-4 via Vercel AI Gateway (zero-config, automatic)
- Streaming responses for better UX
- Prompt engineering optimized for video script generation
- Multi-language translation support (9 languages)

## Known Limitations

1. **Video Processing**: 
   - Metadata extraction implemented
   - Full video processing (trimming, transitions) requires additional libraries
   - Thumbnail generation ready for implementation

2. **Browser Extension**: 
   - Chrome only (could expand to Firefox, Edge)
   - Requires manual installation
   - Not published to Chrome Web Store

3. **Advanced Features**:
   - Real-time collaboration needs WebSocket implementation
   - Advanced analytics require tracking setup
   - Mobile apps not included

## Future Enhancements

- Real-time collaboration with WebSockets
- Advanced video editing (trimming, transitions, text overlays)
- Multi-browser extension support (Firefox, Edge)
- Mobile applications (iOS, Android)
- Advanced analytics and usage tracking
- Export in multiple formats and resolutions
- Integration with other tools (Slack, Notion, etc.)
- Custom branding and white-labeling

## Testing

Run the application locally and test:

1. **Authentication Flow**
   - Sign up new user
   - Login existing user
   - Protected route access

2. **Project Management**
   - Create new project
   - View project list
   - Delete project

3. **Browser Extension**
   - Install extension
   - Start recording
   - Upload recording

4. **Video Editor**
   - Open project in editor
   - Use AI features panel
   - Navigate timeline

5. **Team Collaboration**
   - Create workspace
   - Invite team members
   - Manage project sharing
   - Leave comments

## Contributing

This is a demonstration project for evaluation purposes. For production use, additional security hardening, error handling, and feature implementation would be required.

## License

This project is created for evaluation purposes as part of a technical assignment.

## Contact

For questions or issues, please reach out via the repository.
