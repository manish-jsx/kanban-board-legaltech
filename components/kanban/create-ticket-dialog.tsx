"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Ticket, User } from "@/lib/types"
import { Loader2, Wand2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { users } from "@/lib/initial-data"
import { Card } from "@/components/ui/card"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTicketCreate?: (ticket: Ticket) => void
}

export function CreateTicketDialog({ open, onOpenChange, onTicketCreate }: CreateTicketDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("task")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [assignee, setAssignee] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Create a new ticket
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      title,
      description,
      type,
      priority,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      assignee: assignee || users[0],
      comments: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (onTicketCreate) {
        onTicketCreate(newTicket)
      }

      // Reset form
      setTitle("")
      setDescription("")
      setType("task")
      setPriority("medium")
      setDueDate("")
      setAssignee(null)
      setShowAiSuggestions(false)
      setSuggestedUsers([])

      onOpenChange(false)
    }, 1000)
  }

  const handleAiSuggest = () => {
    if (!title || !description) return

    setAiLoading(true)
    setShowAiSuggestions(true)

    // Simulate AI processing
    setTimeout(() => {
      // Mock AI suggestion logic based on ticket content
      let suggestedUsersList: User[] = []

      const titleLower = title.toLowerCase()
      const descLower = description.toLowerCase()

      // Simple keyword matching for demo purposes
      if (
        titleLower.includes("design") ||
        descLower.includes("design") ||
        titleLower.includes("ui") ||
        descLower.includes("ui") ||
        titleLower.includes("ux") ||
        descLower.includes("ux")
      ) {
        suggestedUsersList = users.filter((u) => u.role === "designer")
      } else if (
        titleLower.includes("research") ||
        descLower.includes("research") ||
        titleLower.includes("study") ||
        descLower.includes("study")
      ) {
        suggestedUsersList = users.filter((u) => u.role === "researcher")
      } else if (
        titleLower.includes("bug") ||
        descLower.includes("bug") ||
        titleLower.includes("fix") ||
        descLower.includes("fix") ||
        titleLower.includes("code") ||
        descLower.includes("code")
      ) {
        suggestedUsersList = users.filter((u) => u.role === "engineer")
      } else {
        // Default to a mix of users
        suggestedUsersList = users.slice(0, 3)
      }

      setSuggestedUsers(suggestedUsersList)
      setAiLoading(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Fill in the details to create a new ticket for your team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right pt-2">
                <Label htmlFor="assignee">Assignee</Label>
              </div>
              <div className="col-span-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No assignee selected</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1 text-[#26A69A]"
                    onClick={handleAiSuggest}
                    disabled={!title || !description || aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>Suggest Assignee</span>
                      </>
                    )}
                  </Button>
                </div>

                {showAiSuggestions && !aiLoading && (
                  <div className="border rounded-md p-3 bg-muted/50">
                    <p className="text-sm font-medium mb-2">AI Suggested Assignees:</p>
                    <div className="space-y-2">
                      {suggestedUsers.map((user) => (
                        <Card
                          key={user.id}
                          className={`p-2 cursor-pointer hover:bg-muted ${
                            assignee?.id === user.id ? "border-[#26A69A] bg-[#26A69A]/10" : ""
                          }`}
                          onClick={() => setAssignee(user)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#26A69A] hover:bg-[#26A69A]/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
