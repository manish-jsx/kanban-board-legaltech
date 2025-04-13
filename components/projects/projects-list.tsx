"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { initialProjects } from "@/lib/initial-data"
import type { Project } from "@/lib/types"

export function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [projectsList, setProjectsList] = useState(initialProjects)

  const filteredProjects = projectsList.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProject = (newProject: Project) => {
    setProjectsList([...projectsList, newProject])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your team's projects and track progress</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-[#2962FF] hover:bg-[#2962FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onProjectCreate={handleCreateProject}
      />
    </div>
  )
}
