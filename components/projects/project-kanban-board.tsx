"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { CreateTicketDialog } from "../kanban/create-ticket-dialog"
import { TicketDetailsDialog } from "../kanban/ticket-details-dialog"
import { initialBoardData } from "@/lib/initial-data"
import { Skeleton } from "@/components/ui/skeleton"
import type { Board, Ticket } from "@/lib/types"

interface ProjectKanbanBoardProps {
  projectId: string
}

export function ProjectKanbanBoard({ projectId }: ProjectKanbanBoardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [boardData, setBoardData] = useState<Board | null>(null)
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    // In a real app, we would fetch the specific board data for this project
    // For now, we'll just use the initialBoardData with a delay to simulate API call
    setTimeout(() => {
      setBoardData(initialBoardData)
      setIsLoading(false)
    }, 800)
  }, [projectId])

  const handleDragEnd = (result: any) => {
    if (!boardData) return;

    const { destination, source, draggableId } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Find the source and destination column
    const sourceCol = boardData.columns.find((col) => col.id === source.droppableId)
    const destCol = boardData.columns.find((col) => col.id === destination.droppableId)

    if (!sourceCol || !destCol) return

    // Get the ticket being moved
    const ticket = sourceCol.tickets[source.index]

    // Create new arrays for the columns
    const newSourceTickets = [...sourceCol.tickets]
    newSourceTickets.splice(source.index, 1)

    const newDestTickets = [...destCol.tickets]
    newDestTickets.splice(destination.index, 0, ticket)

    // Update the board data
    const newColumns = boardData.columns.map((column) => {
      if (column.id === source.droppableId) {
        return { ...column, tickets: newSourceTickets }
      }
      if (column.id === destination.droppableId) {
        return { ...column, tickets: newDestTickets }
      }
      return column
    })

    setBoardData({ ...boardData, columns: newColumns })
  }

  const handleAddTicket = (newTicket: Ticket) => {
    if (!boardData) return;

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[300px] flex-shrink-0">
              <Skeleton className="h-10 w-full rounded-t-md" />
              <Skeleton className="h-[500px] w-full mt-0.5 rounded-b-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!boardData) {
    return <div>No board data available for this project.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
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
