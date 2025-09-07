# Weight Tracker PRD ⚖️
*Product Requirements Document*

## Executive Summary
Weight Tracker is a single-page web application that helps users track their weight progress toward specific goals. Built with Next.js, Shadcn UI, and Supabase backend, it provides real-time data synchronization, animated visualizations, and comprehensive progress tracking.

## Product Overview
- **Name:** Weight Tracker ⚖️  
- **Tagline:** "Track progress, reach your goals"  
- **Type:** Single-page responsive web application  
- **Tech Stack:** Next.js, Shadcn UI, Supabase (database only), Custom Auth
- **Target Users:** Individuals tracking weight loss/gain goals
- **Core Value:** Simple, visual weight tracking with goal-oriented progress monitoring

## Feature Specifications

### Authentication & Session Management
- Custom JWT authentication (no Supabase Auth)
- Username/password signup and login
- Hashed passwords stored in Supabase table
- JWT tokens in httpOnly cookies with refresh tokens
- Cross-device data synchronization
- Session persistence across page refreshes

### Goal Management System
- Single active goal per user (weight target + deadline)
- D-day countdown tracker showing days remaining until deadline
- Real-time calculation of required daily/weekly/monthly progress
- Goal modification capability (weight and deadline changes)
- Goal history tracking with deletion capability
- Sequential goal setting after deadline completion
- No goal achievement tracking (simplified approach)

### Weight Data Management
- Multiple daily entries averaged automatically
- CRUD operations via slide-in modals
- Optional memo field for entries
- Inline editing (double-click to edit, Enter to save)
- Hard delete for removed entries
- Weight entry allowed without active goals
- All weights in kilograms (2 decimal places)

### Data Visualization
- Animated line graph with gradient fill
- Time view options: days, weeks, months, years (default: last 30 days)
- Configurable moving average (2-14 days, default: 7 days)
- Interactive hover tooltips with delta calculations
- Color-coded changes (green: decrease, red: increase)
- Fixed graph height with responsive width
- Animation: fade in + left-to-right line drawing
- Animate on data updates (no page reloads)
- Skip missing data points with connected lines

### Data Table & Display
- Monthly pagination with navigation
- Month headers showing weekly averages
- Responsive column layout:
  - **Desktop/Tablet:** Month, Date, Weight, Daily Change %, Moving Avg Change %, Remaining to Goal, Memo
  - **Mobile:** Date, Weight, Moving Avg Change %
- Color coding for percentage changes
- Positive goal achievement with emoji indicators
- Truncated memo display (click for full view)
- Show only dates with weight entries
- 12-hour time format

### Progress Tracking
- Logging streak counter (24-hour reset from last entry)
- Minimal streak display near goal section
- Visual banner reminder for missing daily entries
- Best/worst day display for current month (with memo)

### UI/UX Features
- Light/dark mode toggle
- Mobile-first responsive design (3 breakpoints)
- Loading skeletons during data fetch
- Empty state illustrations
- Toast notifications for actions
- Slide-in panels for modals
- App header with name, emoji, and tagline
- Sync status indicator with last updated timestamp

### Real-time Synchronization
- 5-second polling interval
- Manual refresh button
- Conflict resolution: most recent edit wins
- Cross-device data updates
- No page reloads during sync

## User Stories by Epic

### Epic 1: Authentication & User Management
- **US-1.1:** As a user, I can sign up with username and password
- **US-1.2:** As a user, I can log in with my credentials
- **US-1.3:** As a user, I can log out from any device
- **US-1.4:** As a user, my session persists across page refreshes (JWT in httpOnly cookies)
- **US-1.5:** As a user, I can access my data from multiple devices

### Epic 2: Goal Management
- **US-2.1:** As a user, I can set a weight goal with target weight and deadline
- **US-2.2:** As a user, I can see my current goal prominently at the top of the page
- **US-2.3:** As a user, I can see daily/weekly/monthly weight loss required to meet my goal
- **US-2.4:** As a user, I can update my current goal (weight and/or deadline)
- **US-2.5:** As a user, I can view my goal history in a slide-in panel
- **US-2.6:** As a user, I can delete goals from history
- **US-2.7:** As a user, I can have only one active goal at a time
- **US-2.8:** As a user, I can see best/worst day of current month with memo
- **US-2.9:** As a user, I can see a d-day countdown showing days remaining until my goal deadline

### Epic 3: Weight Data Management
- **US-3.1:** As a user, I can add weight entries via slide-in modal
- **US-3.2:** As a user, I can add multiple weight entries per day (averaged)
- **US-3.3:** As a user, I can edit weight entries
- **US-3.4:** As a user, I can delete weight entries (hard delete)
- **US-3.5:** As a user, I can add optional memos to entries
- **US-3.6:** As a user, I can inline-edit weight and memo via double-click
- **US-3.7:** As a user, I can save inline edits with Enter key
- **US-3.8:** As a user, I can enter weights without having a goal set

### Epic 4: Data Visualization
- **US-4.1:** As a user, I can see a line graph of my weight trend
- **US-4.2:** As a user, I can toggle graph views (days/weeks/months/years)
- **US-4.3:** As a user, I can see gradient fill below the weight line
- **US-4.4:** As a user, I can see moving average line (2-14 days, default 7)
- **US-4.5:** As a user, I can hover to see date, weight, and delta with color coding
- **US-4.6:** As a user, I see animated graph lines (fade in + left-to-right draw)
- **US-4.7:** As a user, I see graph updates animate when data changes
- **US-4.8:** As a user, I see connected lines skipping missing data points
- **US-4.9:** As a user, graph has fixed height with default 30-day view

