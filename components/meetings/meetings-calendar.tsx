"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Video, Users, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScheduleMeetingDialog } from "./schedule-meeting-dialog"
import { initialMeetings } from "@/lib/initial-data"
import type { Meeting } from "@/lib/types"

export function MeetingsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [meetingsList, setMeetingsList] = useState(initialMeetings)

  const handleScheduleMeeting = (newMeeting: Meeting) => {
    setMeetingsList([...meetingsList, newMeeting])
  }

  // Filter meetings for the selected date
  const filteredMeetings = date
    ? meetingsList.filter(meeting => {
      const meetingDate = new Date(meeting.startTime)
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      )
    })
    : []

  // Sort meetings by time
  const sortedMeetings = [...filteredMeetings].sort((a, b) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">Schedule and join meetings with your team</p>
        </div>
        <Button onClick={() => setIsScheduleOpen(true)} className="bg-[#2962FF] hover:bg-[#2962FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">
                {date ? (
                  <>
                    <CalendarIcon className="inline-block h-4 w-4 mr-1 mb-0.5" />
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </>
                ) : (
                  "Select a date"
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {sortedMeetings.length} {sortedMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {date && sortedMeetings.length > 0
              ? "Scheduled Meetings"
              : sortedMeetings.length === 0 && date
                ? "No meetings scheduled for this day"
                : "Select a date to view meetings"}
          </h2>

          {sortedMeetings.map((meeting) => {
            const startTime = new Date(meeting.startTime)
            const endTime = new Date(meeting.endTime)
            const formattedStartTime = startTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })
            const formattedEndTime = endTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })

            return (
              <Card key={meeting.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr]">
                    <div className="bg-muted p-4 flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold">{formattedStartTime}</p>
                      <p className="text-sm text-muted-foreground">to {formattedEndTime}</p>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Video className="mr-1 h-3 w-3" />
                            Google Meet
                          </Badge>
                          <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Join meeting
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex -space-x-2 mr-1">
                            {meeting.attendees.slice(0, 3).map((attendee) => (
                              <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                                <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {meeting.attendees.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                +{meeting.attendees.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {meeting.attendees.length} attendees
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <ScheduleMeetingDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        onMeetingSchedule={handleScheduleMeeting}
      />
    </div>
  )
}
