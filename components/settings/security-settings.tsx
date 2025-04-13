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
import { Loader2, ShieldAlert, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const sessions = [
    {
      id: "session-1",
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.1",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "session-2",
      device: "Firefox on MacOS",
      location: "San Francisco, USA",
      ip: "192.168.1.2",
      lastActive: "1 hour ago",
      current: false,
    },
    {
      id: "session-3",
      device: "Safari on iPhone",
      location: "Los Angeles, USA",
      ip: "192.168.1.3",
      lastActive: "1 day ago",
      current: false,
    }
  ]

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPasswordSuccess(false)
    setPasswordError("")

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match")
      setIsLoading(false)
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setPasswordSuccess(true)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 1500)
  }

  const handleRevokeSession = (sessionId: string) => {
    // Simulate API call to revoke session
    console.log("Revoking session:", sessionId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordSuccess && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Password updated</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your password has been updated successfully.
                </AlertDescription>
              </Alert>
            )}

            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an additional layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label className="text-base">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require a verification code when signing in.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <div className="border rounded-md p-4 bg-muted/50 space-y-4">
              <div className="text-sm">
                Two-factor authentication uses an application on your mobile device
                to generate verification codes.
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Set up with authenticator app
                </Button>
                <Button variant="outline">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Show recovery codes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessions.map((session) => (
            <div key={session.id} className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{session.device}</div>
                  {session.current && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {session.location} • IP: {session.ip}
                </div>
                <div className="text-xs text-muted-foreground">
                  Last active: {session.lastActive}
                </div>
              </div>

              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}

          <Separator />

          <Button variant="destructive" className="w-full sm:w-auto">
            Sign out of all other sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Missing Badge component
function Badge({ children, className, variant }: {
  children: React.ReactNode,
  className?: string,
  variant: "outline" | "default"
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variantClasses = variant === "outline"
    ? "border border-input hover:bg-accent hover:text-accent-foreground"
    : "bg-primary text-primary-foreground hover:bg-primary/80"
  return <span className={`${baseClasses} ${variantClasses} ${className}`}>{children}</span>
}
