"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { users } from "@/lib/initial-data"
import type { Project, User } from "@/lib/types"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreate?: (project: Project) => void
}

export function CreateProjectDialog({ open, onOpenChange, onProjectCreate }: CreateProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Create a new project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      description,
      status: "active",
      teamMembers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (onProjectCreate) {
        onProjectCreate(newProject)
      }

      // Reset form
      setName("")
      setDescription("")
      setTeamMembers([])

      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Create a new project for your team to work on.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-members" className="text-right">
                Team Members
              </Label>
              <div className="col-span-3">
                <MultiSelect
                  options={users.map(user => ({
                    label: user.name,
                    value: user.id,
                    user: user
                  }))}
                  placeholder="Select team members"
                  selected={teamMembers}
                  onChange={newMembers => setTeamMembers(newMembers)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2962FF] hover:bg-[#2962FF]/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
