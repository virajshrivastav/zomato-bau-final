# 🚀 Zomato Drive Dashboard

**Status:** ✅ Sprint 2 Complete | 🎯 Ready for Sprint 3
**Purpose:** Unified dashboard for managing restaurant partnership drives

---

## ⭐ START HERE

### 📊 Current Status
**👉 [PROJECT-STATUS.md](PROJECT-STATUS.md)** - Complete project status and next steps

### 🎉 Sprint 2 Complete!
**👉 [SPRINT-2-COMPLETION-SUMMARY.md](SPRINT-2-COMPLETION-SUMMARY.md)** - All 6,610 restaurants imported successfully!

### 📚 Documentation
**👉 [DOCS-INDEX.md](DOCS-INDEX.md)** - Complete guide to all documentation

**Essential Docs:**
- **[NEW-THREAD-CONTEXT.md](NEW-THREAD-CONTEXT.md)** - Quick context for new threads
- **[PROJECT-STATUS.md](PROJECT-STATUS.md)** - What's done, what's next
- **[AUTOMATIC-EXECUTION-GUIDE.md](AUTOMATIC-EXECUTION-GUIDE.md)** - How to run data imports
- **[SPRINT-2-COMPLETION-SUMMARY.md](SPRINT-2-COMPLETION-SUMMARY.md)** - Sprint 2 results

---

## 🎯 What This Project Does

**Problem:** KAMs manage 5-10 Google Sheets with 50+ columns each → inefficient, error-prone, no visibility

**Solution:** One dashboard where KAMs can:
- View all their restaurants from Google Sheets in one place
- Track which restaurants are in multiple drives
- Mark restaurants as "Approached" or "Converted" with one click
- See conversion rates and analytics
- Navigate Google Sheets data with better UX

**Data Source:** Google Sheets (remains source of truth)

**Users:**
- **KAMs** (Primary) - Manage 200+ restaurants daily
- **Zonal Heads** (Secondary) - Monitor team performance
- **Central Ops** (Tertiary) - Strategic analysis

---

## 🎯 Application Flow

The application follows this user journey:

1. **Auth Page (/)** - Login and authentication
   - **Google OAuth sign-in** (primary method)
   - Email/password sign-in (fallback)
   - Sign Up tab for new accounts
   - Manager Access Code feature
   - Development mode indicator
   - Domain restriction (@zomato.com in production)
   - Navigates to /dashboard on successful login

2. **Main Dashboard (/dashboard)** - Central hub with high-level metrics
   - Top Grid (4 columns): Current/Live Drives, City View, Zone View, KAM View
   - **Restaurant Portfolio Section** - Prominent CTA card to access restaurant management
   - Bottom Grid: Past Drives, Upcoming Drives, Performance Metrics
   - Navigation options:
     - "View all KAMs" → Zonal Head View (KAM Performance Table)
     - "Restaurant Portfolio" card → KAM Hub (Restaurant list)
     - "View Live Sprints" → Live Sprints page
     - "Sign Out" → Auth page

3. **Restaurant Portfolio (/kam-hub)** - Restaurant management dashboard
   - Restaurant View: List of assigned restaurants with status pills
   - Drive View: Personal drive performance metrics
   - Search and filter functionality
   - Navigation paths:
     - Click restaurant → Restaurant Detail page
     - "View Full Analytics" → KAM Analytics page

4. **Restaurant Detail (/restaurant/:id)** - Detailed action page for a specific restaurant
   - Restaurant overview and information
   - Active drives tags
   - Promo management (active & suggested)
   - Task/item conversion tracking
   - Notes and comments section

5. **KAM Analytics (/kam-analytics)** - Personal performance analytics
   - Detailed breakdown by drive (N2R, NCN, MRP, ADS)
   - Data visualizations (bar charts, pie charts)
   - Performance metrics and trends

6. **Zonal Head View (/zonal-head-view)** - Manager's overview dashboard
   - KPI cards: Total KAMs, Avg Conversion Rate, Avg Approach Rate, Total Drives
   - KAM Performance Rankings Table with search and sort
   - Performance comparison across team
   - Key metrics: Drive Performance, Conversion Avg, Approach Rate
   - Export to CSV functionality

7. **Live Sprints (/live-sprints)** - Real-time competition leaderboard
   - Podium display for top performers
   - Live rankings and achievements
   - Zonal performance tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or pnpm
- Supabase account (free tier works)
- Google Cloud Console account (for OAuth)

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Authentication Setup

This application uses **Google OAuth** for authentication with domain restriction.

#### 1. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:8080` (development)
     - Your production domain (when ready)
   - Add authorized redirect URIs:
     - `http://localhost:8080/auth/callback` (development)
     - `https://[your-supabase-project].supabase.co/auth/v1/callback`
     - Your production callback URL (when ready)
5. Copy the **Client ID** and **Client Secret**

#### 2. Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to "Authentication" → "Providers"
4. Enable "Google" provider
5. Enter your Google OAuth Client ID and Client Secret
6. Copy the redirect URL shown by Supabase
7. Add this redirect URL to your Google OAuth settings

