# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weight Tracker is a single-page web application for tracking weight progress toward specific goals. The app uses a custom authentication system (not Supabase Auth) and provides real-time data synchronization with animated visualizations.

**Key Features:**
- Goal management with d-day countdown tracking  
- Weight entry CRUD with memo support
- Animated line graphs with moving averages
- Monthly paginated data table
- Progress tracking with streak counters
- Real-time sync via 5-second polling
- Responsive design (mobile/tablet/desktop)

## Tech Stack & Architecture

- **Framework:** Next.js 15+ with App Router
- **UI Library:** Shadcn UI (neutral color scheme)
- **Styling:** Tailwind CSS v4 with CSS variables
- **Database:** Supabase (database only, custom auth)
- **Authentication:** Custom JWT with httpOnly cookies
- **Icons:** Lucide React
- **Charts:** Recharts (to be added)
- **State Management:** React Context + hooks

### Project Structure
```
app/                 # Next.js App Router pages
components/          # Reusable UI components  
lib/                 # Utilities (cn function for class merging)
types/               # TypeScript type definitions
utils/               # Helper functions
```

## Development Commands

```bash
# Development
npm run dev          # Start development server (runs on port 3003)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler checks
```

**Note:** Local development server runs on port 3003 to avoid conflicts.

## Database Schema (Supabase)

The app uses three main tables:
- `users` - Custom auth with username/password_hash
- `goals` - Weight targets with deadlines (one active per user)
- `weight_entries` - Daily weight logs with optional memos

Multiple weight entries per day are allowed and automatically averaged.

## Key Implementation Notes

### Authentication Flow
- Custom JWT implementation (not Supabase Auth)
- Passwords hashed and stored in Supabase users table
- Session tokens in httpOnly cookies with refresh mechanism
- Cross-device synchronization support

### Data Patterns
- All weights displayed in kg with 2 decimal places
- Times in 12-hour format
- Color coding: green for decreases, red for increases
- Missing data points handled by connecting existing points
- Moving averages configurable from 2-14 days (default: 7)

### UI/UX Conventions  
- Slide-in panels for modals (not centered overlays)
- Inline editing via double-click, save with Enter key
- Loading skeletons during data fetch
- Toast notifications for user actions
- Empty state illustrations when no data

### Real-time Sync
- 5-second polling interval (no WebSockets)
- Manual refresh button available
- Conflict resolution: most recent edit wins
- Updates animate without page reloads

## MCP Server Integration

This project leverages MCP (Model Context Protocol) servers for enhanced development capabilities:

### Supabase MCP Server
**Project ID:** `nweuajfgesalluorpygq`
**Database URL:** `https://nweuajfgesalluorpygq.supabase.co`

Available functions:
- `mcp__supabase__list_projects` - List all Supabase projects
- `mcp__supabase__get_project` - Get project details and status
- `mcp__supabase__create_project` - Create new projects (with cost confirmation)
- `mcp__supabase__list_tables` - View database schema
- `mcp__supabase__execute_sql` - Run SQL queries for data operations
- `mcp__supabase__apply_migration` - Apply DDL changes and migrations
- `mcp__supabase__get_logs` - Debug with service logs (api, postgres, auth, etc.)
- `mcp__supabase__generate_typescript_types` - Generate type definitions from schema

**Best Practices:**
- Use `apply_migration` for schema changes (DDL)
- Use `execute_sql` for data operations (DML) 
- Always check `get_logs` when debugging issues
- Generate TypeScript types after schema changes

### Shadcn MCP Server
Access to Shadcn UI component library and documentation:

- `mcp__shadcn__getComponents` - List all available components
- `mcp__shadcn__getComponent` - Get specific component documentation and code

**Usage:** Prefer using MCP server over manual `npx shadcn add` commands for better integration.

## Shadcn UI Configuration

Components configured with:
- Base color: neutral
- CSS variables enabled
- Path aliases: `@/components`, `@/lib/utils`

Add components via MCP server: `mcp__shadcn__getComponent [component-name]`
Or manually: `npx shadcn@latest add [component-name]`

## User Stories Reference

The PRD.md contains 47 indexed user stories (US-1.1 through US-8.5) organized into 8 epics. Use these for feature tracking and implementation guidance.

