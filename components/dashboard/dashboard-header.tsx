"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Plus, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CreateTicketDialog } from "@/components/kanban/create-ticket-dialog"
import { useState } from "react"

export function DashboardHeader() {
  const pathname = usePathname()
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className={`flex items-center gap-2 text-lg font-semibold ${pathname === "/" ? "text-[#2962FF]" : ""}`}
            >
              <div className="h-8 w-8 rounded-full bg-[#2962FF]"></div>
              <span>Cengineers Kanban</span>
            </Link>
            <Link href="/" className={`flex items-center gap-2 ${pathname === "/" ? "text-[#2962FF]" : ""}`}>
              <span>Dashboard</span>
            </Link>
            <Link href="/users" className={`flex items-center gap-2 ${pathname === "/users" ? "text-[#2962FF]" : ""}`}>
              <span>Users</span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:hidden">
          <div className="h-8 w-8 rounded-full bg-[#2962FF]"></div>
        </Link>
        <Link href="/" className="hidden items-center gap-2 text-lg font-semibold md:flex">
          <div className="h-8 w-8 rounded-full bg-[#2962FF]"></div>
          <span>Cengineers Kanban</span>
        </Link>
      </div>
      <nav className="hidden gap-6 md:flex">
        <Link href="/" className={`text-sm font-medium ${pathname === "/" ? "text-[#2962FF]" : ""}`}>
          Dashboard
        </Link>
        <Link href="/users" className={`text-sm font-medium ${pathname === "/users" ? "text-[#2962FF]" : ""}`}>
          Users
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" className="text-muted-foreground" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="text-muted-foreground" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setIsCreateTicketOpen(true)}
          className="hidden bg-[#26A69A] hover:bg-[#26A69A]/90 md:flex"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CreateTicketDialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen} />
    </header>
  )
}
