"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Notification, notificationService } from "@/lib/services/notification-service"
import { formatDistanceToNow } from "date-fns"
import { users } from "@/lib/initial-data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // For demo purposes, we'll use the first user as the current user
  const currentUserId = users[0].id

  useEffect(() => {
    // Get notifications for the current user
    const userNotifications = notificationService.getUserNotifications(currentUserId)
    setNotifications(userNotifications)

    // Count unread notifications
    const count = userNotifications.filter(n => !n.readAt).length
    setUnreadCount(count)

    // Add some demo notifications if there aren't any
    if (userNotifications.length === 0) {
      addDemoNotifications()
    }
  }, [currentUserId])

  const addDemoNotifications = async () => {
    // Add some demo notifications
    await notificationService.notify(
      users[0],
      "ticket_assigned",
      {
        title: "Implement user authentication",
        ticketId: "ticket-1",
        projectId: "project-1",
        priority: "high",
        dueDate: "2023-12-15",
        user: users[0],
        assignedBy: users[1]
      }
    )

    await notificationService.notify(
      users[0],
      "meeting_scheduled",
      {
        title: "Website Redesign Planning",
        organizer: users[1],
      }
    )

    await notificationService.notify(
      users[0],
      "project_created",
      {
        projectName: "Mobile App Launch",
        projectId: "project-3",
        createdBy: users[2]
      }
    )

    // Update state
    const updatedNotifications = notificationService.getUserNotifications(currentUserId)
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.length)
  }

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)

    // Update state
    const updatedNotifications = notificationService.getUserNotifications(currentUserId)
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter(n => !n.readAt).length)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead(currentUserId)

    // Update state
    const updatedNotifications = notificationService.getUserNotifications(currentUserId)
    setNotifications(updatedNotifications)
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1 px-2"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 ${!notification.readAt ? 'bg-muted/50' : ''} cursor-default`}
              >
                <div className="flex w-full justify-between items-start">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <time className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </time>
                </div>

                <p className="text-sm text-muted-foreground">{notification.message}</p>

                <div className="flex justify-between items-center w-full mt-2">
                  {!notification.readAt && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">New</Badge>
                  )}

                  <div className="flex gap-2 ml-auto">
                    {!notification.readAt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-auto py-1 px-2"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}

                    {notification.linkTo && (
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs h-auto py-1 px-2"
                        asChild
                      >
                        <Link href={notification.linkTo}>
                          View
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-blue-600 font-medium cursor-pointer">
          <Link href="/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
