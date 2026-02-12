# Cengineers Kanban Board — Comprehensive Audit & Enhancement Plan

> **Generated:** Feb 12, 2026 | **Status:** Audit Complete

---

## 📊 Current State Summary

### ✅ What's Working
| Area | Status | Details |
|------|--------|---------|
| Dashboard | ✅ | Hero section, stats cards, quick actions, activity feed |
| Kanban Board | ✅ | Drag-and-drop, ticket creation, ticket details |
| Projects | ✅ | List, create, project detail with board |
| Meetings | ✅ | Calendar view, schedule meeting dialog |
| Knowledge Base | ✅ | Articles, categories, search, create |
| Team Management | ✅ | User list, invite, role management |
| Settings | ✅ | 6 tabs: Account, Notifications, Appearance, Team, Security, API |
| Profile | ✅ | Header, stats, activity, assigned tickets |
| Login/Register | ✅ | Email/password, SSO buttons (UI only) |
| Global Search | ✅ | Cmd+K, cross-resource search (mock) |
| Notifications | ✅ | Dropdown + dedicated page |
| Email (Resend) | ✅ | 6 email templates, API route, client service |

### 🔴 Critical Gaps

| Area | Issue |
|------|-------|
| **No Backend/Database** | All data is mock/in-memory — resets on refresh |
| **No Authentication** | Login page exists but no actual auth flow |
| **Only 1 API Route** | Only `/api/send-email` exists — no CRUD APIs |
| **No Data Persistence** | Tickets, projects, meetings all use `useState` with `initialData` |
| **No Real-time Updates** | No WebSocket/SSE for live collaboration |
| **Search is Mock** | Global search returns hardcoded results |
| **No File Upload** | Ticket attachments UI exists but no upload logic |

---

## 🏗️ PHASE 1: API Routes (Backend Foundation)

### 1.1 Tickets API — `/api/tickets`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/tickets` | List all tickets (with filters: status, priority, assignee, project) |
| `GET` | `/api/tickets/[id]` | Get single ticket with comments & attachments |
| `POST` | `/api/tickets` | Create ticket → trigger assignment email |
| `PATCH` | `/api/tickets/[id]` | Update ticket (title, description, priority, assignee, status) |
| `DELETE` | `/api/tickets/[id]` | Delete/archive ticket |
| `POST` | `/api/tickets/[id]/comments` | Add comment to ticket |
| `POST` | `/api/tickets/[id]/attachments` | Upload attachment |
| `PATCH` | `/api/tickets/[id]/status` | Move ticket between columns → trigger status change email |

### 1.2 Projects API — `/api/projects`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/projects` | List all projects (with search, status filter) |
| `GET` | `/api/projects/[id]` | Get project detail with board + columns |
| `POST` | `/api/projects` | Create project → trigger project created email |
| `PATCH` | `/api/projects/[id]` | Update project metadata |
| `DELETE` | `/api/projects/[id]` | Archive/delete project |
| `POST` | `/api/projects/[id]/members` | Add team member to project |
| `DELETE` | `/api/projects/[id]/members/[userId]` | Remove member from project |

### 1.3 Meetings API — `/api/meetings`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/meetings` | List meetings (filter by date range, attendee) |
| `GET` | `/api/meetings/[id]` | Get single meeting |
| `POST` | `/api/meetings` | Schedule meeting → send invites via Resend |
| `PATCH` | `/api/meetings/[id]` | Update meeting (reschedule, add attendees) |
| `DELETE` | `/api/meetings/[id]` | Cancel meeting → notify attendees |
| `POST` | `/api/meetings/[id]/rsvp` | RSVP to meeting (accept/decline/tentative) |

### 1.4 Users/Team API — `/api/users`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/users` | List team members |
| `GET` | `/api/users/[id]` | Get user profile |
| `POST` | `/api/users/invite` | Send invitation email |
| `PATCH` | `/api/users/[id]` | Update user (role, status, profile) |
| `DELETE` | `/api/users/[id]` | Deactivate/remove user |
| `GET` | `/api/users/me` | Get current authenticated user |

### 1.5 Knowledge Base API — `/api/articles`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/articles` | List articles (search, category, author filter) |
| `GET` | `/api/articles/[id]` | Get article content |
| `POST` | `/api/articles` | Create article |
| `PATCH` | `/api/articles/[id]` | Update article |
| `DELETE` | `/api/articles/[id]` | Delete article |
| `POST` | `/api/articles/[id]/views` | Increment view count |

