import { KnowledgeBase } from "@/components/knowledge/knowledge-base"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function KnowledgeBasePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <KnowledgeBase />
      </main>
    </div>
  )
}
