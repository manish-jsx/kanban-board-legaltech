import { ProjectsList } from "@/components/projects/projects-list"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <ProjectsList />
      </main>
    </div>
  )
}
