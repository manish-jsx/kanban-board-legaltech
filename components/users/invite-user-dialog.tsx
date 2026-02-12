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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/lib/types"
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react"
import { EmailService } from "@/lib/email/email-service"
import { toast } from "sonner"

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserInvite?: (user: User) => void
}

export function InviteUserDialog({ open, onOpenChange, onUserInvite }: InviteUserDialogProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("engineer")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const fullName = `${firstName} ${lastName}`

    // Create a new user object
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: fullName,
      email,
      role,
      status: "pending",
      lastActive: "Just now",
      avatar: `/placeholder.svg?height=40&width=40`,
    }

    try {
      // Send invitation email via Resend
      const result = await EmailService.sendTeamInvite({
        to: email,
        inviteeName: fullName,
        inviterName: "John Doe",
        teamName: "Cengineers Legal Team",
        role: role.charAt(0).toUpperCase() + role.slice(1),
      })

      if (result.success) {
        toast.success("Invitation sent!", {
          description: `An invite email has been sent to ${email}`,
          icon: <CheckCircle2 className="h-4 w-4" />,
        })
      } else {
        // Still add user locally even if email fails
        toast.warning("User added (email not sent)", {
          description: "The team member was added but the invite email could not be sent. Check your Resend API key.",
          icon: <AlertCircle className="h-4 w-4" />,
        })
      }
    } catch (error) {
      toast.warning("User added (email not sent)", {
        description: "The team member was added but the invite email could not be delivered.",
        icon: <AlertCircle className="h-4 w-4" />,
      })
    }

    // Add user to local state regardless
    if (onUserInvite) {
      onUserInvite(newUser)
    }

    // Reset form
    setFirstName("")
    setLastName("")
    setEmail("")
    setRole("engineer")
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new member to your team. They'll receive a
              beautifully designed email with a link to join.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invite...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
