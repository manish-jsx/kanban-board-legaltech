import { NextRequest, NextResponse } from 'next/server';
import resend, { FROM_EMAIL } from '@/lib/email/resend-client';
import {
    teamInviteEmail,
    ticketAssignedEmail,
    meetingInviteEmail,
    ticketStatusChangeEmail,
    projectCreatedEmail,
    weeklyDigestEmail,
} from '@/lib/email/templates';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, to, data } = body;

        if (!to || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: to, type' },
                { status: 400 }
            );
        }

        let emailContent: { subject: string; html: string };

        switch (type) {
            case 'team_invite':
                emailContent = teamInviteEmail(data);
                break;

            case 'ticket_assigned':
                emailContent = ticketAssignedEmail(data);
                break;

            case 'meeting_invite':
                emailContent = meetingInviteEmail(data);
                break;

            case 'ticket_status_change':
                emailContent = ticketStatusChangeEmail(data);
                break;

            case 'project_created':
                emailContent = projectCreatedEmail(data);
                break;

            case 'weekly_digest':
                emailContent = weeklyDigestEmail(data);
                break;

            default:
                return NextResponse.json(
                    { error: `Unknown email type: ${type}` },
                    { status: 400 }
                );
        }

        const result = await resend.emails.send({
            from: `Cengineers Kanban <${FROM_EMAIL}>`,
            to: Array.isArray(to) ? to : [to],
            subject: emailContent.subject,
            html: emailContent.html,
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Email sending failed:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}
