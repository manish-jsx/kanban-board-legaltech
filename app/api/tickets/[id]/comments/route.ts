import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAuthFromRequest } from '@/lib/api-middleware'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const auth = getAuthFromRequest(req)
        const { text } = await req.json()

        if (!text?.trim()) {
            return NextResponse.json({ error: 'Comment text is required' }, { status: 400 })
        }

        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const comment = await prisma.comment.create({
            data: {
                text: text.trim(),
                userId: auth.userId,
                ticketId: id,
            },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
            },
        })

        return NextResponse.json({ comment }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
