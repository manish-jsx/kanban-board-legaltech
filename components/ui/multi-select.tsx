"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type OptionType = {
  label: string
  value: string
  user?: any
  [key: string]: any
}

interface MultiSelectProps {
  options: OptionType[]
  placeholder?: string
  selected: any[]
  onChange: (selected: any[]) => void
}

export function MultiSelect({
  options,
  placeholder = "Select options...",
  selected,
  onChange
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (option: any) => {
    onChange(selected.filter(s => s.id !== option.id))
  }

  const handleSelect = (value: string) => {
    const option = options.find(opt => opt.value === value)
    if (option && !selected.some(s => s.id === option.user.id)) {
      onChange([...selected, option.user])
    }
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          const newSelected = [...selected]
          newSelected.pop()
          onChange(newSelected)
        }
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
  }

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm rounded-md flex flex-wrap gap-1 min-h-10">
        {selected.map((option) => (
          <Badge key={option.id} variant="secondary" className="flex gap-1 items-center">
            {option.name}
            <button
              type="button"
              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => handleUnselect(option)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {option.name}</span>
            </button>
          </Badge>
        ))}
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : undefined}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] ml-1"
        />
      </div>
      <div className="relative mt-1">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-52">
              {options
                .filter(option => !selected.some(s => s.id === option.user.id))
                .map(option => (
                  <CommandItem
                    key={option.value}
                    onSelect={handleSelect}
                    value={option.value}
                  >
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
