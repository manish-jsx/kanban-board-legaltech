import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { RecentKnowledgeArticles } from "@/components/dashboard/recent-knowledge-articles"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        {/* Brand Hero Section */}
        <section className="mb-8">
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 shadow-md">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold mb-2">Cengineers Kanban</h1>
              <p className="text-lg opacity-90 mb-6">
                Streamline your legal team's workflow with powerful project management,
                knowledge sharing, and collaboration tools.
              </p>
              <GlobalSearch />
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <ProjectsOverview />
            <RecentKnowledgeArticles />
          </div>
          <div className="space-y-6">
            <UpcomingMeetings />
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  )
}