### 1.6 Notifications API — `/api/notifications`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/notifications` | Get user's notifications (paginated) |
| `PATCH` | `/api/notifications/[id]/read` | Mark single notification as read |
| `PATCH` | `/api/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/notifications/[id]` | Delete notification |

### 1.7 Search API — `/api/search`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/search?q=query` | Full-text search across tickets, projects, articles, users |

### 1.8 Dashboard API — `/api/dashboard`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/dashboard/stats` | Get dashboard statistics (active projects, tasks completed, etc.) |
| `GET` | `/api/dashboard/activity` | Get recent activity feed |

### 1.9 Auth API — `/api/auth`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/auth/login` | Email/password login |
| `POST` | `/api/auth/register` | Register new account |
| `POST` | `/api/auth/logout` | End session |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `GET` | `/api/auth/session` | Get current session |

### 1.10 File Upload API — `/api/upload`
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/upload` | Upload file (ticket attachment, avatar, article image) |
| `DELETE` | `/api/upload/[id]` | Delete uploaded file |

---

## 🧩 PHASE 2: Missing Features

### 2.1 Authentication & Authorization
- [ ] **NextAuth.js / Auth.js Integration** — Session management, JWT tokens
- [ ] **Role-Based Access Control (RBAC)** — Manager, Engineer, Designer, Researcher permissions
- [ ] **Protected Routes** — Middleware to guard authenticated pages
- [ ] **Password Reset Flow** — Email with reset link via Resend
- [ ] **OAuth Providers** — Google, GitHub SSO (currently UI-only)
- [ ] **Session Persistence** — Remember me, auto-refresh tokens

### 2.2 Database & Data Persistence
- [ ] **Database Setup** — Prisma ORM + PostgreSQL (or Supabase)
- [ ] **Schema Design** — Users, Projects, Boards, Columns, Tickets, Comments, Attachments, Meetings, Articles, Notifications
- [ ] **Seed Script** — Populate database with initial demo data
- [ ] **Migrations** — Versioned schema changes

### 2.3 Real-time Collaboration
- [ ] **WebSocket/SSE** — Live ticket updates when team members move cards
- [ ] **Presence Indicators** — Show who's viewing the same board
- [ ] **Live Comments** — Real-time comment updates on tickets
- [ ] **Notification Push** — Browser push notifications for urgent items

### 2.4 File Management
- [ ] **File Upload Service** — S3/Cloudflare R2 integration for attachments
- [ ] **Drag-and-Drop Upload** — On ticket detail dialog
- [ ] **File Preview** — Inline preview for images, PDFs
- [ ] **Avatar Upload** — On profile/settings pages

### 2.5 Advanced Kanban Features
- [ ] **Column Customization** — Add/remove/rename/reorder columns
- [ ] **WIP Limits** — Work-in-progress limits per column
- [ ] **Swimlanes** — Group tickets by priority, assignee, or type
- [ ] **Board Filters** — Filter tickets by assignee, priority, label, due date
- [ ] **Bulk Actions** — Select multiple tickets to move, assign, or delete
- [ ] **Ticket Templates** — Reusable templates for common ticket types (legal review, client intake, etc.)
- [ ] **Sub-tasks / Checklists** — Break tickets into smaller sub-tasks
- [ ] **Time Tracking** — Log time spent on tickets
- [ ] **Labels/Tags** — Custom color-coded labels for further categorization
- [ ] **Ticket Linking** — Link related or blocking tickets together

### 2.6 Legal-Tech Specific Features
- [ ] **Case Management** — Link tickets to specific legal cases
- [ ] **Deadline Tracking** — Court deadlines, filing dates, statute of limitations
- [ ] **Client Portal** — Client-facing view of their case progress
- [ ] **Document Templates** — Legal document templates (NDAs, contracts, briefs)
- [ ] **Billing Integration** — Track billable hours per ticket
- [ ] **Conflict of Interest Check** — Automated conflict check before case assignment
- [ ] **Court Calendar Sync** — Import court dates into meetings
- [ ] **Matter/Case Types** — Categories like litigation, corporate, IP, etc.

---

## ✨ PHASE 3: Enhancements to Existing Features

### 3.1 Dashboard Enhancements
- [ ] **Dynamic Stats** — Pull real data from API instead of hardcoded values
- [ ] **Chart Widgets** — Add charts (tickets by status, by priority, burndown chart)
- [ ] **Customizable Dashboard** — Drag-and-rearrange dashboard widgets
- [ ] **Date Range Picker** — Filter stats/activity by date range
- [ ] **Team Performance** — Show individual team member productivity
- [ ] **Recently Viewed** — Quick links to recently accessed tickets/projects

### 3.2 Kanban Board Enhancements
- [ ] **Due Date Warnings** — Visual indicators for overdue/upcoming due dates
- [ ] **Priority Sorting** — Auto-sort tickets within columns by priority
- [ ] **Quick Edit** — Inline editing of ticket title/assignee without opening dialog
- [ ] **Keyboard Navigation** — Arrow keys to navigate, Enter to open, shortcuts to create
- [ ] **Drag Feedback** — Better visual feedback during drag (column highlighting, position indicator)
- [ ] **Ticket Count Limits** — Warning when column exceeds WIP limit
- [ ] **Collapse Columns** — Collapse/expand individual columns
- [ ] **Board Views** — Toggle between Kanban, List, Table, Calendar views

### 3.3 Meeting Enhancements
- [ ] **Recurring Meetings** — Daily/weekly/monthly repeat
- [ ] **RSVP Status** — Accept, decline, tentative
- [ ] **Meeting Notes** — Rich-text notes attached to meetings
- [ ] **Calendar Integrations** — Google Calendar, Outlook sync (ICS export)
- [ ] **Video Call Integration** — Embedded video call (not just a link)
- [ ] **Meeting Analytics** — Track meeting duration, attendance rates

### 3.4 Knowledge Base Enhancements
- [ ] **Rich Text Editor** — WYSIWYG editor for articles (TipTap/ProseMirror)
- [ ] **Article Versioning** — Track changes and allow rollbacks
- [ ] **Collaborative Editing** — Multiple editors, track changes
- [ ] **Related Articles** — Auto-suggest related articles
- [ ] **Article Reactions** — Upvote/downvote, emoji reactions
- [ ] **Export** — Export articles as PDF/DOCX

### 3.5 Notifications Enhancements
- [ ] **Notification Preferences** — Per-type email/in-app/push preferences
- [ ] **Digest Mode** — Group notifications into a periodic digest
- [ ] **Snooze** — Snooze notifications for later
- [ ] **Priority Notifications** — High-priority items shown prominently
- [ ] **@Mentions** — Notify users when mentioned in comments
- [ ] **Sound Alerts** — Optional sound for new notifications

### 3.6 Search Enhancements
- [ ] **Full-Text API Search** — Real API-backed search instead of mock data
- [ ] **Search Filters** — Filter by type, date, assignee, project
- [ ] **Recent Searches** — Show recent search queries
- [ ] **Search Suggestions** — Auto-complete as user types
- [ ] **Advanced Search** — Boolean operators, field-specific search

### 3.7 Profile & Settings Enhancements
- [ ] **Avatar Upload** — Actual file upload instead of placeholder
- [ ] **2FA Setup** — Time-based one-time passwords (TOTP)
- [ ] **API Key Management** — Generate/revoke actual API keys
- [ ] **Audit Log** — Show user's login history and actions
- [ ] **Theme Customization** — Custom accent colors beyond light/dark
- [ ] **Export My Data** — GDPR-compliant data export

---

## 🔌 PHASE 4: Add-ons & Integrations

### 4.1 Third-Party Integrations
- [ ] **Slack Integration** — Forward notifications to Slack channels
- [ ] **GitHub Integration** — Link tickets to GitHub issues/PRs  
- [ ] **Google Calendar** — Bi-directional calendar sync
- [ ] **Microsoft Teams** — Chat notifications and meeting links
- [ ] **Zapier/Webhooks** — Custom automations with external services
- [ ] **Stripe** — Billing and subscription management

### 4.2 AI & Automation
- [ ] **AI Ticket Suggestions** — Currently mock — connect to OpenAI/Gemini API
- [ ] **Smart Assignment** — AI-based ticket assignment based on workload/expertise
- [ ] **Auto-categorization** — AI labels and categorizes incoming tickets
- [ ] **Due Date Estimation** — AI-predicted time estimates
- [ ] **Meeting Summary** — Auto-generate meeting summaries from notes
- [ ] **Document Analysis** — AI-powered legal document analysis

### 4.3 Reporting & Analytics
- [ ] **Project Reports** — Progress, velocity, burndown charts
- [ ] **Team Reports** — Individual/team productivity metrics
- [ ] **Time Reports** — Hours logged per project/ticket
- [ ] **Custom Dashboards** — Build custom dashboards with drag-and-drop widgets
- [ ] **Export Reports** — PDF/CSV export of reports
- [ ] **Client Reports** — Shareable progress reports for clients

### 4.4 Mobile & PWA
- [ ] **Progressive Web App** — Installable PWA with offline support
- [ ] **Mobile-Optimized Views** — Better mobile kanban (horizontal scroll, compact cards)
- [ ] **Push Notifications** — Native push via Service Workers
- [ ] **Offline Mode** — Queue changes when offline, sync when back

### 4.5 DevOps & Infrastructure
- [ ] **CI/CD Pipeline** — GitHub Actions for build/test/deploy
- [ ] **Error Tracking** — Sentry integration
- [ ] **Analytics** — PostHog or Vercel Analytics
- [ ] **Performance Monitoring** — Web Vitals tracking
- [ ] **Rate Limiting** — API rate limiting to prevent abuse
- [ ] **Logging** — Structured logging with Pino or Winston

---

## 📋 Priority Implementation Order

### 🔥 Immediate (Week 1-2)
1. **Database Setup** — Prisma + PostgreSQL schema
2. **Auth with NextAuth.js** — Login, register, session management  
3. **Tickets CRUD API** — The core workflow
4. **Projects CRUD API** — Project management
5. **Real search** — API-backed global search

### 🟡 Short-term (Week 3-4)
6. **Meetings CRUD API** — Scheduling with real persistence
7. **Notifications API** — Server-side notification storage
8. **Users/Team API** — RBAC permissions
9. **File Upload** — S3/R2 integration for attachments
10. **Board views & filters** — Kanban filters, list view

### 🔵 Medium-term (Week 5-8)
11. **Knowledge Base API** — Article CRUD with rich editor
12. **Real-time updates** — WebSocket for live board updates
13. **Charts & analytics** — Dashboard charts, project reports
14. **Legal-specific features** — Case management, deadline tracking
15. **Calendar integrations** — Google Calendar ICS sync

### 🟣 Long-term (Month 2-3)
16. **AI features** — Real AI suggestions, auto-categorization
17. **Third-party integrations** — Slack, GitHub, Zapier
18. **PWA** — Installable app with offline support
19. **Client portal** — External client view
20. **Billing/time tracking** — Billable hours integration

---

## 📁 Proposed API Route File Structure

```
app/api/
├── auth/
│   ├── [...nextauth]/route.ts          # NextAuth handler
│   ├── register/route.ts               # Register endpoint
│   └── forgot-password/route.ts        # Password reset
├── tickets/
│   ├── route.ts                        # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts                    # GET, PATCH, DELETE
│       ├── comments/route.ts           # POST comment
│       ├── attachments/route.ts        # POST attachment
│       └── status/route.ts             # PATCH status change
├── projects/
│   ├── route.ts                        # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts                    # GET, PATCH, DELETE
│       └── members/
│           ├── route.ts                # POST add member
│           └── [userId]/route.ts       # DELETE remove member
├── meetings/
│   ├── route.ts                        # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts                    # GET, PATCH, DELETE
│       └── rsvp/route.ts              # POST RSVP
├── users/
│   ├── route.ts                        # GET (list)
│   ├── me/route.ts                     # GET current user
│   ├── invite/route.ts                 # POST invite
│   └── [id]/route.ts                   # GET, PATCH, DELETE
├── articles/
│   ├── route.ts                        # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts                    # GET, PATCH, DELETE
│       └── views/route.ts             # POST increment views
├── notifications/
│   ├── route.ts                        # GET (list)
│   ├── read-all/route.ts              # PATCH mark all read
│   └── [id]/
│       ├── route.ts                    # DELETE
│       └── read/route.ts              # PATCH mark read
├── search/route.ts                     # GET search
├── dashboard/
│   ├── stats/route.ts                  # GET stats
│   └── activity/route.ts              # GET activity feed
├── upload/
│   ├── route.ts                        # POST upload file
│   └── [id]/route.ts                  # DELETE file
└── send-email/route.ts                 # ✅ EXISTS - Email sending
```

---

## 🗄️ Proposed Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String?
  role          Role      @default(ENGINEER)
  status        Status    @default(ACTIVE)
  avatar        String?
  lastActive    DateTime  @default(now())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  assignedTickets  Ticket[]      @relation("TicketAssignee")
  comments         Comment[]
  organizedMeetings Meeting[]    @relation("MeetingOrganizer")
  attendingMeetings Meeting[]    @relation("MeetingAttendees")
  articles         KnowledgeArticle[]
  notifications    Notification[]
  projectMemberships ProjectMember[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  board       Board?
  members     ProjectMember[]
}

model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  role      String   @default("member")
  project   Project  @relation(fields: [projectId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@unique([projectId, userId])
}

model Board {
  id        String   @id @default(cuid())
  title     String
  projectId String   @unique
  project   Project  @relation(fields: [projectId], references: [id])
  columns   Column[]
}

model Column {
  id        String   @id @default(cuid())
  title     String
  position  Int
  wipLimit  Int?
  boardId   String
  board     Board    @relation(fields: [boardId], references: [id])
  tickets   Ticket[]
}

model Ticket {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        TicketType @default(TASK)
  priority    Priority  @default(MEDIUM)
  status      String    @default("todo")
  dueDate     DateTime?
  position    Int       @default(0)
  timeSpent   Int?      // in minutes
  columnId    String
  assigneeId  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  column      Column       @relation(fields: [columnId], references: [id])
  assignee    User?        @relation("TicketAssignee", fields: [assigneeId], references: [id])
  comments    Comment[]
  attachments Attachment[]
  labels      Label[]
  subtasks    Subtask[]
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  userId    String
  ticketId  String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
}

model Attachment {
  id         String   @id @default(cuid())
  name       String
  url        String
  type       String
  size       Int
  ticketId   String
  uploadedAt DateTime @default(now())

  ticket     Ticket   @relation(fields: [ticketId], references: [id])
}

model Label {
  id      String   @id @default(cuid())
  name    String
  color   String
  tickets Ticket[]
}

model Subtask {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id])
}

model Meeting {
  id          String   @id @default(cuid())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  meetLink    String?
  recurring   RecurrenceType?
  organizerId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  organizer   User     @relation("MeetingOrganizer", fields: [organizerId], references: [id])
  attendees   User[]   @relation("MeetingAttendees")
  notes       MeetingNote[]
}

model MeetingNote {
  id        String   @id @default(cuid())
  content   String
  meetingId String
  createdAt DateTime @default(now())

  meeting   Meeting  @relation(fields: [meetingId], references: [id])
}

model KnowledgeArticle {
  id        String   @id @default(cuid())
  title     String
  content   String
  category  String
  tags      String[]
  views     Int      @default(0)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
}

model Notification {
  id        String   @id @default(cuid())
  type      String
  title     String
  message   String
  linkTo    String?
  readAt    DateTime?
  userId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
}

// Enums
enum Role {
  ADMIN
  MANAGER
  ENGINEER
  DESIGNER
  RESEARCHER
  VIEWER
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
}

enum ProjectStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

enum TicketType {
  FEATURE
  BUG
  TASK
  RESEARCH
  LEGAL_REVIEW
  CLIENT_INTAKE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum RecurrenceType {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
}
```

---

## 📊 Effort Estimates

| Phase | Items | Estimated Effort |
|-------|-------|-----------------|
| Phase 1: API Routes | 37 endpoints | 3-4 weeks |
| Phase 2: Missing Features | 28 features | 4-6 weeks |
| Phase 3: Enhancements | 40+ improvements | 4-6 weeks |
| Phase 4: Add-ons | 24 integrations | 6-12 weeks |
| **Total** | **130+ items** | **~17-28 weeks** |

---

## 🎯 Recommended Starting Point

**Start with these 5 items to unlock the most value:**

1. **Prisma + PostgreSQL setup** — Foundation for everything
2. **NextAuth.js** — Secure authentication
3. **Tickets CRUD API** — Core kanban workflow
4. **Projects CRUD API** — Project management backbone
5. **API-backed search** — Replace mock search with real full-text

Would you like me to start implementing any of these phases?
