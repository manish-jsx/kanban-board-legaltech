"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Eye, Tag } from "lucide-react"
import { initialKnowledgeArticles } from "@/lib/initial-data"
import { Skeleton } from "@/components/ui/skeleton"
import type { KnowledgeArticle } from "@/lib/types"

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch article data
    setTimeout(() => {
      const foundArticle = initialKnowledgeArticles.find(a => a.id === params.articleId)
      if (foundArticle) {
        setArticle({
          ...foundArticle,
          views: foundArticle.views + 1 // Increment view count
        })
      }
      setLoading(false)
    }, 500)
  }, [params.articleId])

  // Format the created date
  const formattedDate = article ? new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : ''

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/knowledge')}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : article ? (
            <>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <div className="flex items-center text-muted-foreground text-sm gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views} views</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold">{article.title}</h1>

                <div className="flex items-center gap-3 pt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                    <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{article.author.name}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="mb-6">
                <CardContent className="p-6 prose prose-sm sm:prose-base max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(article.content) }} />
                </CardContent>
              </Card>

              {article.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-8">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Article not found</h2>
                <p className="text-muted-foreground mt-2">The article you're looking for doesn't exist or has been removed.</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => router.push('/knowledge')}
                >
                  Go back to Knowledge Base
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Reusing the markdown formatter from create-article-dialog
function formatMarkdown(text: string): string {
  // Replace headers
  let html = text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Replace bold and italic
    .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gm, '<em>$1</em>')
    // Replace links
    .replace(/\[([^\[]+)\]\(([^\)]+)\)/gm, '<a href="$2">$1</a>')
    // Replace lists
    .replace(/^\s*\n\* (.*)/gm, '<ul>\n<li>$1</li>\n</ul>')
    .replace(/^\s*\n- (.*)/gm, '<ul>\n<li>$1</li>\n</ul>')
    // Replace paragraphs
    .replace(/^\s*\n([^\n]+)\n/gm, '<p>$1</p>\n')
    // Fix list items
    .replace(/<\/ul>\s*<ul>/g, '')
    // Add line breaks
    .replace(/\n/g, '<br>');

  return html;
}
