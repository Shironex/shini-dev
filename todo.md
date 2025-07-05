# Shini Dev - Project TODO List

## ✅ Completed Features
- [x] Basic project structure with Next.js App Router
- [x] tRPC setup for API communication
- [x] Prisma integration with PostgreSQL
- [x] E2B sandbox integration for code execution
- [x] Message system with USER/ASSISTANT roles
- [x] Fragment storage for code artifacts
- [x] Basic chat UI with message form
- [x] File preview with syntax highlighting
- [x] Resizable panels for chat/preview split view
- [x] Theme switching (light/dark mode)
- [x] Inngest for background job processing
- [x] Basic error handling for failed generations

## 🚀 High Priority Features

### 1. AI Prompt Enhancement
- [ ] Replace basic prompt in `inngest/constants.ts` with enhanced v0 prompt from `prompts/v0.md`
- [ ] Adapt v0 prompt structure to work with current agent-kit implementation
- [ ] Extract MDX components logic from v0 prompt for future implementation
- [ ] Implement prompt versioning system
- [ ] Add prompt template management

### 2. Code Editor Enhancement
- [x] Implement file tree view component (currently showing "TODO: Tree view")
- [ ] Add file creation/deletion capabilities in the UI
- [ ] Implement file editing with Monaco Editor or CodeMirror
- [ ] Add file download functionality
- [ ] Support for multiple file types (not just code)

### 3. AI Integration Improvements
- [ ] Enhance prompt engineering for better code generation
- [ ] Add support for incremental code updates (like v0's QuickEdit)
- [ ] Implement code streaming for real-time generation feedback
- [ ] Add context awareness for follow-up messages
- [ ] Support for image uploads and processing
- [ ] Implement v0-style actions/suggestions after each response
- [ ] Add support for multiple AI models (GPT-4, Claude, etc.)
- [ ] Implement prompt caching to reduce token usage

### 3. Sandbox Features
- [ ] Live preview refresh on code changes
- [ ] Console output display for debugging
- [ ] Error handling and display in preview
- [ ] Support for environment variables
- [ ] Add deployment capabilities (Vercel integration)

### 4. UI/UX Enhancements
- [ ] Add loading skeletons for better perceived performance
- [ ] Implement proper error boundaries
- [ ] Add toast notifications for user actions
- [ ] Create onboarding flow for new users
- [ ] Add keyboard shortcuts (Cmd+Enter to submit, etc.)
- [ ] Implement message editing and regeneration
- [ ] Add copy code functionality with proper formatting

### 5. Project Management
- [ ] Add project templates/starters
- [ ] Implement project forking
- [ ] Add project sharing capabilities
- [ ] Version history for projects
- [ ] Export project as ZIP

## 🔧 Technical Improvements

### 1. Performance Optimization
- [ ] Implement virtual scrolling for long message lists
- [ ] Add code splitting for better initial load
- [ ] Optimize bundle size (analyze current bundle)
- [ ] Add caching strategy for generated code
- [ ] Implement lazy loading for heavy components

### 2. Database & Backend
- [ ] Add database indexes for better query performance
- [ ] Implement soft deletes for projects/messages
- [ ] Add user authentication system
- [ ] Implement rate limiting
- [ ] Add analytics tracking

### 3. Testing & Quality
- [ ] Set up unit testing framework (Jest/Vitest)
- [ ] Add E2E tests with Playwright
- [ ] Implement error tracking (Sentry)
- [ ] Add logging system
- [ ] Set up CI/CD pipeline

### 4. Security
- [ ] Implement sandbox security measures
- [ ] Add input sanitization
- [ ] Implement CSRF protection
- [ ] Add content security policy
- [ ] Secure API endpoints

## 📦 Additional Features (Nice to Have)

### 1. Collaboration
- [ ] Real-time collaboration on projects
- [ ] Comments on code sections
- [ ] Share projects with team members
- [ ] Project permissions system

### 2. AI Features
- [ ] Multiple AI model support (GPT-4, Claude, etc.)
- [ ] Custom system prompts
- [ ] Prompt templates library
- [ ] AI-powered code review

### 3. Developer Experience
- [ ] CLI tool for project scaffolding
- [ ] VS Code extension
- [ ] API for third-party integrations
- [ ] Webhook support for CI/CD

### 4. Monetization
- [ ] Usage-based pricing tiers
- [ ] Team/organization accounts
- [ ] Private project support
- [ ] Custom deployment options

## 🐛 Known Issues to Fix
- [ ] File explorer breadcrumb navigation not working
- [ ] Code highlighting performance on large files
- [ ] Message loading indicator showing incorrectly
- [ ] Sandbox URL might expire - need refresh mechanism
- [ ] Error messages not user-friendly

## 📝 Documentation Needs
- [ ] API documentation
- [ ] Component documentation
- [ ] Deployment guide
- [ ] Contributing guidelines
- [ ] Architecture documentation