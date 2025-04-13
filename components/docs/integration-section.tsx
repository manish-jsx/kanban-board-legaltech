"use client"

import { useState, ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, Check, Code, Braces } from "lucide-react"
import { cn } from "@/lib/utils"

interface IntegrationEndpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  requestFormat: Record<string, string>;
  responseFormat: Record<string, string>;
  example?: string;
}

interface IntegrationSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  endpoints: IntegrationEndpoint[];
}

export function IntegrationSection({ title, description, icon, endpoints }: IntegrationSectionProps) {
  const [copied, setCopied] = useState("")

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {endpoints.map((endpoint, i) => (
              <AccordionItem key={i} value={`endpoint-${i}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 text-left">
                    <Badge variant="outline" className={cn(
                      "text-xs px-2 py-0",
                      endpoint.method === "GET" ? "bg-blue-100 text-blue-800" :
                        endpoint.method === "POST" ? "bg-green-100 text-green-800" :
                          endpoint.method === "PUT" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                    )}>
                      {endpoint.method}
                    </Badge>
                    <span className="font-medium">{endpoint.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted p-2 rounded flex-1 overflow-auto">
                        {endpoint.path}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleCopy(endpoint.path)}
                      >
                        {copied === endpoint.path ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Clipboard className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Request</h4>
                    <div className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                      <pre>
                        <code>{`{
${Object.entries(endpoint.requestFormat)
                            .map(([key, value]) => `  "${key}": ${value}`)
                            .join(",\n")}
}`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Response</h4>
                    <div className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                      <pre>
                        <code>{`{
${Object.entries(endpoint.responseFormat)
                            .map(([key, value]) => `  "${key}": ${value}`)
                            .join(",\n")}
}`}</code>
                      </pre>
                    </div>
                  </div>

                  {endpoint.example && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Example Usage</h4>
                      <div className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                        <pre>
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
