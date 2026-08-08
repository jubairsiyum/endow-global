'use client'

import { useState, useRef } from 'react'
import { Upload, Link2, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { SAButton } from './SAButton'

interface Props {
  value: string
  onChange: (url: string) => void
  label: string
  previewHeight?: number
}

export function ImageUploader({ value, onChange, label, previewHeight = 96 }: Props) {
  const [urlInput, setUrlInput] = useState(value || '')
  const [preview, setPreview] = useState(value || '')
  const [previewError, setPreviewError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleUrlFetch() {
    if (!urlInput.trim()) return
    try { new URL(urlInput.trim()) } catch { return }
    setPreview(urlInput.trim())
    setPreviewError(false)
    onChange(urlInput.trim())
  }

  function handleUrlChange(val: string) {
    setUrlInput(val)
    if (val.trim()) {
      try { new URL(val.trim()) } catch { return }
      setPreview(val.trim())
      setPreviewError(false)
      onChange(val.trim())
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Upload failed')
      }
      const json = await res.json()
      const uploadedUrl = json?.url
      if (uploadedUrl) {
        setPreview(uploadedUrl)
        setUrlInput(uploadedUrl)
        setPreviewError(false)
        onChange(uploadedUrl)
      } else {
        setPreviewError(true)
      }
    } catch {
      setPreviewError(true)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function clearPreview() {
    setPreview('')
    setUrlInput('')
    setPreviewError(false)
    onChange('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium" style={{ color: '#6b7280' }}>{label}</span>
        <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
          <button
            type="button"
            onClick={() => setMode('url')}
            className="px-2.5 py-1 text-[11px] font-medium transition-colors"
            style={{ background: mode === 'url' ? '#e5e7eb' : '#f8fafc', color: mode === 'url' ? '#111827' : '#6b7280' }}
          >
            <Link2 size={12} className="inline mr-1" />URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className="px-2.5 py-1 text-[11px] font-medium transition-colors"
            style={{ background: mode === 'upload' ? '#e5e7eb' : '#f8fafc', color: mode === 'upload' ? '#111827' : '#6b7280' }}
          >
            <Upload size={12} className="inline mr-1" />Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={handleUrlFetch}
            placeholder="https://cdn.example.com/image.png"
            className="flex-1 rounded-md border px-3 py-1.5 text-[13px] outline-none"
            style={{ background: '#f8fafc', borderColor: '#e5e7eb', color: '#111827' }}
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
            className="flex items-center justify-center gap-2 rounded-md border border-dashed px-3 py-4 cursor-pointer transition-colors hover:border-[#E8A33D]/50"
            style={{ borderColor: '#e5e7eb', background: '#f8fafc' }}
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" style={{ color: '#E8A33D' }} />
            ) : (
              <Upload size={16} style={{ color: '#6b7280' }} />
            )}
            <div className="text-left">
              <span className="block text-[12px]" style={{ color: '#6b7280' }}>
                {uploading ? 'Uploading...' : 'Click or drag to upload (max 8MB)'}
              </span>
              <span className="block text-[10px]" style={{ color: 'rgba(136,144,168,0.6)' }}>
                Recommended: 500 Ã— 500 px, PNG or JPG
              </span>
            </div>
          </label>
        </div>
      )}

      {/* Preview */}
      {preview && !previewError && (
        <div className="relative inline-flex" style={{ height: previewHeight }}>
          <div className="h-full rounded-lg border overflow-hidden flex items-center justify-center" style={{ background: '#f8fafc', borderColor: '#e5e7eb', aspectRatio: preview === value && value.includes('cover') ? '16/9' : '1/1' }}>
            <img
              src={preview}
              alt={label}
              className="max-h-full max-w-full object-contain"
              onError={() => setPreviewError(true)}
            />
          </div>
          <button
            type="button"
            onClick={clearPreview}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center shadow"
            style={{ background: '#F0625B' }}
          >
            <X size={10} className="text-white" />
          </button>
        </div>
      )}

      {previewError && (
        <div className="flex items-center gap-2 text-[11px]" style={{ color: '#F0625B' }}>
          <ImageIcon size={12} /> Failed to load image preview. The URL may be invalid or inaccessible.
        </div>
      )}
    </div>
  )
}
