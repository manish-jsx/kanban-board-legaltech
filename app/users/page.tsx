import { UserManagement } from "@/components/users/user-management"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function UsersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <UserManagement />
      </main>
    </div>
  )
}
