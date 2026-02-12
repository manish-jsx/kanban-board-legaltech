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
import { CalendarDays, Loader2, Video, CheckCircle2, AlertCircle } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { users } from "@/lib/initial-data"
import type { Meeting, User } from "@/lib/types"
import { EmailService } from "@/lib/email/email-service"
import { toast } from "sonner"

interface ScheduleMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMeetingSchedule?: (meeting: Meeting) => void
}

export function ScheduleMeetingDialog({
  open,
  onOpenChange,
  onMeetingSchedule
}: ScheduleMeetingDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [attendees, setAttendees] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const currentUser = users[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const startDateTime = new Date(`${date}T${startTime}`).toISOString()
    const endDateTime = new Date(`${date}T${endTime}`).toISOString()

    const meetLink = `https://meet.google.com/${generateRandomString(3)}-${generateRandomString(4)}-${generateRandomString(3)}`

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      organizer: currentUser,
      attendees: [currentUser, ...attendees.filter(a => a.id !== currentUser.id)],
      meetLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Send meeting invites via Resend
    const attendeeEmails = attendees.map(a => a.email)
    if (attendeeEmails.length > 0) {
      try {
        const formattedDate = new Date(`${date}T${startTime}`).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        const result = await EmailService.sendMeetingInvite({
          to: attendeeEmails,
          attendeeName: "Team",
          organizerName: currentUser.name,
          meetingTitle: title,
          meetingDescription: description,
          date: formattedDate,
          startTime,
          endTime,
          meetLink,
          attendees: [currentUser.name, ...attendees.map(a => a.name)],
        })

        if (result.success) {
          toast.success("Meeting scheduled!", {
            description: `Invites sent to ${attendeeEmails.length} attendee${attendeeEmails.length > 1 ? 's' : ''}`,
            icon: <CheckCircle2 className="h-4 w-4" />,
          })
        } else {
          toast.warning("Meeting created (emails not sent)", {
            description: "Check your Resend API key",
            icon: <AlertCircle className="h-4 w-4" />,
          })
        }
      } catch {
        toast.warning("Meeting created (emails not sent)", {
          description: "Email delivery failed",
          icon: <AlertCircle className="h-4 w-4" />,
        })
      }
    } else {
      toast.success("Meeting scheduled!", {
        description: "No attendees selected for email invites",
      })
    }

    if (onMeetingSchedule) {
      onMeetingSchedule(newMeeting)
    }

    // Reset form
    setTitle("")
    setDescription("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setAttendees([])
    setIsLoading(false)
    onOpenChange(false)
  }

  const generateRandomString = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
                <Video className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              Schedule Meeting
            </DialogTitle>
            <DialogDescription>
              Create a Google Meet meeting and send email invitations to attendees.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly Team Standup"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Discuss progress on active projects..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">Invite Attendees (email invites will be sent)</Label>
              <MultiSelect
                options={users.map(user => ({
                  label: user.name,
                  value: user.id,
                  user: user
                }))}
                placeholder="Select attendees"
                selected={attendees}
                onChange={newAttendees => setAttendees(newAttendees)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Schedule & Send Invites
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
