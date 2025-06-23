import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaShieldAlt } from 'react-icons/fa'

// 🎯 Toolbar with advanced controls
const Toolbar = ({ editor }) => {
  const { t } = useTranslation();
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-base-300 rounded-t-xl bg-base-200/50 backdrop-blur-sm">
      <button
        type="button"
        className={`btn btn-sm gap-2 transition-all duration-300 ${
          editor.isActive('bold') 
            ? 'btn-primary shadow-lg shadow-primary/20' 
            : 'btn-ghost hover:bg-primary/10'
        }`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title={t('privacyPolicy.bold')}
      >
        <FaBold className="text-sm" />
      </button>
      <button
        type="button"
        className={`btn btn-sm gap-2 transition-all duration-300 ${
          editor.isActive('italic') 
            ? 'btn-primary shadow-lg shadow-primary/20' 
            : 'btn-ghost hover:bg-primary/10'
        }`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title={t('privacyPolicy.italic')}
      >
        <FaItalic className="text-sm" />
      </button>
      <button
        type="button"
        className={`btn btn-sm gap-2 transition-all duration-300 ${
          editor.isActive('underline') 
            ? 'btn-primary shadow-lg shadow-primary/20' 
            : 'btn-ghost hover:bg-primary/10'
        }`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title={t('privacyPolicy.underline')}
      >
        <FaUnderline className="text-sm" />
      </button>
      <div className="w-px h-6 bg-base-300 mx-1"></div>
      <button
        type="button"
        className={`btn btn-sm gap-2 transition-all duration-300 ${
          editor.isActive('bulletList') 
            ? 'btn-primary shadow-lg shadow-primary/20' 
            : 'btn-ghost hover:bg-primary/10'
        }`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title={t('privacyPolicy.bulletList')}
      >
        <FaListUl className="text-sm" />
      </button>
      <button
        type="button"
        className={`btn btn-sm gap-2 transition-all duration-300 ${
          editor.isActive('orderedList') 
            ? 'btn-primary shadow-lg shadow-primary/20' 
            : 'btn-ghost hover:bg-primary/10'
        }`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title={t('privacyPolicy.orderedList')}
      >
        <FaListOl className="text-sm" />
      </button>
    </div>
  )
}

const PrivacyPolicy = ({ formData, onInputChange }) => {
  const { t } = useTranslation();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        paragraph: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Bold,
      Italic,
      Underline,
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: formData.privacyPolicy || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onInputChange({ target: { name: 'privacyPolicy', value: html } })
    },
  })

  useEffect(() => {
    if (editor && formData.privacyPolicy !== editor.getHTML()) {
      editor.commands.setContent(formData.privacyPolicy || '', false)
    }
  }, [formData.privacyPolicy, editor])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t('privacyPolicy.title')}
        </h3>
        <p className="text-sm text-base-content/60">
          {t('privacyPolicy.description', 'Define your company\'s privacy policy')}
        </p>
      </div>

      <div className="rounded-xl border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <Toolbar editor={editor} />
        <div className="p-4 min-h-[16rem] bg-base-100">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none focus:outline-none min-h-[12rem]"
          />
        </div>
      </div>

      {!formData.privacyPolicy && (
        <div className="text-center py-8 bg-base-200/50 rounded-xl border border-dashed border-base-300">
          <FaShieldAlt className="mx-auto text-4xl text-base-content/30 mb-4" />
          <p className="text-base-content/60 text-lg">
            {t('privacyPolicy.emptyState', 'No privacy policy defined yet')}
          </p>
        </div>
      )}
    </div>
  )
}

export default PrivacyPolicy

