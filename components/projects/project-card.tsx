"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md cursor-pointer">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{project.name}</h3>
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
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full mt-2">
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
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
