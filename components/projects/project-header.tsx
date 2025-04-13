"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarDays,
  MoreHorizontal,
  Users,
  Edit,
  Archive,
  Trash2
} from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
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
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Project actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Created on {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex -space-x-2 mr-2">
            {project.teamMembers.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.teamMembers.length > 5 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{project.teamMembers.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
