"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { initialProjects } from "@/lib/initial-data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ProjectsOverview() {
  // Only display first 3 projects
  const projects = initialProjects.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Active Projects</CardTitle>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-1">
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => {
              // Mock progress calculation (in a real app, this would be derived from tickets)
              const progress = Math.floor(Math.random() * 100)

              return (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{project.name}</div>
                      <Badge
                        variant="outline"
                        className={
                          project.status === "active" ? "bg-green-100 text-green-800" :
                            project.status === "completed" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                        }
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex -space-x-2">
                      {project.teamMembers.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs font-medium">{progress}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No active projects
          </div>
        )}
      </CardContent>
    </Card>
  )
}
