"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Settings, MoreHorizontal, Mail, Calendar } from "lucide-react"
import { User } from "@/lib/types"
import Link from "next/link"

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager":
        return "bg-purple-100 text-purple-800"
      case "engineer":
        return "bg-blue-100 text-blue-800"
      case "designer":
        return "bg-pink-100 text-pink-800"
      case "researcher":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 md:flex-row md:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <Badge className={getRoleBadgeColor(user.role)}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>

          <div className="text-muted-foreground">{user.email}</div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="capitalize">{user.status}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last active: {user.lastActive}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Mail className="h-4 w-4" />
          <span>Message</span>
        </Button>

        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span>Schedule</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
