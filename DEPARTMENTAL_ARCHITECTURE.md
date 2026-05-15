# Omix SMS — Departmental System Architecture Plan

## Overview
School management platform with department-specific logins, offline-capable PWAs, and a principal oversight dashboard with AI-driven reporting.

---

## 1. Route Structure (per school subdomain)

```
demo.omix-h2.onrender.com/
├── /login                          ← Super admin / school admin login
├── /dashboard                      ← School admin / principal dashboard
├── /admin                          ← Super admin only
│
├── /bursar                         ← Bursar login page
├── /library                        ← Librarian login page
├── /science-lab                    ← Lab technician login page
├── /computer-lab                   ← Computer lab login page
├── /departments/[slug]             ← Department head login (e.g., /departments/mathematics)
│
│   [ After login — each routes to their own dashboard ]
│
├── /bursar/dashboard               ← Fee management (existing fees module)
├── /library/dashboard              ← Book inventory + checkout
├── /science-lab/dashboard          ← Apparatus tracking
├── /computer-lab/dashboard         ← Computer student records
├── /departments/[slug]/dashboard   ← Subject performance tracking
│
├── /notifications                  ← Shared notification center
└── /settings                       ← Per-user password/email settings
```

---

## 2. Role Hierarchy

```
super_admin                          ← Platform owner (you)
  └── principal (school_admin)       ← School-level admin, assigns all roles
       ├── bursar                    ← Fee management (most critical, no errors)
       ├── librarian                 ← Books + checkout
       ├── lab_technician            ← Science apparatus
       ├── computer_lab              ← Computer lab
       └── department_head           ← Maths, English, etc. per subject
```

**Login behavior:** Each role logs in at their own route. The auth function checks `role` matches the route. Invalid role → redirected back.

---

## 3. Schema Changes Needed

### New Models
| Model | Purpose |
|---|---|
| `UserDepartment` | Links User → Department (which department they belong to) |
| `Department` | Name, slug, type (academic/lab/library/bursar/computer_lab) |
| `LibraryBook` | Book records: title, author, ISBN, quantity, available |
| `BookCheckout` | Checkout log: bookId, studentId (by admissionNo), dates, status |
| `ScienceApparatus` | Apparatus: name, category, total, available, broken, lost |
| `ApparatusLog` | Log entries: broken/lost/repaired/restocked with quantities |
| `SubjectPerformance` | Mean scores per subject/class/exam/term/year |
| `Notification` | Announcement relay to departments |
| `NotificationRead` | Tracks read status per user |
| `DepartmentLog` | Unified log for principal's dashboard |

### Model Modifications
| Model | Change |
|---|---|
| `User` | Add `departmentId?` field |
| `Teacher` | Add `userId?` field (links login → teacher profile) |
| `Class` | Add `classTeacherId?` (userId of assigned class teacher) |

---

## 4. Implementation Order

### Phase 1 — Database Foundation (Schema + Migrations)
1. Update Prisma schema with all new models
2. Run migration
3. Create seed data for demo

### Phase 2 — Auth + Routing
1. Department-specific login pages (each styled, route-guarded)
2. Update NextAuth authorize to validate role + route match
3. Middleware to protect department routes by role
4. Settings page per user (password/email change)

### Phase 3 — Bursar Module (highest priority, zero errors)
1. Port existing fees page to bursar dashboard
2. Add fee balance tracking per student
3. Add receipt generation
4. Add payment verification workflow
5. Add bursar-specific stats (total collected, outstanding, defaulters)

### Phase 4 — Library Module
1. Book CRUD (add/edit/delete books)
2. Checkout system by admission number
3. Return tracking
4. Overdue detection
5. Search by title/author/ISBN

### Phase 5 — Science Lab Module
1. Apparatus CRUD (name, category, quantities)
2. Status tracking: available, broken, lost, needed
3. Log actions (report broken, mark repaired, restock, note lost)
4. Dashboard with apparatus health overview

### Phase 6 — Subject Departments
1. Performance records per class per exam per term per year
2. Mean score calculation
3. Per-student grade breakdown
4. Department dashboards with charts (recharts)

### Phase 7 — Principal's Oversight Dashboard
1. Unified log feed from all departments
2. Fee summary, library stats, lab status, performance trends
3. AI integration: "Principal's Report" — AI reads all dept data and flags issues

### Phase 8 — Notification System
1. Principal announcements create Notification records
2. Each department sees notifications on their dashboard header
3. Bell badge shows unread count
4. Nudge: client-side setInterval polls every 60s, badge pulses until all read

### Phase 9 — PWA + Offline
1. Service worker per department route
2. manifest.json per app
3. IndexedDB for offline record storage
4. Background sync: queue writes when offline, flush when online
5. "Install" prompt for each department

---

## 5. Design Principles

### Mobile Responsiveness
- All tables: `overflow-x-auto` with horizontal scroll on mobile
- Forms: full-width inputs, stacked layout on small screens
- Stat cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Modals: full-screen on mobile (`max-w-full min-h-screen`)
- Sidebar: drawer overlay on mobile (already implemented)
- Touch targets: minimum 44px tap area
- Padding: responsive `p-4 lg:p-6`

### Error Prevention (especially Bursar)
- Zod validation on ALL API inputs
- Database transactions for critical operations (payments)
- Optimistic UI with rollback
- Confirmation dialogs before destructive actions
- Input sanitization and type checking
- Audit log for every financial transaction

### Offline Sync Strategy
- Service worker caches static assets (App Shell pattern)
- IndexedDB stores pending writes
- On reconnect: flush queue in order, handle conflicts with "last write wins" + timestamp
- Visual indicator: green dot (online) / yellow dot (offline with pending) / red dot (offline)

---

## 6. File Map

```
src/app/
├── login/page.tsx                              ← Existing
├── (dashboard)/layout.tsx                      ← Existing (main dashboard)
├── admin/layout.tsx                            ← Existing
│
├── bursar/login/page.tsx                       ← NEW: Bursar login
├── bursar/dashboard/page.tsx                   ← NEW: Fee management
├── bursar/layout.tsx                           ← NEW: Bursar layout
│
├── library/login/page.tsx                      ← NEW: Library login
├── library/dashboard/page.tsx                  ← NEW: Book management
├── library/layout.tsx                          ← NEW: Library layout
│
├── science-lab/login/page.tsx                  ← NEW: Science lab login
├── science-lab/dashboard/page.tsx              ← NEW: Apparatus tracking
├── science-lab/layout.tsx                      ← NEW: Science lab layout
│
├── computer-lab/login/page.tsx                 ← NEW: Computer lab login
├── computer-lab/dashboard/page.tsx             ← NEW: Student records
├── computer-lab/layout.tsx                     ← NEW: Computer lab layout
│
├── departments/[slug]/login/page.tsx           ← NEW: Department login
├── departments/[slug]/dashboard/page.tsx       ← NEW: Performance tracking
├── departments/[slug]/layout.tsx               ← NEW: Department layout
│
├── notifications/page.tsx                      ← NEW: Notification center
└── api/
    ├── library/                                ← NEW: Book+checkout APIs
    ├── science-lab/                            ← NEW: Apparatus APIs
    ├── departments/                            ← NEW: Performance APIs
    ├── notifications/                          ← NEW: Notification APIs
    └── principal/                              ← NEW: Unified dashboard + AI report
```

---

Begin implementation when approved. I recommend starting with Phase 1 (Schema), Phase 2 (Auth), then Phase 3 (Bursar) as the critical path.
