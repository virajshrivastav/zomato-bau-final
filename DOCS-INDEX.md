# 📚 Documentation Index

**Last Updated:** 2025-11-16
**Project:** Zomato BAU KAM Dashboard
**Documentation Version:** 2.0 (Post-Reorganization)

---

## 🎯 Essential Files (Root Directory)

### 1. **README.md**
Main project overview, tech stack, route structure, and getting started guide.

### 2. **PROJECT-STATUS.md**
Current project status, sprint progress, latest updates, and what's working.

### 3. **DOCS-INDEX.md** (This File)
Complete documentation index and navigation guide.

---

## 📚 Documentation Hub

### **docs/README.md** - Start Here!
Comprehensive documentation navigation with:
- Quick links to all documentation categories
- Common tasks guide
- Documentation standards
- Recent updates

---

## 🗂️ Documentation Structure

### 📖 Technical Guides (`docs/guides/`)
Core technical documentation for developers:
- **DATABASE-TO-FRONTEND-COMPLETE-GUIDE.md** - Data flow from DB to UI
- **SYSTEM-ARCHITECTURE-DIAGRAM.md** - System architecture overview
- **SUPABASE-DATA-IMPORT-GUIDE.md** - Data import procedures
- **AUTOMATIC-EXECUTION-GUIDE.md** - Automated import scripts
- **SUPABASE-TROUBLESHOOTING.md** - Common issues and solutions

### ✨ Features (`docs/features/`)
Feature-specific documentation organized by module:

#### Performance Metrics (`docs/features/performance-metrics/`)
- NCN Coverage tracking
- N2R Conversion metrics
- Items <=159 monitoring
- Drive-wise summaries
- KAM-filtered performance views

#### Google Sheets Integration (`docs/features/google-sheets/`)
- Real-time sync setup and configuration
- Google Sheets API integration
- Sync quick reference guides
- Troubleshooting and debugging

#### Google OAuth (`docs/features/google-oauth/`)
- Authentication setup and configuration
- Domain restriction (@zomato.com)
- OAuth flow documentation
- Security policies and best practices

#### ADs & Toing (`docs/features/ads-toing/`)
- ADs BR data import and management
- Toing data tracking
- Historic data analysis
- Execution guides

#### Commission Data (`docs/features/commission/`)
- Commission tracking system
- Data import procedures
- Commission calculations

#### KAM Hub (`docs/features/kam-hub/`)
- Rankings system
- KAM performance tracking
- Migration guides
- Hub features documentation

### 🚀 Deployment (`docs/deployment/`)
Production deployment documentation:
- Vercel deployment guides
- Environment configuration
- Production setup procedures
- Troubleshooting deployment issues
- Blank screen fixes

### 🧪 Testing (`docs/testing/`)
Testing documentation and procedures:
- **FRONTEND-TEST-PLAN.md** - Comprehensive test plan
- **TESTING-SUMMARY.md** - Test results and coverage
- **QUICK-TEST-REFERENCE.md** - Quick testing guide
- **START-TESTING-NOW.md** - Get started with testing
- **TEAM-LEADS-AUTH-VERIFICATION.md** - Auth testing
- **RESTAURANT-6503620-EXPECTED-VALUES.md** - Test data
- Visual verification guides

### 📊 Sprint Documentation (`docs/sprints/`)
Sprint summaries and progress tracking:
- Sprint summaries (Sprint 1, 2, 3)
- Phase documentation
- Implementation checklists
- Execution guides
- Sign-in and zonal updates

### 📦 Resources (`docs/resources/`)
Additional resources and materials:
- PDF documentation
- Images and diagrams
- Reference materials

