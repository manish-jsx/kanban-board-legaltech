"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initialMeetings } from "@/lib/initial-data"
import Link from "next/link"
import { Video, ArrowRight } from "lucide-react"
import { format, isToday, isTomorrow } from "date-fns"

export function UpcomingMeetings() {
  // Sort meetings by date and take only the next 3
  const meetings = [...initialMeetings]
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle>
        <Link href="/meetings">
          <Button variant="ghost" size="sm" className="gap-1">
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map((meeting) => {
              const meetingDate = new Date(meeting.startTime)
              let dateLabel = format(meetingDate, 'MMM d')

              if (isToday(meetingDate)) {
                dateLabel = "Today"
              } else if (isTomorrow(meetingDate)) {
                dateLabel = "Tomorrow"
              }

              const timeLabel = format(meetingDate, 'h:mm a')

              return (
                <div key={meeting.id} className="flex flex-col gap-2 p-3 rounded-md border">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{meeting.title}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700">
                          {dateLabel} at {timeLabel}
                        </Badge>
                      </div>
                    </div>
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Video className="h-3 w-3" />
                      <span className="text-xs">Join</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={meeting.organizer.avatar || "/placeholder.svg"} alt={meeting.organizer.name} />
                      <AvatarFallback>{meeting.organizer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {meeting.attendees.length} attendees
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No upcoming meetings
          </div>
        )}
      </CardContent>
    </Card>
  )
}
