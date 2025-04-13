"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/lib/types"
import { Loader2, Upload } from "lucide-react"

interface ProfileSettingsProps {
  user: User
  onSave: (updatedUser: User) => void
}

export function ProfileSettings({ user, onSave }: ProfileSettingsProps) {
  const [formState, setFormState] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    bio: "",
    phoneNumber: "",
    location: "",
    timezone: "America/New_York",
    avatarUrl: user.avatar,
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    ticketAssigned: true,
    ticketMentioned: true,
    projectUpdates: true,
    meetingReminders: true,
    weeklyDigest: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Update user with form data
      const updatedUser = {
        ...user,
        name: formState.name,
        email: formState.email,
        role: formState.role,
        // In a real app, you'd update more fields and handle the avatar upload
      }

      onSave(updatedUser)
      setIsLoading(false)

      // Show success message (would use a toast in a real app)
      alert("Profile updated successfully!")
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and public profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formState.avatarUrl || "/placeholder.svg"} alt={formState.name} />
                  <AvatarFallback>{formState.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload new image</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formState.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineer">Engineer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formState.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formState.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formState.timezone}
                  onValueChange={(value) => handleInputChange("timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formState.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Brief description for your profile. URLs are hyperlinked.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose when and how you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails for important updates
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(value) => handleNotificationChange("emailNotifications", value)}
              />
            </div>

            <div className="border-t pt-5">
              <h3 className="text-sm font-medium mb-3">Notify me about:</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ticket-assigned" className="flex-grow">Ticket assignments</Label>
                  <Switch
                    id="ticket-assigned"
                    checked={notifications.ticketAssigned}
                    onCheckedChange={(value) => handleNotificationChange("ticketAssigned", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ticket-mentioned" className="flex-grow">Mentions in tickets</Label>
                  <Switch
                    id="ticket-mentioned"
                    checked={notifications.ticketMentioned}
                    onCheckedChange={(value) => handleNotificationChange("ticketMentioned", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="project-updates" className="flex-grow">Project updates</Label>
                  <Switch
                    id="project-updates"
                    checked={notifications.projectUpdates}
                    onCheckedChange={(value) => handleNotificationChange("projectUpdates", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="meeting-reminders" className="flex-grow">Meeting reminders</Label>
                  <Switch
                    id="meeting-reminders"
                    checked={notifications.meetingReminders}
                    onCheckedChange={(value) => handleNotificationChange("meetingReminders", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-digest" className="flex-grow">Weekly activity digest</Label>
                  <Switch
                    id="weekly-digest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(value) => handleNotificationChange("weeklyDigest", value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-2 border rounded-lg p-6 bg-background">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </div>
    </form>
  )
}
