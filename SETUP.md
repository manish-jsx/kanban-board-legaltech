# 🚀 Cengineers Kanban — Backend Setup Guide

## Prerequisites
- Node.js 18+
- A [Neon.tech](https://neon.tech) PostgreSQL database (free tier available)

---

## 1. Set Up Neon.tech Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (any region)
3. Copy the connection string from the dashboard

## 2. Configure Environment Variables

Edit `.env` and `.env.local` with your Neon.tech connection string:

```bash
# .env (used by Prisma)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require"
DIRECT_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require"

# .env.local (used by Next.js)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require"
DIRECT_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require"
JWT_SECRET=your-custom-secret-here
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Push Schema & Seed Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Neon.tech (creates all tables)
npm run db:push

# Seed the database with demo data
npm run db:seed
```

## 4. Start Development Server

```bash
npm run dev
```

## 5. Login with Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@cengineers.com | Admin@2026 |
| **Manager** | john.doe@cengineers.com | Manager@2026 |
| **Engineer** | jane.smith@cengineers.com | Engineer@2026 |
| **Designer** | bob.wilson@cengineers.com | Designer@2026 |
| **Researcher** | alice.chen@cengineers.com | Researcher@2026 |

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run db:reset` | Reset DB + reseed |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run build` | Production build |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/session` | Check current session |
| POST | `/api/auth/logout` | Logout (clear cookie) |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List with filters (project, priority, type, assignee, search) |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/[id]` | Get single ticket |
| PUT | `/api/tickets/[id]` | Update ticket (drag-and-drop column move) |
| DELETE | `/api/tickets/[id]` | Delete ticket |
| POST | `/api/tickets/[id]/comments` | Add comment |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects with stats |
| POST | `/api/projects` | Create project (auto-creates board with 4 columns) |
| GET | `/api/projects/[id]` | Get project with full board |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=query` | Full-text search across all entities |
| | | Supports `type` filter: ticket, project, article, user, meeting |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | All stats, charts data, recent activity |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/meetings` | List/create meetings |
| GET/POST | `/api/articles` | List/create knowledge articles |
| GET/POST | `/api/users` | List/create users |
| GET/PUT | `/api/notifications` | List/mark read notifications |
| POST | `/api/send-email` | Send email via Resend |

---

## Architecture

```
├── prisma/
│   ├── schema.prisma        # Database schema (PostgreSQL)
│   └── seed.ts              # Demo data seeder
├── lib/
│   ├── db.ts                # Prisma client singleton
│   ├── auth.ts              # JWT auth + role-based permissions
│   ├── auth-context.tsx     # Client-side auth context (useAuth hook)
│   └── api-middleware.ts    # API auth middleware
├── app/api/
│   ├── auth/                # Login, session, logout
│   ├── tickets/             # CRUD + comments
│   ├── projects/            # CRUD with auto board creation
│   ├── search/              # Full-text search
│   ├── dashboard/stats/     # Analytics & charts data
│   ├── meetings/            # Meetings API
│   ├── articles/            # Knowledge base API
│   ├── users/               # User management API
│   └── notifications/       # Notification API
└── components/
    ├── dashboard/
    │   └── dashboard-charts.tsx  # Recharts visualizations
    ├── kanban/
    │   └── board-filters.tsx     # Filter bar + view toggle
    └── ui/
        └── rich-text-editor.tsx  # TipTap WYSIWYG editor
```
