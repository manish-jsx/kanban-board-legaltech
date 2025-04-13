"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Clock } from "lucide-react"
import type { KnowledgeArticle } from "@/lib/types"

interface ArticleCardProps {
  article: KnowledgeArticle
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Format the date
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Link href={`/knowledge/${article.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md cursor-pointer">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline">{article.category}</Badge>
            <div className="flex items-center text-muted-foreground text-xs gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.views}</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg mt-2">{article.title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.content.replace(/#|##|###|\*\*|\*/g, '').substring(0, 150)}...
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{article.author.name}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
