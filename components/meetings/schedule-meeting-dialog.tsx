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
import type { Meeting, User } from "@/lib/types"

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

  // Add the current user as the organizer by default
  const currentUser = users[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Combine date and time strings into ISO strings
    const startDateTime = new Date(`${date}T${startTime}`).toISOString()
    const endDateTime = new Date(`${date}T${endTime}`).toISOString()

    // Generate a mock Google Meet link
    const meetLink = `https://meet.google.com/${generateRandomString(3)}-${generateRandomString(4)}-${generateRandomString(3)}`

    // Create a new meeting
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
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

      onOpenChange(false)
    }, 1000)
  }

  // Helper function to generate random string for Meet links
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
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>Create a new Google Meet meeting and invite team members.</DialogDescription>
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
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendees" className="text-right">
                Attendees
              </Label>
              <div className="col-span-3">
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#2962FF] hover:bg-[#2962FF]/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Meeting"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
