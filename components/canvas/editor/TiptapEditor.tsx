'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle as TextStyleExt } from '@tiptap/extension-text-style'
import { Color as ColorExt } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Highlighter, Undo2, Redo2
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  contentJson?: unknown
  onChange: (html: string, json: unknown) => void
  placeholder?: string
}

export function TiptapEditor({ content, contentJson, onChange, placeholder = 'Votre texte ici...' }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyleExt,
      ColorExt,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: contentJson || content || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML(), ed.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content prose prose-sm max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-sm',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-1.5 py-1 border-b border-[var(--border)]" style={{ background: 'var(--surface-secondary)' }}>
        {/* Text formatting */}
        <ToolbarBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Gras"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italique"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Souligné"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Barré"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[var(--border)] mx-0.5" />

        {/* Headings */}
        <ToolbarBtn
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Titre 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Titre 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Titre 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[var(--border)] mx-0.5" />

        {/* Alignment */}
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Gauche"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Centre"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Droite"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[var(--border)] mx-0.5" />

        {/* Lists */}
        <ToolbarBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Liste à puces"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Liste numérotée"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[var(--border)] mx-0.5" />

        {/* Block quote + Highlight */}
        <ToolbarBtn
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Citation"
        >
          <Quote className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#FEF08A' }).run()}
          title="Surligner"
        >
          <Highlighter className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Annuler"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rétablir"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* Tiptap styles */}
      <style jsx global>{`
        .tiptap-content {
          color: var(--foreground);
        }
        .tiptap-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--foreground-secondary);
          opacity: 0.4;
          pointer-events: none;
          height: 0;
        }
        .tiptap-content h1 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
        .tiptap-content h2 { font-size: 1.25em; font-weight: 600; margin: 0.4em 0; }
        .tiptap-content h3 { font-size: 1.1em; font-weight: 600; margin: 0.3em 0; }
        .tiptap-content p { margin: 0.3em 0; }
        .tiptap-content ul, .tiptap-content ol { padding-left: 1.2em; margin: 0.3em 0; }
        .tiptap-content li { margin: 0.15em 0; }
        .tiptap-content blockquote {
          border-left: 3px solid var(--sage);
          padding-left: 0.8em;
          margin: 0.5em 0;
          color: var(--foreground-secondary);
          font-style: italic;
        }
        .tiptap-content mark {
          background-color: #FEF08A;
          border-radius: 2px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  )
}

function ToolbarBtn({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'bg-[var(--sage)]/15 text-[var(--sage)]'
          : 'text-[var(--foreground-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}
