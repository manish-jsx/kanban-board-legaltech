"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { users } from "@/lib/initial-data"
import type { User } from "@/lib/types"
import { InviteUserDialog } from "./invite-user-dialog"

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [usersList, setUsersList] = useState(users)

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInviteUser = (newUser: User) => {
    setUsersList([...usersList, newUser])
  }

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)} className="bg-[#2962FF] hover:bg-[#2962FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)} variant="secondary">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span className="capitalize">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit user</DropdownMenuItem>
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Deactivate user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InviteUserDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} onUserInvite={handleInviteUser} />
    </div>
  )
}
