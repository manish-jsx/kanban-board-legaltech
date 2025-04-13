"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, BookOpen, Search, PanelLeft, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { CreateTicketDialog } from "@/components/kanban/create-ticket-dialog"
import { ScheduleMeetingDialog } from "@/components/meetings/schedule-meeting-dialog"
import { useState } from "react"

export function QuickActions() {
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false)

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-1 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => setIsCreateTicketOpen(true)}
          >
            <PanelLeft className="h-5 w-5 mb-1" />
            <span>Create Ticket</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-1 hover:bg-purple-50 hover:text-purple-700"
            onClick={() => setIsScheduleMeetingOpen(true)}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span>Schedule Meeting</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-1 hover:bg-green-50 hover:text-green-700"
            asChild
          >
            <Link href="/projects">
              <LayoutGrid className="h-5 w-5 mb-1" />
              <span>View Projects</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-1 hover:bg-yellow-50 hover:text-yellow-700"
            asChild
          >
            <Link href="/knowledge">
              <BookOpen className="h-5 w-5 mb-1" />
              <span>Knowledge Base</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-1 hover:bg-pink-50 hover:text-pink-700"
            asChild
          >
            <Link href="/users">
              <Users className="h-5 w-5 mb-1" />
              <span>Team Members</span>
            </Link>
          </Button>
        </div>

        <CreateTicketDialog
          open={isCreateTicketOpen}
          onOpenChange={setIsCreateTicketOpen}
        />

        <ScheduleMeetingDialog
          open={isScheduleMeetingOpen}
          onOpenChange={setIsScheduleMeetingOpen}
        />
      </CardContent>
    </Card>
  )
}
