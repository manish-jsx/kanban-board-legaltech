'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Bold, Italic, Strikethrough, Code, List, ListOrdered,
    Heading1, Heading2, Heading3, Quote, Minus, Link as LinkIcon,
    Highlighter, Undo, Redo, Pilcrow
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    editable?: boolean
    className?: string
    minHeight?: string
}

function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) return null

    const items = [
        {
            icon: Bold,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: Italic,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: Strikethrough,
            title: 'Strikethrough',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            icon: Code,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            icon: Highlighter,
            title: 'Highlight',
            action: () => editor.chain().focus().toggleHighlight().run(),
            isActive: () => editor.isActive('highlight'),
        },
        { type: 'separator' as const },
        {
            icon: Heading1,
            title: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: Heading2,
            title: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: Heading3,
            title: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            icon: Pilcrow,
            title: 'Paragraph',
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: () => editor.isActive('paragraph'),
        },
        { type: 'separator' as const },
        {
            icon: List,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: ListOrdered,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: Quote,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: Minus,
            title: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
            isActive: () => false,
        },
        { type: 'separator' as const },
        {
            icon: LinkIcon,
            title: 'Link',
            action: () => {
                const url = window.prompt('Enter URL:')
                if (url) {
                    editor.chain().focus().setLink({ href: url }).run()
                }
            },
            isActive: () => editor.isActive('link'),
        },
        { type: 'separator' as const },
        {
            icon: Undo,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
            isActive: () => false,
        },
        {
            icon: Redo,
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
            isActive: () => false,
        },
    ]

    return (
        <div className="flex items-center gap-0.5 flex-wrap border-b p-1.5 bg-muted/30">
            {items.map((item, index) => {
                if ('type' in item && item.type === 'separator') {
                    return <Separator key={index} orientation="vertical" className="mx-1 h-6" />
                }
                const Item = item as any
                return (
                    <button
                        key={index}
                        onClick={Item.action}
                        className={cn(
                            'p-1.5 rounded-md transition-colors hover:bg-muted',
                            Item.isActive?.() && 'bg-muted text-foreground'
                        )}
                        title={Item.title}
                        type="button"
                    >
                        <Item.icon className="h-4 w-4" />
                    </button>
                )
            })}
        </div>
    )
}

export function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start writing...',
    editable = true,
    className,
    minHeight = '200px',
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Placeholder.configure({ placeholder }),
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-indigo-500 underline cursor-pointer' },
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4',
                    `min-h-[${minHeight}]`
                ),
            },
        },
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return (
        <div className={cn('rounded-lg border overflow-hidden bg-background', className)}>
            {editable && <MenuBar editor={editor} />}
            <div style={{ minHeight }}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
