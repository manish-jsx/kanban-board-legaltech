import { KanbanBoard } from "@/components/kanban/kanban-board"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function HomePage() {
  // In a real app, we would check authentication here
  // For demo purposes, we'll just show the board
  // const session = await getSession();
  // if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <KanbanBoard />
      </main>
    </div>
  )
}
