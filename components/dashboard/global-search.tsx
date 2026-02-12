"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search, FileText, Ticket, CalendarDays, Users, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type SearchResult = {
  id: string
  title: string
  type: "project" | "ticket" | "meeting" | "article" | "user"
  url: string
  icon: React.ElementType
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut to open search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault()

        // Check window width to decide which search to open
        if (window.innerWidth < 768) {
          setMobileOpen(true)
        } else {
          setOpen(true)
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Focus input when popover/dialog opens
  useEffect(() => {
    if ((open || mobileOpen) && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, mobileOpen])

  // Real API search with debounce
  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true)

      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`)
          const data = await res.json()

          const iconMap: Record<string, React.ElementType> = {
            project: FileText,
            ticket: Ticket,
            meeting: CalendarDays,
            article: FileText,
            user: Users,
          }

          const mappedResults: SearchResult[] = (data.results || []).map((r: any) => ({
            id: r.id,
            title: r.title,
            type: r.type,
            url: r.url,
            icon: iconMap[r.type] || FileText,
            subtitle: r.subtitle,
          }))

          setResults(mappedResults)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  const handleSelect = (item: SearchResult) => {
    setOpen(false)
    setMobileOpen(false)
    router.push(item.url)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project": return "bg-blue-100 text-blue-800"
      case "ticket": return "bg-purple-100 text-purple-800"
      case "meeting": return "bg-green-100 text-green-800"
      case "article": return "bg-yellow-100 text-yellow-800"
      case "user": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Search content to render in both popover and dialog
  const SearchContent = (
    <Command className="rounded-lg border shadow-md">
      <div className="flex items-center border-b px-3">
        <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
        <CommandInput
          ref={inputRef}
          placeholder="Search across all resources..."
          value={query}
          onValueChange={setQuery}
          className="flex-1 py-3 outline-none"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuery("")}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <CommandList>
        {isLoading && (
          <div className="py-6 text-center text-sm">
            <div className="animate-pulse">Searching...</div>
          </div>
        )}
        {!isLoading && query && !results.length && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!isLoading && !query && (
          <div className="py-4 px-2 text-center text-sm text-muted-foreground">
            Start typing to search across projects, tickets, meetings, articles, and users...
          </div>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => handleSelect(item)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("p-1 rounded", getTypeColor(item.type))}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <span>{item.title}</span>
                </div>
                <span className="ml-auto text-xs capitalize text-muted-foreground">
                  {item.type}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )

  return (
    <>
      {/* Desktop search - popover */}
      <div className="relative w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-white/90 dark:bg-gray-800/90 border-white/20 text-left font-normal"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-4 w-4" />
                <span className="line-clamp-1">Search...</span>
              </div>
              <div className="hidden md:flex items-center text-xs text-muted-foreground rounded border px-1.5 py-0.5">
                <span className="text-xs">⌘K</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[calc(100vw-2rem)] max-w-lg" align="start">
            {SearchContent}
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile search - full dialog */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          {SearchContent}
        </DialogContent>
      </Dialog>
    </>
  )
}
