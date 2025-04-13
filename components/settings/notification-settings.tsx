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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailPreferences, setEmailPreferences] = useState({
    ticketAssigned: true,
    ticketMentioned: true,
    ticketStatusChange: false,
    projectUpdates: true,
    meetingReminders: true,
    knowledgeArticles: false,
    weeklyDigest: true
  })

  const [pushPreferences, setPushPreferences] = useState({
    ticketAssigned: true,
    ticketMentioned: true,
    ticketStatusChange: true,
    projectUpdates: false,
    meetingReminders: true,
    knowledgeArticles: false
  })

  const handleEmailChange = (field: string, checked: boolean) => {
    setEmailPreferences(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  const handlePushChange = (field: string, checked: boolean) => {
    setPushPreferences(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Display success message (would use toast in a real app)
      console.log("Notification settings updated", { emailPreferences, pushPreferences })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email Notifications</TabsTrigger>
              <TabsTrigger value="push">Push Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-ticket-assigned" className="flex-1">
                    <div>Ticket assignments</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when you are assigned to a ticket
                    </div>
                  </Label>
                  <Switch
                    id="email-ticket-assigned"
                    checked={emailPreferences.ticketAssigned}
                    onCheckedChange={(checked) => handleEmailChange("ticketAssigned", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-ticket-mentioned" className="flex-1">
                    <div>Mentions</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when you are mentioned in a comment
                    </div>
                  </Label>
                  <Switch
                    id="email-ticket-mentioned"
                    checked={emailPreferences.ticketMentioned}
                    onCheckedChange={(checked) => handleEmailChange("ticketMentioned", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-ticket-status" className="flex-1">
                    <div>Status changes</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when the status of your ticket changes
                    </div>
                  </Label>
                  <Switch
                    id="email-ticket-status"
                    checked={emailPreferences.ticketStatusChange}
                    onCheckedChange={(checked) => handleEmailChange("ticketStatusChange", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-project-updates" className="flex-1">
                    <div>Project updates</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified about updates to projects you're part of
                    </div>
                  </Label>
                  <Switch
                    id="email-project-updates"
                    checked={emailPreferences.projectUpdates}
                    onCheckedChange={(checked) => handleEmailChange("projectUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-meeting-reminders" className="flex-1">
                    <div>Meeting reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Get reminded about upcoming meetings
                    </div>
                  </Label>
                  <Switch
                    id="email-meeting-reminders"
                    checked={emailPreferences.meetingReminders}
                    onCheckedChange={(checked) => handleEmailChange("meetingReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-knowledge" className="flex-1">
                    <div>Knowledge base articles</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified about new articles and updates
                    </div>
                  </Label>
                  <Switch
                    id="email-knowledge"
                    checked={emailPreferences.knowledgeArticles}
                    onCheckedChange={(checked) => handleEmailChange("knowledgeArticles", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-digest" className="flex-1">
                    <div>Weekly digest</div>
                    <div className="text-sm text-muted-foreground">
                      Get a summary of activity once a week
                    </div>
                  </Label>
                  <Switch
                    id="email-digest"
                    checked={emailPreferences.weeklyDigest}
                    onCheckedChange={(checked) => handleEmailChange("weeklyDigest", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="push" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-ticket-assigned" className="flex-1">
                    <div>Ticket assignments</div>
                    <div className="text-sm text-muted-foreground">
                      Get push notifications when you are assigned to a ticket
                    </div>
                  </Label>
                  <Switch
                    id="push-ticket-assigned"
                    checked={pushPreferences.ticketAssigned}
                    onCheckedChange={(checked) => handlePushChange("ticketAssigned", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-ticket-mentioned" className="flex-1">
                    <div>Mentions</div>
                    <div className="text-sm text-muted-foreground">
                      Get push notifications when you are mentioned in a comment
                    </div>
                  </Label>
                  <Switch
                    id="push-ticket-mentioned"
                    checked={pushPreferences.ticketMentioned}
                    onCheckedChange={(checked) => handlePushChange("ticketMentioned", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-ticket-status" className="flex-1">
                    <div>Status changes</div>
                    <div className="text-sm text-muted-foreground">
                      Get push notifications when the status of your ticket changes
                    </div>
                  </Label>
                  <Switch
                    id="push-ticket-status"
                    checked={pushPreferences.ticketStatusChange}
                    onCheckedChange={(checked) => handlePushChange("ticketStatusChange", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-project-updates" className="flex-1">
                    <div>Project updates</div>
                    <div className="text-sm text-muted-foreground">
                      Get push notifications about updates to projects you're part of
                    </div>
                  </Label>
                  <Switch
                    id="push-project-updates"
                    checked={pushPreferences.projectUpdates}
                    onCheckedChange={(checked) => handlePushChange("projectUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-meeting-reminders" className="flex-1">
                    <div>Meeting reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Get push notifications for upcoming meetings
                    </div>
                  </Label>
                  <Switch
                    id="push-meeting-reminders"
                    checked={pushPreferences.meetingReminders}
                    onCheckedChange={(checked) => handlePushChange("meetingReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-knowledge" className="flex-1">
                    <div>Knowledge base articles</div>
                    <div className="text-sm text-muted-foreground">
                      Get push notifications about new articles and updates
                    </div>
                  </Label>
                  <Switch
                    id="push-knowledge"
                    checked={pushPreferences.knowledgeArticles}
                    onCheckedChange={(checked) => handlePushChange("knowledgeArticles", checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Reset</Button>
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
      </Card>
    </form>
  )
}