#### 3. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your-google-client-id

   # Development Mode (set to 'false' for development)
   VITE_RESTRICT_DOMAIN=false
   ```

#### 4. Development vs Production Mode

**Development Mode** (`VITE_RESTRICT_DOMAIN=false`):
- Allows test emails from whitelist
- Add your test Gmail accounts to `ALLOWED_TEST_EMAILS` in `src/contexts/AuthContext.tsx`
- Useful for local testing without @zomato.com emails

**Production Mode** (`VITE_RESTRICT_DOMAIN=true`):
- Restricts authentication to `@zomato.com` emails only
- Enforces domain validation
- Recommended for production deployment

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:8080`

**Test Credentials (Email/Password fallback):**
- Email: `shiv.kumar@zomato.com`
- Password: `zomato123`

### Build

```bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build

```bash
# Preview production build
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DashboardCard.tsx
│   ├── SearchBar.tsx
│   ├── StatusPill.tsx
│   ├── KPICard.tsx
│   └── ...
├── pages/              # Route pages
│   ├── MainDashboard.tsx
│   ├── KAMHub.tsx
│   ├── RestaurantDetail.tsx
│   ├── KAMAnalytics.tsx
│   └── ZonalHeadView.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## 🎨 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🔗 Route Structure

- `/` - Auth Page (Login/Signup)
- `/dashboard` - Main Dashboard (Screen 1)
- `/kam-hub` - Restaurant Portfolio / KAM Hub (Screen 2)
- `/restaurant/:id` - Restaurant Detail (Screen 3)
- `/kam-analytics` - KAM Analytics (Screen 4)
- `/zonal-head-view` - Zonal Head View (Screen 5)
- `/live-sprints` - Live Sprints Leaderboard

## 📚 Documentation Structure

### 🎯 Start Here (Essential)
1. **[PROJECT-STATUS.md](PROJECT-STATUS.md)** - Current status, what's done, what's next
2. **[SPRINT-2-GUIDE.md](SPRINT-2-GUIDE.md)** - Sprint 2 execution plan
3. **[IMPORTANT-NOTES.md](IMPORTANT-NOTES.md)** - Critical warnings and notes

### 📖 Technical Documentation
- **[DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md](DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md)** - Data flow architecture
- **[SYSTEM-ARCHITECTURE-DIAGRAM.md](SYSTEM-ARCHITECTURE-DIAGRAM.md)** - System design overview
- **[AUTHENTICATION_SETUP_COMPLETE.md](AUTHENTICATION_SETUP_COMPLETE.md)** - Auth setup guide

### 📊 Sprint Reports
- **[SPRINT-1-COMPLETION-REPORT.md](SPRINT-1-COMPLETION-REPORT.md)** - Sprint 1 results (100% accuracy)
- **[DRIVE-DATA-IMPLEMENTATION-PLAN.md](DRIVE-DATA-IMPLEMENTATION-PLAN.md)** - Original implementation plan

### 🔧 Setup & Configuration
- **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)** - Environment setup
- **[SUPABASE_USER_SETUP.md](SUPABASE_USER_SETUP.md)** - Database user management
- **[CLI_SETUP_GUIDE.md](CLI_SETUP_GUIDE.md)** - CLI tools setup

---

## 📝 Integration History

This project integrates 5 Lovable repositories into one cohesive application:

1. **zomato-drive-dash** → Main Dashboard (`/`)
2. **drive-kam-central** → KAM Hub (`/kam-hub`)
3. **kam-action-center** → Restaurant Detail (`/restaurant/:id`)
4. **drive-focus-view** → KAM Analytics (`/kam-analytics`)
5. **drivehub-zonal** → Zonal Head View (`/zonal-head-view`)

**Status:** ✅ All screens integrated | ✅ All components extracted | ✅ Routing configured

## 🎯 Current Status

### ✅ Sprint 1 Complete (100% Success)
- ✅ All 7 screens fully designed and navigable
- ✅ 21 custom components + 48 shadcn/ui components
- ✅ Responsive design (mobile + desktop)
- ✅ **Google OAuth authentication** with domain restriction (@zomato.com)
- ✅ Email/password authentication (fallback)
- ✅ Database with `drive_sheets_data` table (200+ columns)
- ✅ Test restaurant displaying with 100% data accuracy
- ✅ All three drive types working (NCN, N2R, Items)
- ✅ Data import pipeline established
- ✅ Frontend-backend integration complete

### 🚀 Sprint 2 Ready
**Goal:** Import all ~5,500 restaurants from CSV files

**Tasks:**
1. Create full import script
2. Import all data (NCN, N2R, Items)
3. Verify data integrity
4. Test multi-user access
5. Re-enable RLS
6. Performance optimization

**See:** [SPRINT-2-GUIDE.md](SPRINT-2-GUIDE.md) for detailed execution plan

### 📊 Future Enhancements (Sprint 3+)
- Google Sheets direct integration
- Enhanced filtering and search
- Real-time analytics calculations
- Promo/Task/Notes CRUD operations
- Export functionality

---

## 📄 License

Private - Zomato Internal Use Only

