"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clipboard, Check, ShieldAlert } from "lucide-react"

export function AuthSection() {
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
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            Secure your API requests with token-based authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            All API requests require authentication. We use JSON Web Tokens (JWT) for API authentication.
            Include the token in your request headers as shown below.
          </p>

          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted p-2 rounded flex-1 overflow-auto">
              Authorization: Bearer YOUR_API_KEY
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => handleCopy("Authorization: Bearer YOUR_API_KEY")}
            >
              {copied === "Authorization: Bearer YOUR_API_KEY" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Login for Token</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-auto">
                  <code>{`// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "your_password"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  For service-to-service integrations, you can generate API keys in the settings page.
                  API keys provide long-lived access to the API.
                </p>
                <div className="text-sm font-medium">
                  ⚠️ Keep your API keys secure and never expose them in client-side code!
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-destructive">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <CardTitle className="text-base">Error Responses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="unauthorized">
                <TabsList className="w-full grid grid-cols-2 mb-2">
                  <TabsTrigger value="unauthorized">401 Unauthorized</TabsTrigger>
                  <TabsTrigger value="forbidden">403 Forbidden</TabsTrigger>
                </TabsList>
                <TabsContent value="unauthorized">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                    <code>{`// 401 Unauthorized - Missing or invalid token
{
  "error": "unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="forbidden">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                    <code>{`// 403 Forbidden - Valid token but insufficient permissions
{
  "error": "forbidden",
  "message": "Insufficient permissions to perform this action",
  "statusCode": 403,
  "requiredRole": "admin"
}`}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Authentication Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left text-sm font-medium">Endpoint</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Method</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono">/api/auth/login</td>
                      <td className="px-4 py-2 text-sm">POST</td>
                      <td className="px-4 py-2 text-sm">Authenticate user and get token</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono">/api/auth/register</td>
                      <td className="px-4 py-2 text-sm">POST</td>
                      <td className="px-4 py-2 text-sm">Register a new user</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono">/api/auth/refresh</td>
                      <td className="px-4 py-2 text-sm">POST</td>
                      <td className="px-4 py-2 text-sm">Refresh access token</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono">/api/auth/logout</td>
                      <td className="px-4 py-2 text-sm">POST</td>
                      <td className="px-4 py-2 text-sm">Invalidate current token</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-mono">/api/auth/me</td>
                      <td className="px-4 py-2 text-sm">GET</td>
                      <td className="px-4 py-2 text-sm">Get current user info</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