## Development Best Practices

### Pre-Commit Workflow
Always run these commands before committing to ensure error-free code:
```bash
npm run build        # Verify production build works
npm run typecheck    # Check TypeScript compilation
npm run lint         # Fix linting issues
```

### Testing Strategy
Write tests for each implementation step:
- Unit tests for utility functions (`lib/` and `utils/`)
- Integration tests for API routes (`app/api/`)
- Component tests for UI interactions
- End-to-end tests for complete user workflows

Test files should follow the pattern: `[filename].test.ts` or `[filename].spec.tsx`

### Code Quality Standards
- Follow existing patterns established in the codebase
- Use TypeScript strictly - no `any` types without justification
- Leverage Shadcn UI components before creating custom ones
- Maintain responsive design across all breakpoints
- Use the `cn()` utility for conditional class names
- Follow the established folder structure and naming conventions

### Commit Strategy & Modularity

#### Logical Commit Grouping
Structure commits to create modular versioning that aligns with user stories:

**Foundation Commits:**
- 🎉 Project setup and configuration
- 🔧 Environment and tooling setup
- 🗃️ Database schema and migrations

**Feature Commits (by Epic):**
- ✨ Authentication system (US-1.x)
- ✨ Goal management (US-2.x) 
- ✨ Weight data CRUD (US-3.x)
- ✨ Data visualization (US-4.x)
- ✨ Data table display (US-5.x)
- ✨ Progress tracking (US-6.x)
- 💄 UI/UX features (US-7.x)
- ⚡ Real-time sync (US-8.x)

**Maintenance Commits:**
- 🐛 Bug fixes with specific issue references
- ♻️ Refactoring for code quality
- 📝 Documentation updates
- ⬆️ Dependency updates

#### Commit Message Format
```
<gitmoji> <type>: <description>

<optional body explaining what and why>

Implements: US-X.X, US-X.X (reference user stories)
Fixes: #issue-number (if applicable)

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Gitmoji Reference for Weight Tracker

Common gitmoji for this project:
- 🎉 `:tada:` - Initial commits, major milestones
- ✨ `:sparkles:` - New features and user stories
- 🔧 `:wrench:` - Configuration files, environment setup
- 🐛 `:bug:` - Bug fixes
- 💄 `:lipstick:` - UI/styling, responsive design
- 🗃️ `:card_file_box:` - Database schema, migrations
- ⚡ `:zap:` - Performance improvements, optimizations
- ♻️ `:recycle:` - Code refactoring
- 🔒 `:lock:` - Authentication, security fixes
- 📱 `:iphone:` - Mobile responsive improvements
- 📊 `:bar_chart:` - Charts, data visualization
- 🧪 `:test_tube:` - Adding or updating tests
- 📝 `:memo:` - Documentation updates

### Pattern Following
- **API Routes**: Follow REST conventions in `app/api/`
- **Components**: Use composition over inheritance
- **State Management**: Context for global state, local state for component-specific data  
- **Error Handling**: Consistent error boundaries and user feedback
- **Loading States**: Always provide loading skeletons/indicators
- **Form Validation**: Client-side validation with server-side verification

### MCP Server Best Practices

**Development Workflow:**
1. Use MCP servers for database operations instead of direct SQL
2. Check Supabase logs when debugging API issues
3. Use Shadcn MCP server to discover and implement components
4. Generate TypeScript types after any schema changes
5. Leverage MCP server functions for faster development iteration

**Database Operations Priority:**
1. **Schema changes**: Use `mcp__supabase__apply_migration`
2. **Data queries**: Use `mcp__supabase__execute_sql`  
3. **Debugging**: Use `mcp__supabase__get_logs` with service filters
4. **Type safety**: Use `mcp__supabase__generate_typescript_types`

**Component Development:**
1. Check `mcp__shadcn__getComponents` for available options
2. Use `mcp__shadcn__getComponent` for implementation guidance
3. Follow established component patterns in the codebase
4. Maintain consistency with existing Shadcn configuration

## Quick Visual Check

IMMEDIATELY after implementing any front-end change:

1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against our existing design patterns and UX best practices
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.