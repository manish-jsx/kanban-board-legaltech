"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { ActivityTimeline } from "@/components/profile/activity-timeline"
import { AssignedTickets } from "@/components/profile/assigned-tickets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { users } from "@/lib/initial-data"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from "@/lib/types"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading current user data
    setTimeout(() => {
      // Use the first user from our mock data as the current user
      setUser(users[0])
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 pt-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <ProfileHeader user={user!} />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="tickets">Assigned Tickets</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ProfileStats user={user!} />
              <AssignedTickets user={user!} limit={5} />
              <ActivityTimeline user={user!} limit={5} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTimeline user={user!} limit={20} />
            </TabsContent>

            <TabsContent value="tickets">
              <AssignedTickets user={user!} limit={20} />
            </TabsContent>

            <TabsContent value="settings">
              <ProfileSettings user={user!} onSave={(updatedUser) => setUser(updatedUser)} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