### Epic 5: Data Table
- **US-5.1:** As a user, I can see weight entries in a monthly paginated table
- **US-5.2:** As a user, I can see columns: Month, Date, Weight, Daily Change %, Moving Avg Change %, Remaining to Goal, Memo
- **US-5.3:** As a user, I see decreases in green and increases in red
- **US-5.4:** As a user, I see positive achievement with emoji when goal exceeded
- **US-5.5:** As a user, I see truncated memos with full view on click
- **US-5.6:** As a user, I see month headers with weekly average
- **US-5.7:** As a user, I see only dates with weight entries (no empty rows)
- **US-5.8:** As a user on mobile, I see only Date, Weight, Moving Avg Change %

### Epic 6: Progress Tracking
- **US-6.1:** As a user, I can see my current logging streak
- **US-6.2:** As a user, streak resets 24 hours after last entry
- **US-6.3:** As a user, I see a banner reminder if no entry today
- **US-6.4:** As a user, streak display appears minimally near goal

### Epic 7: UI/UX Features
- **US-7.1:** As a user, I can toggle between light and dark mode
- **US-7.2:** As a user, I see responsive layouts for mobile/tablet/desktop
- **US-7.3:** As a user, I see loading skeletons while data fetches
- **US-7.4:** As a user, I see empty state illustrations when no data
- **US-7.5:** As a user, I see toast notifications for actions
- **US-7.6:** As a user, I see app header with name and emoji
- **US-7.7:** As a user, I see layout order: Goals → Graph → Table
- **US-7.8:** As a user, all weights display in kg with 2 decimal places
- **US-7.9:** As a user, times display in 12-hour format

### Epic 8: Data Synchronization
- **US-8.1:** As a user, changes from other devices appear within 5 seconds
- **US-8.2:** As a user, I can manually refresh with a button
- **US-8.3:** As a user, I see sync status indicator with last updated time
- **US-8.4:** As a user, conflicts resolve using most recent edit
- **US-8.5:** As a user, polling doesn't cause page reloads

## Technical Architecture

### Database Schema (Supabase)
```sql
-- Users table
users (
  id: uuid PRIMARY KEY,
  username: varchar UNIQUE NOT NULL,
  password_hash: varchar NOT NULL,
  created_at: timestamp DEFAULT now(),
  updated_at: timestamp DEFAULT now()
)

-- Goals table
goals (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  target_weight: decimal(5,2) NOT NULL,
  deadline: date NOT NULL,
  is_active: boolean DEFAULT true,
  created_at: timestamp DEFAULT now(),
  updated_at: timestamp DEFAULT now()
)

-- Weight entries table
weight_entries (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  date: date NOT NULL,
  weight: decimal(5,2) NOT NULL,
  memo: text,
  created_at: timestamp DEFAULT now(),
  updated_at: timestamp DEFAULT now(),
  UNIQUE(user_id, date, created_at) -- Allow multiple entries per day
)
```

### Frontend Architecture
- **Framework:** Next.js 14+ with App Router
- **UI Library:** Shadcn UI components
- **Styling:** Tailwind CSS
- **Charts:** Recharts or similar for animated graphs
- **State Management:** React Context + useState/useReducer
- **Data Fetching:** Native fetch with SWR or React Query
- **Authentication:** JWT with httpOnly cookies

### API Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication  
- `POST /api/auth/logout` - Session termination
- `GET /api/goals` - Fetch user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/weights` - Fetch weight entries
- `POST /api/weights` - Create weight entry
- `PUT /api/weights/:id` - Update weight entry
- `DELETE /api/weights/:id` - Delete weight entry

## Implementation Priorities

### Phase 1: Foundation (MVP)
- US-1.1 to US-1.5: Authentication system
- US-2.1 to US-2.4, US-2.9: Basic goal management with d-day tracker
- US-3.1 to US-3.4: Weight entry CRUD
- US-4.1, US-4.2: Basic graph visualization
- US-5.1 to US-5.3: Data table
- US-7.6, US-7.7: Basic layout

### Phase 2: Enhanced Features
- US-4.3 to US-4.9: Advanced graph features
- US-5.4 to US-5.8: Enhanced table features
- US-6.1 to US-6.4: Progress tracking
- US-7.1 to US-7.5: UI polish
- US-3.5 to US-3.8: Advanced weight management

### Phase 3: Polish & Optimization
- US-2.5 to US-2.8: Goal history and insights
- US-8.1 to US-8.5: Real-time synchronization
- US-7.8, US-7.9: Final UI refinements

## Responsive Breakpoints
- **Mobile:** < 768px (simplified table, stacked layout)
- **Tablet:** 768px - 1024px (condensed layout)
- **Desktop:** > 1024px (full feature layout)

## Out of Scope (Future Backlog)
- Export functionality (CSV/PDF)
- Keyboard shortcuts
- Quick-add weight widget
- Goal achievement tracking and celebrations
- Advanced data validation (weight ranges)
- Supabase Auth integration
- Real-time WebSocket connections
- Social features or sharing
- Advanced analytics or insights
- Integration with fitness devices
- Notification system
- Backup/restore functionality

## Success Metrics
- **User Engagement:** Daily active users logging weight consistently
- **Goal Achievement:** Users successfully tracking toward their goals
- **Technical Performance:** < 2s page load time, 99.9% uptime
- **User Experience:** Intuitive interface with minimal learning curve
- **Data Integrity:** Reliable synchronization across devices
- **Mobile Usage:** Responsive design working seamlessly on all devices

## Constraints & Assumptions
- Single-user focused (no multi-user sharing)
- Metric system only (kilograms)
- English language only
- Modern browser support (ES6+)
- Requires internet connection for sync
- No offline functionality required
- Data retention: unlimited historical data

---
*This PRD serves as the single source of truth for Weight Tracker development. All features should be implemented according to these specifications and tracked against the indexed user stories.*