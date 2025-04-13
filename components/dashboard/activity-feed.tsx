"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { users } from "@/lib/initial-data"
import { formatDistanceToNow } from "date-fns"

type Activity = {
  id: string
  user: typeof users[0]
  action: string
  target: string
  targetType: "project" | "ticket" | "meeting" | "article" | "user"
  timestamp: string
}

// Mock activities data
const recentActivities: Activity[] = [
  {
    id: "act-1",
    user: users[0],
    action: "created",
    target: "Website Redesign",
    targetType: "project",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
  },
  {
    id: "act-2",
    user: users[2],
    action: "completed",
    target: "Design landing page mockups",
    targetType: "ticket",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
  },
  {
    id: "act-3",
    user: users[1],
    action: "scheduled",
    target: "Website Redesign Planning",
    targetType: "meeting",
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString() // 5 hours ago
  },
  {
    id: "act-4",
    user: users[4],
    action: "published",
    target: "Using AI for Case Research",
    targetType: "article",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString() // 1 day ago
  },
  {
    id: "act-5",
    user: users[3],
    action: "moved",
    target: "Optimize database queries",
    targetType: "ticket",
    timestamp: new Date(Date.now() - 28 * 3600000).toISOString() // 28 hours ago
  },
  {
    id: "act-6",
    user: users[0],
    action: "invited",
    target: "Michael Brown",
    targetType: "user",
    timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString() // 2 days ago
  },
]

export function ActivityFeed() {
  const [filter, setFilter] = useState("all")

  const filteredActivities = filter === "all"
    ? recentActivities
    : recentActivities.filter(activity => activity.targetType === filter)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="ticket">Tickets</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1 py-0 h-4 capitalize"
                  >
                    {activity.targetType}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No recent activity
          </div>
        )}
        <Button variant="ghost" className="w-full text-sm" size="sm">
          View all activity
        </Button>
      </CardContent>
    </Card>
  )
}
