"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { TeamSettings } from "@/components/settings/team-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { APISettings } from "@/components/settings/api-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pt-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1 gap-1">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-4">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <AppearanceSettings />
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <TeamSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <APISettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
