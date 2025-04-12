"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { CreateTicketDialog } from "./create-ticket-dialog"
import { TicketDetailsDialog } from "./ticket-details-dialog"
import { initialBoardData } from "@/lib/initial-data"
import type { Ticket } from "@/lib/types"

export function KanbanBoard() {
  const [boardData, setBoardData] = useState(initialBoardData)
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const sourceColumn = boardData.columns.find((col) => col.id === source.droppableId)
    const destColumn = boardData.columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Create new arrays to avoid mutating state directly
    const newSourceTickets = [...sourceColumn.tickets]
    const newDestTickets = sourceColumn.id === destColumn.id ? newSourceTickets : [...destColumn.tickets]

    // Get the ticket being moved
    const [movedTicket] = newSourceTickets.splice(source.index, 1)

    // Insert the ticket at the destination
    if (sourceColumn.id === destColumn.id) {
      newSourceTickets.splice(destination.index, 0, movedTicket)
    } else {
      newDestTickets.splice(destination.index, 0, movedTicket)
    }

    // Create new columns with updated tickets
    const newColumns = boardData.columns.map((col) => {
      if (col.id === sourceColumn.id) {
        return { ...col, tickets: newSourceTickets }
      }
      if (col.id === destColumn.id && sourceColumn.id !== destColumn.id) {
        return { ...col, tickets: newDestTickets }
      }
      return col
    })

    // Update state with new columns
    setBoardData({ ...boardData, columns: newColumns })
  }

  const handleAddTicket = (newTicket: Ticket) => {
    // Add the new ticket to the first column (To Do)
    const updatedColumns = boardData.columns.map((column, index) => {
      if (index === 0) {
        return {
          ...column,
          tickets: [newTicket, ...column.tickets],
        }
      }
      return column
    })

    setBoardData({
      ...boardData,
      columns: updatedColumns,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug":
        return "bg-red-100 text-red-800"
      case "feature":
        return "bg-blue-100 text-blue-800"
      case "task":
        return "bg-purple-100 text-purple-800"
      case "research":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">Manage and track your team's tasks and projects</p>
        </div>
        <Button onClick={() => setIsCreateTicketOpen(true)} className="bg-[#26A69A] hover:bg-[#26A69A]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4">
            {boardData.columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-[300px]">
                <div className="bg-muted rounded-t-md p-3 font-medium">
                  <div className="flex justify-between items-center">
                    <span>{column.title}</span>
                    <Badge variant="outline">{column.tickets.length}</Badge>
                  </div>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-muted/50 rounded-b-md p-2 min-h-[500px]"
                    >
                      {column.tickets.map((ticket, index) => (
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTicket(ticket)}
                              className="mb-2"
                            >
                              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                      <Badge className={getTypeColor(ticket.type)} variant="secondary">
                                        {ticket.type}
                                      </Badge>
                                      <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                                        {ticket.priority}
                                      </Badge>
                                    </div>
                                    <h3 className="font-medium line-clamp-2">{ticket.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                                    <div className="flex justify-between items-center pt-2">
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(ticket.dueDate).toLocaleDateString()}
                                      </div>
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage
                                          src={ticket.assignee.avatar || "/placeholder.svg"}
                                          alt={ticket.assignee.name}
                                        />
                                        <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <CreateTicketDialog
        open={isCreateTicketOpen}
        onOpenChange={setIsCreateTicketOpen}
        onTicketCreate={handleAddTicket}
      />

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={!!selectedTicket}
        onOpenChange={(open) => {
          if (!open) setSelectedTicket(null)
        }}
      />
    </div>
  )
}
