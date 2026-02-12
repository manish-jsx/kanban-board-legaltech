import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAuthFromRequest } from '@/lib/api-middleware'

// GET /api/projects/[id] — Get project with full board
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, role: true, avatar: true, status: true } },
                    },
                },
                board: {
                    include: {
                        columns: {
                            include: {
                                tickets: {
                                    include: {
                                        assignee: { select: { id: true, name: true, email: true, role: true, avatar: true } },
                                        labels: { include: { label: true } },
                                        _count: { select: { comments: true, attachments: true } },
                                    },
                                    orderBy: { position: 'asc' },
                                },
                            },
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json({ project })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// PATCH /api/projects/[id] — Update project
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()

        const updateData: any = {}
        if (body.name !== undefined) updateData.name = body.name
        if (body.description !== undefined) updateData.description = body.description
        if (body.status !== undefined) updateData.status = body.status.toUpperCase()

        const project = await prisma.project.update({
            where: { id },
            data: updateData,
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true, role: true, avatar: true } } },
                },
            },
        })

        return NextResponse.json({ project })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE /api/projects/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.project.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
