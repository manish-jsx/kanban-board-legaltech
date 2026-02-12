import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'cengineers-kanban-secret-key-2026'
const JWT_EXPIRES_IN = '7d'

export interface AuthUser {
    id: string
    name: string
    email: string
    role: Role
}

export interface JWTPayload {
    userId: string
    email: string
    role: Role
    iat?: number
    exp?: number
}

// ─── Hardcoded Employee Credentials ──────────────────────
// These are pre-generated credentials for role-based access
export const EMPLOYEE_CREDENTIALS = [
    {
        email: 'admin@cengineers.com',
        password: 'Admin@2026',
        name: 'Admin User',
        role: 'ADMIN' as Role,
    },
    {
        email: 'john.doe@cengineers.com',
        password: 'Manager@2026',
        name: 'John Doe',
        role: 'MANAGER' as Role,
    },
    {
        email: 'jane.smith@cengineers.com',
        password: 'Engineer@2026',
        name: 'Jane Smith',
        role: 'ENGINEER' as Role,
    },
    {
        email: 'alex.johnson@cengineers.com',
        password: 'Designer@2026',
        name: 'Alex Johnson',
        role: 'DESIGNER' as Role,
    },
    {
        email: 'sarah.williams@cengineers.com',
        password: 'Researcher@2026',
        name: 'Sarah Williams',
        role: 'RESEARCHER' as Role,
    },
    {
        email: 'michael.brown@cengineers.com',
        password: 'Engineer@2026',
        name: 'Michael Brown',
        role: 'ENGINEER' as Role,
    },
]

// ─── Hash a password ─────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

// ─── Verify a password ───────────────────────────────────
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

// ─── Generate JWT token ──────────────────────────────────
export function generateToken(user: AuthUser): string {
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// ─── Verify JWT token ────────────────────────────────────
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch {
        return null
    }
}

// ─── Role permissions map ────────────────────────────────
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
    ADMIN: [
        'manage_users', 'manage_projects', 'manage_tickets', 'manage_meetings',
        'manage_knowledge', 'manage_settings', 'view_analytics', 'delete_anything',
        'manage_roles', 'export_data',
    ],
    MANAGER: [
        'manage_projects', 'manage_tickets', 'manage_meetings', 'manage_knowledge',
        'view_analytics', 'invite_users', 'assign_tickets', 'export_data',
    ],
    ENGINEER: [
        'create_tickets', 'update_own_tickets', 'comment_tickets', 'view_projects',
        'view_knowledge', 'create_articles', 'join_meetings',
    ],
    DESIGNER: [
        'create_tickets', 'update_own_tickets', 'comment_tickets', 'view_projects',
        'view_knowledge', 'create_articles', 'join_meetings',
    ],
    RESEARCHER: [
        'create_tickets', 'update_own_tickets', 'comment_tickets', 'view_projects',
        'view_knowledge', 'create_articles', 'manage_knowledge', 'join_meetings',
    ],
    VIEWER: [
        'view_projects', 'view_knowledge', 'view_tickets',
    ],
}

// ─── Check permission ────────────────────────────────────
export function hasPermission(role: Role, permission: string): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

// ─── Check if user can manage a resource ─────────────────
export function canManage(role: Role): boolean {
    return ['ADMIN', 'MANAGER'].includes(role)
}
