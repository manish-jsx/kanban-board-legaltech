"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ActivityTimelineProps {
  user: User
  limit?: number
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  project?: {
    id: string
    name: string
  }
}

export function ActivityTimeline({ user, limit = 10 }: ActivityTimelineProps) {
  // Mock activities - in a real app, these would come from API
  const mockActivities: Activity[] = [
    {
      id: "act1",
      type: "comment",
      title: "Added a comment",
      description: "I've completed the initial implementation and it's ready for code review.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      project: {
        id: "project-1",
        name: "Website Redesign"
      }
    },
    {
      id: "act2",
      type: "ticket-status",
      title: "Moved ticket to Review",
      description: "Optimize database queries",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      project: {
        id: "project-2",
        name: "Client Portal Development"
      }
    },
    {
      id: "act3",
      type: "ticket-assigned",
      title: "Assigned a ticket",
      description: "Implement user authentication",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      project: {
        id: "project-1",
        name: "Website Redesign"
      }
    },
    {
      id: "act4",
      type: "document",
      title: "Uploaded a document",
      description: "Technical specification document",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      project: {
        id: "project-2",
        name: "Client Portal Development"
      }
    },
    {
      id: "act5",
      type: "meeting",
      title: "Attended a meeting",
      description: "Weekly Team Standup",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    }
  ]

  // Limit the number of activities shown
  const activities = mockActivities.slice(0, limit)

  // Color map for activity types
  const getTypeColor = (type: string) => {
    switch (type) {
      case "comment": return "bg-blue-100 text-blue-800"
      case "ticket-status": return "bg-purple-100 text-purple-800"
      case "ticket-assigned": return "bg-green-100 text-green-800"
      case "document": return "bg-yellow-100 text-yellow-800"
      case "meeting": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.length > 0 ? (
          <div className="relative">
            <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-border" />

            <div className="space-y-8">
              {activities.map((activity) => (
                <div key={activity.id} className="relative pl-10">
                  <div className="absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-background bg-white z-10" />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(activity.type)} variant="secondary">
                          {activity.type.replace('-', ' ')}
                        </Badge>
                        <span className="font-medium">{activity.title}</span>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </time>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

                    {activity.project && (
                      <div className="text-xs text-muted-foreground">
                        Project: {activity.project.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  )
}