### 📁 Archive (`docs/archive/`)
Historical and outdated documentation:
- **context/** - Old context documents
- **fixes/** - Completed fix documentation
---

## 📁 Data Files (`data/`)

### Drives Data (`data/drives/`)
- NCN-codes.csv
- N2R-Codes.csv
- Items-159LL.csv

### Performance Metrics (`data/performance/`)
- NCN Coverage Summary CSV
- N2R Summary CSV
- Input Summary CSV

### ADs & Commission (`data/ads-commission/`)
- ADS BR Exact CSV
- Ads Historic CSV
- Commission data CSV
- Toing data CSV

---

## 📦 Archive (`archive/`)

### SQL Imports (`archive/sql-imports/`)
All completed SQL import files from Sprint 2:
- **sprint-2/** - NCN, N2R, Items batch files (138 files)
- **zvdo/** - ZVDO import files
- **ads-commission/** - ADs and Commission SQL files
- **testing/** - Test SQL files
- **rls-policies/** - Old RLS policy files
- **generated/** - Generated SQL output

### Data Archive (`archive/data/`)
- kam-data.txt (original KAM data)
- Historical data files

### Test Data (`archive/test-data/`)
- Test JSON and CSV files

---

## 🗂️ Complete Directory Structure

```
zomato-new/
├── README.md                    # Main project overview
├── PROJECT-STATUS.md            # Current status
├── DOCS-INDEX.md               # This file
│
├── src/                        # Application source code
├── api/                        # API routes
├── scripts/                    # Utility scripts
│   ├── powershell/            # PowerShell scripts
│   └── *.py                   # Python import scripts
│
├── supabase/                   # Database
│   ├── migrations/            # Database migrations
│   └── policies/              # RLS policies
│
├── data/                       # All data files
│   ├── drives/                # Drive CSVs
│   ├── performance/           # Performance CSVs
│   └── ads-commission/        # ADs & Commission CSVs
│
├── docs/                       # All documentation
│   ├── README.md              # Documentation hub
│   ├── guides/                # Technical guides
│   ├── features/              # Feature docs
│   │   ├── performance-metrics/
│   │   ├── google-sheets/
│   │   ├── google-oauth/
│   │   ├── ads-toing/
│   │   ├── commission/
│   │   └── kam-hub/
│   ├── deployment/            # Deployment guides
│   ├── testing/               # Testing docs
│   ├── sprints/               # Sprint summaries
│   ├── resources/             # PDFs, images
│   └── archive/               # Historical docs
│       ├── context/
│       └── fixes/
│
└── archive/                    # Historical artifacts
    ├── sql-imports/           # All SQL files
    ├── data/                  # Old data files
    └── test-data/             # Test files
```

---

## 🎯 Quick Navigation Guide

### For Developers
1. Start with [README.md](../README.md)
2. Review [docs/guides/](docs/guides/) for technical details
3. Check [docs/features/](docs/features/) for specific features
4. See [PROJECT-STATUS.md](../PROJECT-STATUS.md) for current state

### For Testing
1. Read [docs/testing/FRONTEND-TEST-PLAN.md](docs/testing/FRONTEND-TEST-PLAN.md)
2. Follow [docs/testing/QUICK-TEST-REFERENCE.md](docs/testing/QUICK-TEST-REFERENCE.md)
3. Check expected values in testing docs

### For Deployment
1. Review [docs/deployment/](docs/deployment/)
2. Check [PROJECT-STATUS.md](../PROJECT-STATUS.md) for deployment status
3. Follow Vercel deployment guides

### For Data Import
1. Check [scripts/](../scripts/) for import scripts
2. Review [data/](../data/) for CSV files
3. See [docs/guides/](docs/guides/) for import procedures

---

## 📝 Recent Changes

**2025-11-16:** Major Reorganization
- ✅ Moved 138 SQL files to archive/sql-imports/
- ✅ Organized 82 documentation files into docs/ subdirectories
- ✅ Consolidated data files into data/ folder
- ✅ Updated all script paths
- ✅ Created comprehensive documentation structure
- ✅ Reduced root directory from 85 MD files to 3

**Benefits:**
- 96% reduction in root directory clutter
- Clear feature-based organization
- Easy navigation and discovery
- Professional structure
- Scalable for future growth

---

## ✅ Documentation Standards

1. **Organization** - Group related docs in appropriate subdirectories
2. **Naming** - Use descriptive, UPPERCASE-WITH-DASHES.md format
3. **Content** - Include title, purpose, date, and status
4. **Navigation** - Add links to related documentation
5. **Maintenance** - Archive outdated docs, don't delete

---

**Total Root MD Files:** 3
**Total Documentation Files:** 80+
**Total Archived SQL Files:** 138
**Last Reorganization:** 2025-11-16

