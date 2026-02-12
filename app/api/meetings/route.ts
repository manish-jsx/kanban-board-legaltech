import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAuthFromRequest } from '@/lib/api-middleware'

// GET /api/meetings
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const date = searchParams.get('date')
        const upcoming = searchParams.get('upcoming')

        const where: any = {}

        if (date) {
            const d = new Date(date)
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
            const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
            where.startTime = { gte: start, lt: end }
        } else if (upcoming === 'true') {
            where.startTime = { gte: new Date() }
        }

        const meetings = await prisma.meeting.findMany({
            where,
            include: {
                organizer: { select: { id: true, name: true, email: true, avatar: true } },
                attendees: { select: { id: true, name: true, email: true, avatar: true } },
            },
            orderBy: { startTime: 'asc' },
            take: 50,
        })

        return NextResponse.json({ meetings })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST /api/meetings
export async function POST(req: NextRequest) {
    try {
        const auth = getAuthFromRequest(req)
        const body = await req.json()

        const { title, description, startTime, endTime, meetLink, attendeeIds } = body

        if (!title || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'Title, startTime, and endTime are required' },
                { status: 400 }
            )
        }

        const meeting = await prisma.meeting.create({
            data: {
                title,
                description: description || '',
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                meetLink: meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
                organizerId: auth?.userId || '',
                attendees: attendeeIds?.length
                    ? { connect: attendeeIds.map((id: string) => ({ id })) }
                    : undefined,
            },
            include: {
                organizer: { select: { id: true, name: true, email: true, avatar: true } },
                attendees: { select: { id: true, name: true, email: true, avatar: true } },
            },
        })

        if (auth) {
            await prisma.activityLog.create({
                data: {
                    action: 'scheduled',
                    entity: 'meeting',
                    entityId: meeting.id,
                    details: `Scheduled meeting "${title}"`,
                    userId: auth.userId,
                },
            })
        }

        return NextResponse.json({ meeting }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
