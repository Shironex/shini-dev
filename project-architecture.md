# Shini Dev - Architecture Documentation

## Overview
Shini Dev is a v0.dev-inspired AI-powered code generation platform built with Next.js, tRPC, and E2B sandboxes. The application allows users to generate, preview, and iterate on web applications through natural language prompts.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.3 (App Router)
- **UI Library**: Shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Query (via tRPC)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Code Highlighting**: Prism.js

### Backend
- **API Layer**: tRPC v11
- **Database**: PostgreSQL with Prisma ORM
- **Background Jobs**: Inngest
- **AI Integration**: OpenAI GPT-4
- **Code Execution**: E2B Sandboxes
- **Runtime**: Node.js

### Infrastructure
- **Container**: Docker (PostgreSQL)
- **Package Manager**: pnpm
- **Monorepo Tool**: Turborepo

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Next.js App Router                 │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │    │
│  │  │   Pages     │  │  Components  │  │  Modules  │  │    │
│  │  │  - Home     │  │ - MessageCard│  │ - Projects│  │    │
│  │  │  - Project  │  │ - FileExplor │  │ - Messages│  │    │
│  │  └─────────────┘  └──────────────┘  └───────────┘  │    │
│  │                                                      │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │              tRPC Client                     │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP/WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    tRPC Server                       │    │
│  │  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │   Projects   │  │   Messages   │                │    │
│  │  │   Router     │  │   Router     │                │    │
│  │  └──────────────┘  └──────────────┘                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Inngest Functions                    │    │
│  │  ┌────────────────────────────────────────────┐     │    │
│  │  │            Code Agent Function              │     │    │
│  │  └────────────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                               │
                               │
┌─────────────────────┐        │        ┌─────────────────────┐
│                     │        │        │                     │
│   PostgreSQL DB     │◄───────┴───────►│   E2B Sandboxes    │
│                     │                 │                     │
│  ┌───────────────┐  │                 │  ┌───────────────┐ │
│  │   Projects    │  │                 │  │  Next.js App  │ │
│  │   Messages    │  │                 │  │   Execution   │ │
│  │   Fragments   │  │                 │  │  Environment  │ │
│  └───────────────┘  │                 │  └───────────────┘ │
└─────────────────────┘                 └─────────────────────┘
```

## Core Components

### 1. Database Schema

```prisma
Project
├── id (UUID)
├── name (String)
├── messages (Message[])
├── createdAt
└── updatedAt

Message
├── id (UUID)
├── content (String)
├── role (USER | ASSISTANT)
├── type (RESULT | ERROR)
├── fragment (Fragment?)
├── project (Project)
└── timestamps

Fragment
├── id (UUID)
├── title (String)
├── summary (String?)
├── files (JSON)
├── sandboxUrl (String?)
├── message (Message)
└── timestamps
```

### 2. API Structure (tRPC)

```typescript
appRouter
├── projects
│   ├── getOne
│   ├── getMany
│   └── create
└── messages
    ├── getMany
    └── create
```

### 3. Key Workflows

#### Code Generation Flow
1. User submits prompt → Creates USER message
2. Message triggers Inngest function via event
3. Inngest function:
   - Creates E2B sandbox
   - Sends prompt to AI (GPT-4)
   - AI generates code using specialized tools
   - Code is written to sandbox filesystem
   - Sandbox URL is generated
4. Results stored as ASSISTANT message with Fragment
5. UI updates with preview and file explorer

#### File Management
- Files stored as JSON in Fragment.files
- Each file has path and content
- Preview renders files from this JSON structure
- Syntax highlighting applied based on file extension

### 4. State Management

```
Client State (React Query)
├── Project Data
├── Messages List
├── Active Fragment
└── UI State (panels, tabs)

Server State (Database)
├── Projects
├── Messages
└── Fragments
```

## Security Considerations

1. **Sandbox Isolation**: E2B provides isolated execution environments
2. **Input Validation**: tRPC with Zod schemas for type safety
3. **Database Access**: Prisma ORM prevents SQL injection
4. **API Security**: Server-side validation on all endpoints

## Performance Optimizations

### Current
- Suspense boundaries for async data loading
- Optimistic updates via React Query
- Code splitting at route level
- Tailwind CSS purging unused styles

### Planned
- Virtual scrolling for message lists
- Lazy loading for file explorer
- CDN for static assets
- Redis caching for frequently accessed data

## Deployment Architecture

```
Production Environment
├── Vercel (Next.js App)
├── PostgreSQL (Database)
├── E2B Cloud (Sandboxes)
└── Inngest Cloud (Background Jobs)
```

## Development Workflow

1. **Local Development**
   ```bash
   pnpm dev          # Start Next.js
   pnpm dev:inngest  # Start Inngest dev server
   docker-compose up # Start PostgreSQL
   ```

2. **Database Migrations**
   ```bash
   prisma migrate dev
   prisma generate
   ```

3. **Testing Strategy**
   - Unit tests for utilities
   - Integration tests for API routes
   - E2E tests for critical user flows

## Monitoring & Observability

### Current
- Console logging for debugging
- Prisma query logging

### Planned
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API metrics

## Scaling Considerations

1. **Horizontal Scaling**
   - Stateless Next.js app can scale horizontally
   - Database connection pooling via Prisma
   - Background jobs distributed via Inngest

2. **Vertical Scaling**
   - Sandbox resource limits
   - Database query optimization
   - Caching strategy for AI responses

## Future Architecture Enhancements

1. **Microservices Split**
   - Separate AI service
   - Dedicated sandbox orchestrator
   - File storage service

2. **Real-time Features**
   - WebSocket for live updates
   - Collaborative editing
   - Streaming AI responses

3. **Multi-tenancy**
   - Organization support
   - Role-based access control
   - Resource quotas