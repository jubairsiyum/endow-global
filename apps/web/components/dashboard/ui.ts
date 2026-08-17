// Shared design tokens for the student dashboard.
// Keep every page using the same radius, border, shadow, spacing, and accent
// so the whole dashboard feels like one product.

export const panel =
  'rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#12141c]'

export const panelHover = 'transition-shadow hover:shadow-md'

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50'

export const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800'

export const btnGhost =
  'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'

export const input =
  'h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-500 dark:border-gray-700 dark:bg-[#12141c] dark:text-white dark:focus:border-rose-400'

export const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'

export const progressTrack = 'h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800'

export const progressFill = 'h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400'

// Reusable "View all" link shown in panel headers.
export const viewAllLink =
  'inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200'
