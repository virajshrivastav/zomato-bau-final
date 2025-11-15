# 📚 Documentation Index

**Last Updated:** 2025-11-15  
**Purpose:** Complete guide to all project documentation

---

## 🎯 Quick Navigation

### New to the Project?
1. Start with **[README.md](README.md)** - Project overview
2. Read **[PROJECT-STATUS.md](PROJECT-STATUS.md)** - Current status
3. Check **[IMPORTANT-NOTES.md](IMPORTANT-NOTES.md)** - Critical warnings

### Ready to Work?
- **Sprint 2:** See **[SPRINT-2-GUIDE.md](SPRINT-2-GUIDE.md)**
- **Setup:** See **Setup & Configuration** section below
- **Architecture:** See **Technical Documentation** section below

---

## 📁 Documentation Structure

### 🌟 Essential (Read First)
| File | Purpose | When to Read |
|------|---------|--------------|
| [README.md](README.md) | Project overview, tech stack, getting started | First time setup |
| [PROJECT-STATUS.md](PROJECT-STATUS.md) | Current status, what's done, what's next | Before starting work |
| [SPRINT-2-GUIDE.md](SPRINT-2-GUIDE.md) | Sprint 2 execution plan | Starting Sprint 2 |
| [IMPORTANT-NOTES.md](IMPORTANT-NOTES.md) | Critical warnings, known issues | Before making changes |

---

### 🏗️ Technical Documentation
| File | Purpose | When to Read |
|------|---------|--------------|
| [DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md](DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md) | Data flow architecture | Understanding data flow |
| [SYSTEM-ARCHITECTURE-DIAGRAM.md](SYSTEM-ARCHITECTURE-DIAGRAM.md) | System design overview | Understanding architecture |
| [DRIVE-DATA-IMPLEMENTATION-PLAN.md](DRIVE-DATA-IMPLEMENTATION-PLAN.md) | Original implementation strategy | Understanding design decisions |

---

### 🔧 Setup & Configuration
| File | Purpose | When to Read |
|------|---------|--------------|
| [AUTHENTICATION_SETUP_COMPLETE.md](AUTHENTICATION_SETUP_COMPLETE.md) | Google OAuth setup guide | Setting up authentication |
| [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) | Environment configuration | Initial setup |
| [SUPABASE_USER_SETUP.md](SUPABASE_USER_SETUP.md) | Database user management | Adding test users |
| [CLI_SETUP_GUIDE.md](CLI_SETUP_GUIDE.md) | CLI tools setup | Using scripts |
| [SETUP.md](SETUP.md) | General setup instructions | Initial project setup |

---

### 📊 Sprint Reports
| File | Purpose | Status |
|------|---------|--------|
| [SPRINT-1-COMPLETION-REPORT.md](SPRINT-1-COMPLETION-REPORT.md) | Sprint 1 results and metrics | ✅ Complete |
| Sprint 2 Completion Report | Sprint 2 results | ⏳ Pending |

---

### 🗄️ Database & Scripts
| File | Purpose | Location |
|------|---------|----------|
| `drive_sheets_data_schema.sql` | Main table schema | `supabase/` |
| `PROPER_RLS_POLICY.sql` | RLS policy for production | Root |
| `QUICK_FIX_RLS.sql` | Disable RLS (testing) | Root |
| `debug_rls_policy.sql` | RLS debugging | Root |
| `fix_rls_policy.sql` | RLS fixes | Root |
| `supabase-setup.sql` | Original database setup | Root |
| `insert_test_restaurant.sql` | Test data insert | Root |

---

### 🔨 Scripts
| File | Purpose | Location |
|------|---------|----------|
| `import_drive_data_single.py` | Import single restaurant | `scripts/` |
| `export_test_restaurant_json.py` | Export to JSON | `scripts/` |
| `test_supabase_connection.py` | Test DB connection | `scripts/` |
| `add-users-cli.js` | Add users via CLI | `scripts/` |
| `add-users-to-supabase.js` | Bulk user import | `scripts/` |
| `extract-unique-emails.js` | Extract KAM emails | `scripts/` |

---

### 📦 Data Files
| File | Purpose | Location |
|------|---------|----------|
| `NCN-codes.csv` | NCN drive data (5,541 restaurants) | `drive-data/` |
| `N2R-Codes.csv` | N2R drive data (5,668 restaurants) | `drive-data/` |
| `Items-159LL.csv` | Items drive data (1,909 restaurants) | `drive-data/` |
| `test_restaurant_6503620.json` | Test restaurant data | Root |
| `kam-data.txt` | KAM information | Root |

---

### 🗂️ Archived Documentation
| File | Purpose | Location |
|------|---------|----------|
| Sprint 1 working docs | Progress tracking, setup | `docs/completed-sprints/` |
| Meeting preparation docs | Developer meeting materials | `docs/archive/` |
| Fix reports | Historical bug fixes | `docs/archive/` |

---

## 🎯 Documentation by Task

### I want to...

**...understand the project**
1. [README.md](README.md)
2. [PROJECT-STATUS.md](PROJECT-STATUS.md)
3. [SYSTEM-ARCHITECTURE-DIAGRAM.md](SYSTEM-ARCHITECTURE-DIAGRAM.md)

**...set up the project**
1. [README.md](README.md) - Installation
2. [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)
3. [AUTHENTICATION_SETUP_COMPLETE.md](AUTHENTICATION_SETUP_COMPLETE.md)

**...work on Sprint 2**
1. [PROJECT-STATUS.md](PROJECT-STATUS.md)
2. [SPRINT-2-GUIDE.md](SPRINT-2-GUIDE.md)
3. [IMPORTANT-NOTES.md](IMPORTANT-NOTES.md)

**...understand the data flow**
1. [DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md](DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md)
2. [DRIVE-DATA-IMPLEMENTATION-PLAN.md](DRIVE-DATA-IMPLEMENTATION-PLAN.md)
3. `supabase/drive_sheets_data_schema.sql`

**...debug an issue**
1. [IMPORTANT-NOTES.md](IMPORTANT-NOTES.md)
2. [SPRINT-1-COMPLETION-REPORT.md](SPRINT-1-COMPLETION-REPORT.md) - Known issues
3. `debug_rls_policy.sql` - For RLS issues

**...add test users**
1. [SUPABASE_USER_SETUP.md](SUPABASE_USER_SETUP.md)
2. `scripts/add-users-cli.js`

---

## 📝 Documentation Standards

### File Naming
- **Status docs:** `PROJECT-STATUS.md`, `IMPORTANT-NOTES.md`
- **Sprint docs:** `SPRINT-X-GUIDE.md`, `SPRINT-X-COMPLETION-REPORT.md`
- **Setup docs:** `*-SETUP*.md`, `*-GUIDE.md`
- **Technical docs:** `*-COMPLETE-GUIDE.md`, `*-DIAGRAM.md`

### Update Frequency
- **PROJECT-STATUS.md:** After each sprint
- **IMPORTANT-NOTES.md:** When critical changes occur
- **Sprint reports:** At sprint completion
- **README.md:** Major feature additions

---

## 🔄 Maintenance

### When to Archive
- Sprint completion reports → `docs/completed-sprints/`
- Obsolete guides → `docs/archive/`
- Historical bug fixes → `docs/archive/`

### When to Update
- **After Sprint 2:** Update PROJECT-STATUS.md, create Sprint 2 completion report
- **After major changes:** Update IMPORTANT-NOTES.md
- **New features:** Update README.md

---

**Need help?** Start with [PROJECT-STATUS.md](PROJECT-STATUS.md) for current status and next steps.

