"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { initialKnowledgeArticles } from "@/lib/initial-data"
import Link from "next/link"
import { ArrowRight, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function RecentKnowledgeArticles() {
  // Sort by the most recent and get top 3
  const articles = [...initialKnowledgeArticles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Knowledge Base</CardTitle>
        <Link href="/knowledge">
          <Button variant="ghost" size="sm" className="gap-1">
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link href={`/knowledge/${article.id}`} key={article.id}>
                <div className="p-3 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="outline">{article.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{article.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No knowledge articles
          </div>
        )}
      </CardContent>
    </Card>
  )
}
