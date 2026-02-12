"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FolderKanban, CalendarDays, Users, CheckCircle2 } from "lucide-react"

const stats = [
    {
        label: "Active Projects",
        value: "3",
        change: "+1 this week",
        trend: "up",
        icon: FolderKanban,
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-600 dark:text-blue-400",
    },
    {
        label: "Tasks Completed",
        value: "24",
        change: "+8 this week",
        trend: "up",
        icon: CheckCircle2,
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
        label: "Team Members",
        value: "5",
        change: "All active",
        trend: "neutral",
        icon: Users,
        color: "from-violet-500 to-purple-500",
        bgColor: "bg-violet-50 dark:bg-violet-950/30",
        textColor: "text-violet-600 dark:text-violet-400",
    },
    {
        label: "Meetings This Week",
        value: "3",
        change: "Next in 2h",
        trend: "neutral",
        icon: CalendarDays,
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        textColor: "text-amber-600 dark:text-amber-400",
    },
]

export function StatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <Card
                        key={stat.label}
                        className="group card-hover border-0 shadow-sm hover:shadow-md"
                    >
                        <CardContent className="p-4 md:p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                                    <Icon className={`h-4.5 w-4.5 ${stat.textColor}`} />
                                </div>
                                {stat.trend === "up" && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                                        <TrendingUp className="h-3 w-3" />
                                        <span className="hidden sm:inline">Up</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
                                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                <p className={`text-[11px] ${stat.textColor} font-medium`}>{stat.change}</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
