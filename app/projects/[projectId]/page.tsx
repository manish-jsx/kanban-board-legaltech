"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectKanbanBoard } from "@/components/projects/project-kanban-board"
import { ProjectHeader } from "@/components/projects/project-header"
import { initialProjects } from "@/lib/initial-data"
import type { Project } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch project data
    setTimeout(() => {
      const foundProject = initialProjects.find(p => p.id === params.projectId)
      if (foundProject) {
        setProject(foundProject)
      }
      setLoading(false)
    }, 500)
  }, [params.projectId])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        {loading ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : project ? (
          <>
            <ProjectHeader project={project} />
            <div className="mt-6">
              <ProjectKanbanBoard projectId={project.id} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Project not found</h2>
              <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
