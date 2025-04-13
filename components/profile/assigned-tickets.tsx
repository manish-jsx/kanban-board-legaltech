"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User } from "@/lib/types"
import Link from "next/link"

interface AssignedTicketsProps {
  user: User
  limit?: number
}

interface Ticket {
  id: string
  title: string
  type: string
  priority: string
  dueDate: string
  project: {
    id: string
    name: string
  }
}

export function AssignedTickets({ user, limit = 10 }: AssignedTicketsProps) {
  // Mock tickets - in a real app, these would come from API
  const mockTickets: Ticket[] = [
    {
      id: "ticket-1",
      title: "Implement user authentication",
      type: "feature",
      priority: "high",
      dueDate: "2023-12-15",
      project: {
        id: "project-1",
        name: "Website Redesign"
      }
    },
    {
      id: "ticket-4",
      title: "Fix responsive layout issues",
      type: "bug",
      priority: "high",
      dueDate: "2023-12-08",
      project: {
        id: "project-1",
        name: "Website Redesign"
      }
    },
    {
      id: "ticket-7",
      title: "Set up CI/CD pipeline",
      type: "task",
      priority: "medium",
      dueDate: "2023-12-05",
      project: {
        id: "project-2",
        name: "Client Portal Development"
      }
    },
    {
      id: "ticket-9",
      title: "Implement document upload functionality",
      type: "feature",
      priority: "medium",
      dueDate: "2023-12-18",
      project: {
        id: "project-2",
        name: "Client Portal Development"
      }
    },
    {
      id: "ticket-12",
      title: "Create mobile navigation menu",
      type: "task",
      priority: "low",
      dueDate: "2023-12-22",
      project: {
        id: "project-3",
        name: "Mobile App Launch"
      }
    }
  ]

  // Limit the number of tickets shown
  const tickets = mockTickets.slice(0, limit)

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-orange-100 text-orange-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug": return "bg-red-100 text-red-800"
      case "feature": return "bg-blue-100 text-blue-800"
      case "task": return "bg-purple-100 text-purple-800"
      case "research": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Assigned Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link
                    href={`/projects/${ticket.project.id}?ticket=${ticket.id}`}
                    className="font-medium hover:underline"
                  >
                    {ticket.title}
                  </Link>

                  <div className="flex gap-2">
                    <Badge className={getTypeColor(ticket.type)} variant="secondary">
                      {ticket.type}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Project: {ticket.project.name}
                  </div>

                  <div className={`text-sm ${isOverdue(ticket.dueDate) ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                    Due: {new Date(ticket.dueDate).toLocaleDateString()}
                    {isOverdue(ticket.dueDate) && " (Overdue)"}
                  </div>
                </div>
              </div>
            ))}

            {mockTickets.length > limit && (
              <Button variant="outline" className="w-full">
                View all {mockTickets.length} tickets
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No tickets assigned
          </div>
        )}
      </CardContent>
    </Card>
  )
}
