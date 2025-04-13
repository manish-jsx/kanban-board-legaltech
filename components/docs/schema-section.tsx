"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Table } from "lucide-react"

interface TableColumn {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

interface TableRelationship {
  table: string;
  columns: string;
  relation: string;
}

interface TableSchemaProps {
  name: string;
  description: string;
  columns: TableColumn[];
  relationships: TableRelationship[];
}

function TableSchema({ name, description, columns, relationships }: TableSchemaProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5" />
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-sm font-medium">Column</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Constraints</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {columns.map((column, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-sm font-mono">{column.name}</td>
                  <td className="px-4 py-2 text-sm font-mono">{column.type}</td>
                  <td className="px-4 py-2 text-sm">{column.constraints}</td>
                  <td className="px-4 py-2 text-sm">{column.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Relationships</h4>
          <ul className="space-y-2">
            {relationships.map((rel, i) => (
              <li key={i} className="text-sm">
                <span className="font-mono">{rel.table}</span> ({rel.columns}): {rel.relation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export function SchemaSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Database Schema</CardTitle>
          </div>
          <CardDescription>
            Structure of the Vercel Postgres database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            This application uses Vercel Postgres as its primary database.
            Below is the database schema and table relationships.
          </p>

          <Tabs defaultValue="users">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 h-auto">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="users">
                <TableSchema
                  name="users"
                  description="Stores user accounts and profile information"
                  columns={[
                    { name: "id", type: "varchar(255)", constraints: "PRIMARY KEY", description: "Unique identifier" },
                    { name: "name", type: "varchar(255)", constraints: "NOT NULL", description: "User's full name" },
                    { name: "email", type: "varchar(255)", constraints: "UNIQUE NOT NULL", description: "User's email address" },
                    { name: "password_hash", type: "varchar(255)", constraints: "NOT NULL", description: "Hashed user password" },
                    { name: "role", type: "varchar(50)", constraints: "NOT NULL", description: "User role (admin, manager, engineer, member)" },
                    { name: "avatar", type: "varchar(255)", constraints: "", description: "URL to user's avatar image" },
                    { name: "status", type: "varchar(50)", constraints: "NOT NULL DEFAULT 'active'", description: "User status (active, inactive)" },
                    { name: "last_active", type: "timestamp", constraints: "", description: "Last active timestamp" },
                    { name: "created_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Creation timestamp" },
                    { name: "updated_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Last update timestamp" },
                  ]}
                  relationships={[
                    { table: "project_members", columns: "user_id", relation: "user can be on many projects" },
                    { table: "tickets", columns: "assignee_id", relation: "user can be assigned to many tickets" },
                    { table: "tickets", columns: "created_by", relation: "user can create many tickets" },
                  ]}
                />
              </TabsContent>
              <TabsContent value="projects">
                <TableSchema
                  name="projects"
                  description="Main projects in the kanban system"
                  columns={[
                    { name: "id", type: "varchar(255)", constraints: "PRIMARY KEY", description: "Unique identifier" },
                    { name: "name", type: "varchar(255)", constraints: "NOT NULL", description: "Project name" },
                    { name: "description", type: "text", constraints: "", description: "Project description" },
                    { name: "status", type: "varchar(50)", constraints: "NOT NULL DEFAULT 'active'", description: "Project status (active, archived, completed)" },
                    { name: "created_by", type: "varchar(255)", constraints: "NOT NULL REFERENCES users(id)", description: "User who created the project" },
                    { name: "created_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Creation timestamp" },
                    { name: "updated_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Last update timestamp" },
                  ]}
                  relationships={[
                    { table: "project_members", columns: "project_id", relation: "project can have many members" },
                    { table: "board_columns", columns: "project_id", relation: "project has many kanban columns" },
                    { table: "tickets", columns: "project_id", relation: "project can have many tickets" },
                  ]}
                />
              </TabsContent>
              <TabsContent value="tickets">
                <TableSchema
                  name="tickets"
                  description="Tickets/tasks in projects"
                  columns={[
                    { name: "id", type: "varchar(255)", constraints: "PRIMARY KEY", description: "Unique identifier" },
                    { name: "title", type: "varchar(255)", constraints: "NOT NULL", description: "Ticket title" },
                    { name: "description", type: "text", constraints: "", description: "Ticket description" },
                    { name: "project_id", type: "varchar(255)", constraints: "NOT NULL REFERENCES projects(id)", description: "Project this ticket belongs to" },
                    { name: "column_id", type: "varchar(255)", constraints: "NOT NULL REFERENCES board_columns(id)", description: "Kanban column this ticket belongs to" },
                    { name: "assignee_id", type: "varchar(255)", constraints: "REFERENCES users(id)", description: "User assigned to the ticket" },
                    { name: "created_by", type: "varchar(255)", constraints: "NOT NULL REFERENCES users(id)", description: "User who created the ticket" },
                    { name: "priority", type: "varchar(50)", constraints: "NOT NULL DEFAULT 'medium'", description: "Ticket priority (low, medium, high)" },
                    { name: "due_date", type: "timestamp", constraints: "", description: "Due date for completion" },
                    { name: "created_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Creation timestamp" },
                    { name: "updated_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Last update timestamp" },
                  ]}
                  relationships={[
                    { table: "comments", columns: "ticket_id", relation: "ticket can have many comments" },
                    { table: "attachments", columns: "ticket_id", relation: "ticket can have many attachments" },
                    { table: "users", columns: "assignee_id", relation: "ticket is assigned to a user" },
                    { table: "users", columns: "created_by", relation: "ticket is created by a user" },
                  ]}
                />
              </TabsContent>
              <TabsContent value="comments">
                <TableSchema
                  name="comments"
                  description="Comments on tickets"
                  columns={[
                    { name: "id", type: "varchar(255)", constraints: "PRIMARY KEY", description: "Unique identifier" },
                    { name: "ticket_id", type: "varchar(255)", constraints: "NOT NULL REFERENCES tickets(id)", description: "Ticket this comment belongs to" },
                    { name: "user_id", type: "varchar(255)", constraints: "NOT NULL REFERENCES users(id)", description: "User who created the comment" },
                    { name: "content", type: "text", constraints: "NOT NULL", description: "Comment content" },
                    { name: "created_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Creation timestamp" },
                    { name: "updated_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Last update timestamp" },
                  ]}
                  relationships={[
                    { table: "tickets", columns: "ticket_id", relation: "comment belongs to a ticket" },
                    { table: "users", columns: "user_id", relation: "comment is created by a user" },
                  ]}
                />
              </TabsContent>
              <TabsContent value="attachments">
                <TableSchema
                  name="attachments"
                  description="File attachments for tickets"
                  columns={[
                    { name: "id", type: "varchar(255)", constraints: "PRIMARY KEY", description: "Unique identifier" },
                    { name: "ticket_id", type: "varchar(255)", constraints: "REFERENCES tickets(id)", description: "Ticket this attachment belongs to" },
                    { name: "article_id", type: "varchar(255)", constraints: "REFERENCES knowledge_articles(id)", description: "Knowledge article this attachment belongs to" },
                    { name: "file_name", type: "varchar(255)", constraints: "NOT NULL", description: "Original filename" },
                    { name: "file_url", type: "varchar(255)", constraints: "NOT NULL", description: "URL to file storage (UploadThing)" },
                    { name: "file_key", type: "varchar(255)", constraints: "NOT NULL", description: "Unique key in file storage" },
                    { name: "file_size", type: "integer", constraints: "NOT NULL", description: "File size in bytes" },
                    { name: "uploaded_by", type: "varchar(255)", constraints: "NOT NULL REFERENCES users(id)", description: "User who uploaded the file" },
                    { name: "content_type", type: "varchar(255)", constraints: "", description: "MIME type of the file" },
                    { name: "created_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Upload timestamp" },
                  ]}
                  relationships={[
                    { table: "tickets", columns: "ticket_id", relation: "attachment can belong to a ticket" },
                    { table: "knowledge_articles", columns: "article_id", relation: "attachment can belong to an article" },
                    { table: "users", columns: "uploaded_by", relation: "attachment is uploaded by a user" },
                  ]}
                />
              </TabsContent>
              <TabsContent value="knowledge">
                <TableSchema
                  name="knowledge_articles"
                  description="Knowledge base articles"
                  columns={[
                    { name: "id", type: "varchar(255)", constraints: "PRIMARY KEY", description: "Unique identifier" },
                    { name: "title", type: "varchar(255)", constraints: "NOT NULL", description: "Article title" },
                    { name: "content", type: "text", constraints: "NOT NULL", description: "Article content in Markdown" },
                    { name: "content_html", type: "text", constraints: "NOT NULL", description: "Article content as HTML" },
                    { name: "summary", type: "text", constraints: "", description: "Short summary" },
                    { name: "category", type: "varchar(255)", constraints: "NOT NULL", description: "Article category" },
                    { name: "author_id", type: "varchar(255)", constraints: "NOT NULL REFERENCES users(id)", description: "User who wrote the article" },
                    { name: "views", type: "integer", constraints: "NOT NULL DEFAULT 0", description: "View count" },
                    { name: "created_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Creation timestamp" },
                    { name: "updated_at", type: "timestamp", constraints: "NOT NULL DEFAULT NOW()", description: "Last update timestamp" },
                  ]}
                  relationships={[
                    { table: "article_tags", columns: "article_id", relation: "article can have many tags" },
                    { table: "attachments", columns: "article_id", relation: "article can have many attachments" },
                    { table: "users", columns: "author_id", relation: "article is written by a user" },
                  ]}
                />

                <div className="mt-6">
                  <TableSchema
                    name="article_tags"
                    description="Tags for knowledge articles"
                    columns={[
                      { name: "article_id", type: "varchar(255)", constraints: "NOT NULL REFERENCES knowledge_articles(id)", description: "Article ID" },
                      { name: "tag", type: "varchar(100)", constraints: "NOT NULL", description: "Tag name" },
                    ]}
                    relationships={[
                      { table: "knowledge_articles", columns: "article_id", relation: "many-to-many relationship with articles" },
                    ]}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
