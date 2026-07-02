export const ds = {
  // ═══════════════════════════════════════════
  // COLOR TOKENS (reference values)
  // ═══════════════════════════════════════════
  color: {
    brand: '#C41E3A',
    brandDark: '#A01830',
    brandLight: '#FEF2F2',
    brandHover: '#B11A33',
    redGradient: '#EF4444',
    textPrimary: '#111827',
    textDark: '#0F172A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textSlate: '#64748B',
    textSlateDark: '#475569',
    borderDefault: '#E5E7EB',
    borderLight: '#ECECEC',
    borderWarm: '#F1F5F9',
    bgWhite: '#ffffff',
    bgLight: '#F8FAFC',
    bgLighter: '#FAFAFA',
    bgWarm: '#FBFAF7',
    red50: '#FEF2F2',
    red100: '#FEECEF',
  },

  // ═══════════════════════════════════════════
  // SECTION
  // ═══════════════════════════════════════════
  section: {
    base: 'relative',
    padding: 'py-24 lg:py-32',
    paddingCompact: 'py-12 lg:py-16',
    bg: {
      white: 'bg-white',
      light: 'bg-[var(--bg-light)]',
      lighter: 'bg-[var(--bg-lighter)]',
      redTint: 'bg-[var(--brand-light)]',
    },
    border: {
      y: 'border-y border-[var(--border-default)]',
    },
  },

  // ═══════════════════════════════════════════
  // CONTAINER
  // ═══════════════════════════════════════════
  container: {
    base: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
    narrow: 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8',
    wide: 'mx-auto max-w-[1380px] px-6 lg:px-10 xl:px-12',
    prose: 'mx-auto max-w-2xl',
  },

  // ═══════════════════════════════════════════
  // HEADING (backward-compatible string)
  // ═══════════════════════════════════════════
  heading: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',

  // ═══════════════════════════════════════════
  // HEADING (typed variants)
  // ═══════════════════════════════════════════
  headings: {
    section: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight',
    sectionLight: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white',
    hero: 'text-[34px] font-extrabold leading-[0.92] tracking-[-1.5px] md:text-[40px] lg:text-[52px]',
    card: 'text-2xl font-bold',
    cardMd: 'text-lg font-bold',
    sub: 'text-xl font-bold',
    sm: 'text-sm font-bold',
    xs: 'text-xs font-bold',
  },

  // ═══════════════════════════════════════════
  // SECTION HEADER (heading + subheading pattern)
  // ═══════════════════════════════════════════
  sectionHeader: {
    wrapper: 'mb-16 text-center',
    wrapperTight: 'mb-10 text-center',
    title: 'mb-4 text-[var(--text-primary)]',
    titleDark: 'mb-4 text-[var(--text-dark)]',
    subtitle: 'mx-auto max-w-2xl text-xl text-[var(--text-secondary)]',
    subtitleSm: 'mx-auto max-w-2xl text-lg text-[var(--text-secondary)]',
  },

  // ═══════════════════════════════════════════
  // BODY TEXT
  // ═══════════════════════════════════════════
  body: {
    base: 'text-base leading-7 text-[var(--text-secondary)]',
    sm: 'text-sm leading-relaxed text-[var(--text-secondary)]',
    lg: 'text-lg leading-relaxed text-[var(--text-secondary)]',
    primary: 'text-[var(--text-primary)]',
    primaryDark: 'text-[var(--text-dark)]',
    muted: 'text-xs text-[var(--text-secondary)]',
    white: 'text-white',
    whiteSub: 'text-white/80',
  },

  // ═══════════════════════════════════════════
  // CARD
  // ═══════════════════════════════════════════
  card: {
    base: 'bg-white border border-[var(--border-default)] overflow-hidden transition-all duration-300',
    rounded: 'rounded-xl',
    roundedLg: 'rounded-[20px]',
    roundedXl: 'rounded-3xl',
    shadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
    shadowHover: 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]',
    shadowSm: 'shadow-[0_2px_10px_rgba(0,0,0,0.02)]',
    shadowSmHover: 'hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
    shadowBrand: 'shadow-[0_15px_40px_rgba(196,30,58,0.08)]',
    shadowBrandHover: 'hover:shadow-[0_20px_50px_rgba(196,30,58,0.12)]',
    interactive: 'group cursor-pointer',
    padding: 'p-6',
    paddingLg: 'p-8',
    paddingXl: 'p-12',
  },

  // ═══════════════════════════════════════════
  // BUTTON
  // ═══════════════════════════════════════════
  button: {
    primary: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--brand-dark)]',
    primaryLg: 'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 h-[52px] text-sm font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]',
    primarySquare: 'inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-6 h-12 text-sm font-semibold text-white transition-colors hover:bg-red-700',
    primaryFull: 'block w-full rounded-xl py-3.5 text-center font-semibold text-white transition-all duration-300 hover:scale-[1.02] bg-[var(--brand)]',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--brand)] bg-white px-6 h-[52px] text-sm font-bold text-[var(--brand)] shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
    ghost: 'inline-flex items-center gap-1 text-base font-semibold text-[var(--brand)] transition-all hover:gap-2',
    ghostLg: 'flex items-center gap-2 text-base font-semibold text-[var(--brand)] transition-all group-hover:gap-3',
    disabled: 'block w-full rounded-xl py-3.5 text-center font-semibold text-gray-400 bg-gray-100 cursor-not-allowed',
  },

  // ═══════════════════════════════════════════
  // BADGE / PILL
  // ═══════════════════════════════════════════
  badge: {
    base: 'inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-light)] px-4 text-xs font-semibold text-[var(--brand)]',
    sm: 'inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-light)] px-3.5',
    lg: 'inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-light)] px-4',
    outline: 'rounded-full border border-[var(--border-default)] bg-white px-3 py-1 text-xs font-semibold text-[var(--brand)]',
    outlineLight: 'rounded-full border border-[var(--border-default)] bg-[var(--bg-light)] px-4 text-sm font-semibold',
    downloadBadge: 'flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gray-500 transition-colors group-hover:border-red-100 group-hover:bg-red-50 group-hover:text-[var(--brand)]',
    stepBadge: 'mb-3 inline-flex items-center rounded-full bg-[#FEECEF] px-3 py-1 self-start',
  },

  // ═══════════════════════════════════════════
  // DIVIDER
  // ═══════════════════════════════════════════
  divider: {
    border: 'border-t border-[var(--border-default)]',
    line: 'h-px bg-[var(--border-default)]',
    connector: 'w-px h-5 bg-[var(--border-default)]',
  },

  // ═══════════════════════════════════════════
  // ACCENT ELEMENTS
  // ═══════════════════════════════════════════
  accent: {
    dot: 'h-2 w-2 rounded-full bg-[var(--brand)]',
    dotSm: 'w-1.5 h-1.5 rounded-full bg-[var(--brand)]',
    line: 'h-0.5 w-8 rounded-full bg-[var(--brand)]',
    bar: 'w-10 h-1 rounded-full bg-[var(--brand)]',
    barTop: 'absolute left-0 top-0 h-1 w-full',
    strip: 'h-1 w-24 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent-red-gradient)]',
  },

  // ═══════════════════════════════════════════
  // SHADOW (raw values for inline use)
  // ═══════════════════════════════════════════
  shadow: {
    sm: 'shadow-[0_2px_10px_rgba(0,0,0,0.02)]',
    smHover: 'hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
    card: 'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
    cardHover: 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]',
    stat: 'shadow-[0_6px_16px_rgba(15,23,42,0.05)]',
    statHover: 'hover:shadow-md',
    hero: 'shadow-[0_20px_60px_rgba(15,23,42,0.1)]',
    heroHover: 'hover:shadow-[0_30px_80px_rgba(15,23,42,0.15)]',
    tip: 'shadow-[0_10px_40px_rgba(0,0,0,0.04)]',
    tipHover: 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]',
    brandHover: 'hover:shadow-[0_15px_40px_rgba(196,30,58,0.08)]',
    brandLg: 'shadow-[0_10px_30px_rgba(196,30,58,0.14)]',
    newsletter: 'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
    icon: 'shadow-[0_8px_20px_rgba(0,0,0,0.08)]',
  },

  // ═══════════════════════════════════════════
  // GRID
  // ═══════════════════════════════════════════
  grid: {
    cards3: 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
    cards4: 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4',
    cards4Sm: 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4',
    sidebar: 'grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10',
    cols2: 'grid grid-cols-1 gap-6 md:grid-cols-2',
    stats3: 'grid max-w-[580px] grid-cols-3 gap-4',
  },

  // ═══════════════════════════════════════════
  // INPUT
  // ═══════════════════════════════════════════
  input: {
    base: 'flex-1 rounded-lg bg-white px-6 py-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600',
  },
} as const

/** @deprecated Use `ds` instead */
export const designSystem = ds
