"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types"
import { Paperclip, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TicketDetailsDialogProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketDetailsDialog({ ticket, open, onOpenChange }: TicketDetailsDialogProps) {
  const [comment, setComment] = useState("")

  if (!ticket) return null

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug":
        return "bg-red-100 text-red-800"
      case "feature":
        return "bg-blue-100 text-blue-800"
      case "task":
        return "bg-purple-100 text-purple-800"
      case "research":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddComment = () => {
    if (!comment.trim()) return
    // In a real app, we would update the ticket with the new comment
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getTypeColor(ticket.type)} variant="secondary">
              {ticket.type}
            </Badge>
            <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
              {ticket.priority}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{ticket.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p>{ticket.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignee</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.assignee.avatar || "/placeholder.svg"} alt={ticket.assignee.name} />
                    <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{ticket.assignee.name}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                <p>{new Date(ticket.dueDate).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Created</h3>
                <p>{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Updated</h3>
                <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
              {ticket.attachments.length > 0 ? (
                <div className="space-y-2">
                  {ticket.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <span>{attachment.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No attachments</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4 pt-4">
            <div className="space-y-4">
              {ticket.comments.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No comments yet</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    className="bg-[#2962FF] hover:bg-[#2962FF]/90"
                    disabled={!comment.trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                  <span className="text-xs">C</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">System</span>
                    <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <p>Ticket created</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                  <span className="text-xs">A</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">System</span>
                    <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <p>Assigned to {ticket.assignee.name}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
