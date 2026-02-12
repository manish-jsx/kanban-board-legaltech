"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { RecentKnowledgeArticles } from "@/components/dashboard/recent-knowledge-articles"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl gradient-bg text-white p-8 md:p-10 shadow-xl">
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 dot-pattern opacity-50" />
            {/* Gradient accent circles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Legal Team Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-lg opacity-90 mb-6 max-w-xl leading-relaxed">
                Streamline your legal team&apos;s workflow with powerful project management,
                knowledge sharing, and collaboration tools.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="max-w-md flex-1">
                  <GlobalSearch />
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
                  <span className="opacity-70">Role:</span>
                  <span className="font-semibold">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Analytics Charts */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <DashboardCharts />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <QuickActions />
            </motion.div>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <ProjectsOverview />
            </motion.div>
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <RecentKnowledgeArticles />
            </motion.div>
          </div>
          <div className="space-y-6">
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <UpcomingMeetings />
            </motion.div>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <ActivityFeed />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
