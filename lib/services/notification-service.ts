import { User, Ticket } from "@/lib/types";

type NotificationType = 
  | "ticket_assigned" 
  | "ticket_mentioned" 
  | "ticket_status_change"
  | "meeting_scheduled"
  | "meeting_reminder"
  | "project_created"
  | "document_shared";

interface EmailTemplate {
  subject: string;
  body: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
  user: User;
  linkTo?: string;
}

class NotificationService {
  // In-memory storage for development purposes
  // In real app, this would connect to a database
  private notifications: Notification[] = [];

  constructor() {
    console.log("Notification service initialized");
  }

  // Create a notification and send email if required
  async notify(
    user: User, 
    type: NotificationType, 
    data: any, 
    sendEmail: boolean = true
  ): Promise<Notification> {
    const notification = this.createNotification(user, type, data);
    
    this.notifications.push(notification);
    
    console.log(`Notification created for ${user.name}: ${notification.title}`);
    
    if (sendEmail) {
      await this.sendEmail(user, notification, this.getEmailTemplate(type, data));
    }
    
    return notification;
  }

  // Create notification object based on type and data
  private createNotification(user: User, type: NotificationType, data: any): Notification {
    const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const createdAt = new Date().toISOString();
    
    let title = "";
    let message = "";
    let linkTo = "";
    
    switch (type) {
      case "ticket_assigned":
        title = "Ticket Assigned";
        message = `Ticket "${data.title}" has been assigned to you by ${data.assignedBy.name}`;
        linkTo = `/projects/${data.projectId}?ticket=${data.ticketId}`;
        break;
      
      case "ticket_mentioned":
        title = "You were mentioned";
        message = `${data.mentionedBy.name} mentioned you in ticket "${data.title}"`;
        linkTo = `/projects/${data.projectId}?ticket=${data.ticketId}`;
        break;
      
      case "ticket_status_change":
        title = "Ticket Status Changed";
        message = `Ticket "${data.title}" was moved to ${data.newStatus} by ${data.changedBy.name}`;
        linkTo = `/projects/${data.projectId}?ticket=${data.ticketId}`;
        break;
      
      case "meeting_scheduled":
        title = "New Meeting";
        message = `${data.organizer.name} scheduled a meeting: ${data.title}`;
        linkTo = `/meetings`;
        break;
      
      case "meeting_reminder":
        title = "Meeting Reminder";
        message = `Reminder: ${data.title} starts in ${data.timeRemaining}`;
        linkTo = `/meetings`;
        break;

      case "project_created":
        title = "New Project";
        message = `You've been added to project "${data.projectName}" by ${data.createdBy.name}`;
        linkTo = `/projects/${data.projectId}`;
        break;

      case "document_shared":
        title = "Document Shared";
        message = `${data.sharedBy.name} shared "${data.documentName}" with you`;
        linkTo = `/documents/${data.documentId}`;
        break;
    }
    
    return {
      id,
      type,
      title,
      message,
      createdAt,
      readAt: null,
      user,
      linkTo
    };
  }

  // Get notifications for a specific user
  getUserNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.user.id === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.readAt = new Date().toISOString();
    }
  }

  // Mark all notifications for a user as read
  markAllAsRead(userId: string): void {
    this.notifications
      .filter(n => n.user.id === userId && !n.readAt)
      .forEach(n => n.readAt = new Date().toISOString());
  }

  // Send email notification
  private async sendEmail(user: User, notification: Notification, template: EmailTemplate): Promise<void> {
    // In a real application, this would connect to an email service like SendGrid, Mailchimp, etc.
    console.log(`[EMAIL] To: ${user.email}, Subject: ${template.subject}`);
    console.log(`[EMAIL] Body: ${template.body}`);
    
    // For demo purposes, we'll just log the email
    return Promise.resolve();
  }

  // Create email templates based on notification type
  private getEmailTemplate(type: NotificationType, data: any): EmailTemplate {
    let subject = "";
    let body = "";
    
    switch (type) {
      case "ticket_assigned":
        subject = `[Cengineers] Ticket Assigned: ${data.title}`;
        body = `
          <h2>You've been assigned a new ticket</h2>
          <p>Hello ${data.user.name},</p>
          <p>${data.assignedBy.name} has assigned you to the ticket "${data.title}".</p>
          <p>Priority: ${data.priority}</p>
          <p>Due Date: ${new Date(data.dueDate).toLocaleDateString()}</p>
          <div style="margin-top: 20px;">
            <a href="https://cengineers.com/projects/${data.projectId}?ticket=${data.ticketId}"
              style="background-color: #2962FF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
              View Ticket
            </a>
          </div>
        `;
        break;
      
      case "ticket_mentioned":
        subject = `[Cengineers] You were mentioned in a ticket`;
        body = `
          <h2>You were mentioned in a ticket</h2>
          <p>Hello ${data.user.name},</p>
          <p>${data.mentionedBy.name} mentioned you in the ticket "${data.title}":</p>
          <blockquote style="border-left: 4px solid #ddd; margin: 15px 0; padding: 10px 15px;">
            ${data.commentText}
          </blockquote>
          <div style="margin-top: 20px;">
            <a href="https://cengineers.com/projects/${data.projectId}?ticket=${data.ticketId}"
              style="background-color: #2962FF; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
              View Comment
            </a>
          </div>
        `;
        break;
      
      // Add templates for other notification types here
      default:
        subject = `[Cengineers] ${notification.title}`;
        body = `<p>${notification.message}</p>`;
    }
    
    return { subject, body };
  }

  // Process mention in ticket comments and notify mentioned users
  async processMentions(ticketId: string, comment: string, mentionedBy: User, ticket: Ticket, projectId: string): Promise<void> {
    // Parse @ mentions from comment
    const mentionRegex = /@(\w+)/g;
    const mentions = comment.match(mentionRegex) || [];
    
    for (const mention of mentions) {
      const username = mention.substring(1); // Remove the @ symbol
      
      // In a real app, lookup the user by username
      // For demo, we'll use a mock user
      const mockUser = {
        id: "user-mentioned",
        name: username,
        email: `${username}@example.com`,
        role: "engineer",
        status: "active",
        lastActive: new Date().toISOString(),
        avatar: "/placeholder.svg"
      };
      
      // Notify the mentioned user
      await this.notify(mockUser, "ticket_mentioned", {
        ticketId,
        projectId,
        title: ticket.title,
        mentionedBy,
        user: mockUser,
        commentText: comment
      });
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
