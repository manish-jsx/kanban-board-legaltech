import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MeetingsCalendar } from "@/components/meetings/meetings-calendar"

export default function MeetingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <MeetingsCalendar />
      </main>
    </div>
  )
}
