"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

// Define subjects interface
interface Subject {
  id: string
  name: string
  description: string
  category: string
  documentCount: number
  createdAt: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data for subjects
      const mockSubjects: Subject[] = [
        {
          id: "subject-1",
          name: "Contract Law",
          description: "Legal principles and regulations governing agreements and contracts between parties.",
          category: "Legal",
          documentCount: 24,
          createdAt: "2023-10-15T08:30:00Z"
        },
        {
          id: "subject-2",
          name: "Intellectual Property",
          description: "Patents, trademarks, copyrights, and other legal protections for creative works and inventions.",
          category: "Legal",
          documentCount: 18,
          createdAt: "2023-10-20T14:45:00Z"
        },
        {
          id: "subject-3",
          name: "Employment Law",
          description: "Legal standards and practices governing employer-employee relationships and workplace regulations.",
          category: "Legal",
          documentCount: 15,
          createdAt: "2023-11-02T11:15:00Z"
        },
        {
          id: "subject-4",
          name: "Legal Research Methodology",
          description: "Research methods and approaches specific to legal documentation and case findings.",
          category: "Research",
          documentCount: 10,
          createdAt: "2023-11-10T09:20:00Z"
        },
        {
          id: "subject-5",
          name: "Legal Tech Tools",
          description: "Software and technology solutions specifically designed for legal practice management.",
          category: "Technology",
          documentCount: 8,
          createdAt: "2023-11-22T16:40:00Z"
        }
      ]

      setSubjects(mockSubjects)
      setLoading(false)
    }, 1200)
  }, [])

  // Filter subjects based on search query and active tab
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && subject.category.toLowerCase() === activeTab.toLowerCase()
  })

  // Get unique categories for tabs
  const categories = ["all", ...new Set(subjects.map(s => s.category.toLowerCase()))]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Subject Areas</h1>
              <p className="text-muted-foreground">
                Browse and manage legal subject areas
              </p>
            </div>

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </div>

          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search subjects..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full flex overflow-x-auto pb-px">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="flex-shrink-0 capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-1/3 mb-1" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/3" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map(subject => (
                  <Link key={subject.id} href={`/subjects/${subject.id}`} className="block h-full">
                    <Card className="h-full transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <Badge variant="outline">{subject.category}</Badge>
                        </div>
                        <CardDescription>
                          {subject.documentCount} {subject.documentCount === 1 ? 'document' : 'documents'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2">{subject.description}</p>
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground">
                        Added on {new Date(subject.createdAt).toLocaleDateString()}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-12">
                <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first subject area."}
                </p>
              </div>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
