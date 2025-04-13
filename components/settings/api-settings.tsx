"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy, KeyRound, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed: string
  permissions: string[]
  createdAt: string
}

export function APISettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key-1",
      name: "Production API Key",
      key: "sk_live_1a2b3c4d5e6f7g8h9i0j",
      lastUsed: "2023-12-01T10:30:00Z",
      permissions: ["read", "write"],
      createdAt: "2023-11-01T14:25:00Z",
    },
    {
      id: "key-2",
      name: "Development API Key",
      key: "sk_test_9i8h7g6f5e4d3c2b1a0",
      lastUsed: "2023-12-05T15:45:00Z",
      permissions: ["read"],
      createdAt: "2023-11-15T09:10:00Z",
    }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isWebhooksEnabled, setIsWebhooksEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [newKeyForm, setNewKeyForm] = useState({
    name: "",
    permissions: ["read"],
  })
  const [newKey, setNewKey] = useState<string | null>(null)

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a random key
    const generatedKey = `sk_test_${Array(20)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('')}`

    // Create new key object
    const newApiKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyForm.name,
      key: generatedKey,
      lastUsed: "Never",
      permissions: newKeyForm.permissions,
      createdAt: new Date().toISOString(),
    }

    // Add to list
    setApiKeys([...apiKeys, newApiKey])
    setNewKey(generatedKey)

    // Reset form
    setNewKeyForm({
      name: "",
      permissions: ["read"],
    })
  }

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId))
  }

  const handlePermissionToggle = (permission: string) => {
    if (newKeyForm.permissions.includes(permission)) {
      setNewKeyForm({
        ...newKeyForm,
        permissions: newKeyForm.permissions.filter(p => p !== permission),
      })
    } else {
      setNewKeyForm({
        ...newKeyForm,
        permissions: [...newKeyForm.permissions, permission],
      })
    }
  }

  const handleWebhookSubmit = () => {
    console.log("Webhook URL saved:", webhookUrl)
    // This would typically save the webhook URL to the backend
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Would show a toast notification in a real app
  }

  const formatDateTime = (dateTimeStr: string) => {
    if (dateTimeStr === "Never") return "Never"
    const date = new Date(dateTimeStr)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys that allow access to your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {apiKey.key.slice(0, 8)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy API key</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {apiKey.permissions.map(permission => (
                          <span
                            key={permission}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatDateTime(apiKey.lastUsed)}</TableCell>
                    <TableCell>{formatDateTime(apiKey.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete API key</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {apiKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No API keys found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure webhooks to receive real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label className="text-base">Enable Webhooks</Label>
              <p className="text-sm text-muted-foreground">
                Receive real-time HTTP notifications when events happen in your account
              </p>
            </div>
            <Switch
              checked={isWebhooksEnabled}
              onCheckedChange={setIsWebhooksEnabled}
            />
          </div>

          {isWebhooksEnabled && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    placeholder="https://example.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleWebhookSubmit}>Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This URL will receive webhook events via POST requests
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Webhook events</h3>
                <div className="space-y-2">
                  {['ticket.created', 'ticket.updated', 'ticket.deleted', 'project.created'].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Switch id={`event-${event}`} />
                      <Label htmlFor={`event-${event}`}>{event}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        {newKey ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Make sure to copy your new API key now. You won't be able to see it again!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-md bg-muted p-4 font-mono text-sm">
                {newKey}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(newKey)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy to clipboard
              </Button>
            </div>

            <DialogFooter>
              <Button onClick={() => {
                setNewKey(null)
                setIsCreateDialogOpen(false)
              }}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to authenticate with the API
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateKey} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">API Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="My API Key"
                  value={newKeyForm.name}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  A descriptive name for this API key
                </p>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="permission-read"
                      checked={newKeyForm.permissions.includes("read")}
                      onCheckedChange={() => handlePermissionToggle("read")}
                    />
                    <Label htmlFor="permission-read">Read (GET, LIST)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="permission-write"
                      checked={newKeyForm.permissions.includes("write")}
                      onCheckedChange={() => handlePermissionToggle("write")}
                    />
                    <Label htmlFor="permission-write">Write (POST, PUT, DELETE)</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
