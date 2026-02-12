# 🚀 Deployment Checklist

Your application is fully configured and ready for production!

## 1. Push Code to GitHub

```bash
git add .
git commit -m "feat: complete backend setup with Neon.tech, Prisma, and Resend"
git push origin main
```

## 2. Deploy on Vercel (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository (`kanban-board-legaltech`)
3. **Environment Variables**: Add these in the "Environment Variables" section:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_BMLTNX4GFxa7@ep-royal-dream-ai879i8x-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_DATABASE_URL` | `postgresql://neondb_owner:npg_BMLTNX4GFxa7@ep-royal-dream-ai879i8x.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `cengineers-kanban-secret-key-2026-change-in-production` (or generate a new random string) |
| `RESEND_API_KEY` | `re_aJsaynXN_C4Vhx45FxRN22ThBFdmddAGV` |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain email) |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` (update after deployment) |

4. Click **Deploy**!

## 3. Post-Deployment Verification

1. **Database Migration**: Vercel handles the build, but you should verify migrations ran. Check `Build Logs`.
2. **Seed Data**: If you want the demo data in production, run this locally against the prod DB (which you already did) or add `npx prisma db seed` to your build command (not recommended for production usually).
   - Since we already seeded the remote Neon database, your deployed app will have data immediately! 🎉

## 4. Test Production Features

- **Login**: Use the demo credentials (e.g., `admin@cengineers.com` / `Admin@2026`)
- **Email**: Trigger an action like creating a ticket to test real email sending
- **Search**: Try searching for "marketing" or "legal" to test full-text search

---

**You're all set!** verify everything works locally first with `npm run dev`.
