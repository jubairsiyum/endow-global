'use client'

import dynamic from 'next/dynamic'
import './quill-editor.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'blockquote', 'code-block'],
    ['clean'],
  ],
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'align',
  'link', 'blockquote', 'code-block',
]

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

export function QuillEditor({ value, onChange, placeholder, minHeight = 180 }: Props) {
  return (
    <div className="sa-quill-editor" style={{ '--ql-min-height': `${minHeight}px` } as React.CSSProperties}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write course description...'}
      />
    </div>
  )
}
