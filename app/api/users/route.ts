import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/users
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const search = searchParams.get('search')
        const role = searchParams.get('role')

        const where: any = {}
        if (role) where.role = role.toUpperCase()
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                avatar: true,
                lastActive: true,
                createdAt: true,
                _count: {
                    select: {
                        assignedTickets: true,
                        projectMemberships: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        })

        return NextResponse.json({ users })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
