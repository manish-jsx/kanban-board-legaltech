"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User } from "@/lib/types"
import {
  BarChart,
  CheckSquare,
  Clock,
  FileText,
  MessageSquare,
  Users
} from "lucide-react"

interface ProfileStatsProps {
  user: User
}

export function ProfileStats({ user }: ProfileStatsProps) {
  // In a real app, these stats would come from API calls
  // For demo purposes, using mock data
  const stats = [
    {
      title: "Completed Tickets",
      value: "32",
      description: "Last 30 days",
      icon: CheckSquare,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Active Projects",
      value: "5",
      description: "Currently working on",
      icon: FileText,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Comments",
      value: "148",
      description: "Total contributions",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-800"
    },
    {
      title: "Team Collaboration",
      value: "12",
      description: "Members worked with",
      icon: Users,
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Activity Rate",
      value: "93%",
      description: "Above average",
      icon: BarChart,
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      title: "Avg. Response Time",
      value: "2h 14m",
      description: "To assigned tickets",
      icon: Clock,
      color: "bg-pink-100 text-pink-800"
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <CardDescription>{stat.description}</CardDescription>
                </div>
                <div className={`p-2 rounded-md ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
