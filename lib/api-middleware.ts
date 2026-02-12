import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, hasPermission, type JWTPayload } from '@/lib/auth'
import { Role } from '@prisma/client'

// ─── Extract auth from request ───────────────────────────
export function getAuthFromRequest(req: NextRequest): JWTPayload | null {
    // Check Authorization header
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        return verifyToken(token)
    }

    // Check cookie
    const tokenCookie = req.cookies.get('auth-token')
    if (tokenCookie) {
        return verifyToken(tokenCookie.value)
    }

    return null
}

// ─── Require authentication ──────────────────────────────
export function requireAuth(req: NextRequest): JWTPayload | NextResponse {
    const auth = getAuthFromRequest(req)
    if (!auth) {
        return NextResponse.json(
            { error: 'Unauthorized — please log in' },
            { status: 401 }
        )
    }
    return auth
}

// ─── Require specific permission ─────────────────────────
export function requirePermission(
    req: NextRequest,
    permission: string
): JWTPayload | NextResponse {
    const auth = requireAuth(req)
    if (auth instanceof NextResponse) return auth

    if (!hasPermission(auth.role as Role, permission)) {
        return NextResponse.json(
            { error: `Forbidden — you need "${permission}" permission` },
            { status: 403 }
        )
    }
    return auth
}

// ─── Require specific roles ──────────────────────────────
export function requireRole(
    req: NextRequest,
    ...roles: Role[]
): JWTPayload | NextResponse {
    const auth = requireAuth(req)
    if (auth instanceof NextResponse) return auth

    if (!roles.includes(auth.role as Role)) {
        return NextResponse.json(
            { error: `Forbidden — requires role: ${roles.join(' or ')}` },
            { status: 403 }
        )
    }
    return auth
}
