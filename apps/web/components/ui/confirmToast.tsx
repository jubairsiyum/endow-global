'use client'

import { toast } from 'sonner'

interface ConfirmToastOptions {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  tone?: 'default' | 'danger'
}

/**
 * Modern replacement for window.confirm() — a toast-based confirmation with
 * explicit Cancel / Confirm actions instead of the browser's native dialog.
 */
export function confirmToast(opts: ConfirmToastOptions) {
  const tone = opts.tone ?? 'default'
  const confirmCls =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200'

  toast.custom(
    (t) => (
      <div className="w-[360px] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-[#12141c]">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{opts.title}</p>
        <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">{opts.description}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => toast.dismiss(t)}
            className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {opts.cancelLabel || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              opts.onConfirm()
              toast.dismiss(t)
            }}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold text-white transition-colors ${confirmCls}`}
          >
            {opts.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  )
}
