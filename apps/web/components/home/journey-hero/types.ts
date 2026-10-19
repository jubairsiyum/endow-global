export interface JourneyTheme {
  /** Headings, outlines, dark UI (e.g. #09090b) */
  ink: string;
  /** Body copy (e.g. #52525b) */
  text: string;
  /** Primary brand accent - Endow Crimson (e.g. #C41E3A) */
  accent: string;
  /** Darker accent shade (e.g. #A01830) */
  accentDark?: string;
  /** Accent for status pills, badges, route nodes (e.g. #E8A33D or #C41E3A) */
  lime: string;
  /** Active highlight dots on the map (Bangladesh & South Korea in brand red) */
  map: string;
  /** Muted dots for surrounding land (e.g. #cbd5e1) */
  mapMuted: string;
  /** Ocean dots (e.g. #e2e8f0) */
  ocean: string;
  /** Section background (e.g. #ffffff) */
  surface: string;
  /** Globe disc gradient: [centre, edge] */
  disc: [string, string];
  /** Four puzzle-piece fills (top-left, top-right, bottom-left, bottom-right) */
  puzzle: [string, string, string, string];
  /** City card background */
  card: string;
  /** Button corner radius (px) */
  radius: number;
}

export interface Place {
  label: string;
  lon: number;
  lat: number;
  /** Must match a country name in geo-data.ts */
  country: string;
  /** Pill placement relative to pin (in px at 460px stage width) */
  pill?: { x: number; y: number };
  /** Glyph or badge shown in the pill */
  glyph?: string;
  /** Subtitle or country flag label */
  sublabel?: string;
}

export interface JourneyStep {
  id: string;
  label: string;
  /** Glyph or milestone icon inside the node + puzzle piece */
  glyph: string;
  /** Subtitle / micro text */
  sub?: string;
  /** Position along the flight arc, 0–1 */
  at: number;
  /** Where the label pill sits relative to the node */
  side: "left" | "right" | "top" | "bottom";
}

export interface City {
  id: string;
  name: string;
  /** Native Korean Hangul name, e.g. 서울, 부산 */
  native?: string;
  lon: number;
  lat: number;
  /** Photo URL or illustration fallback */
  image?: string;
  /** Optional click destination link */
  href?: string;
  /** Featured university in this city */
  university?: string;
  /** Quality badge, e.g. "QS World #41" or "Top National Uni" */
  rankBadge?: string;
  /** TOPIK requirement, e.g. "TOPIK 3+" */
  topikLevel?: string;
  /** Visa approval stat, e.g. "99.4% Approved" */
  visaRate?: string;
  /** Popular study fields */
  programs?: string;
}

export interface Brand {
  name: string;
  tagline: string;
  subtag?: string;
  showLogo?: boolean;
}

export interface TrustBadge {
  value: string;
  label: string;
}

export interface MotionOptions {
  /** 1 = default pace, 1.2 = slightly faster */
  speed: number;
  /** "play" runs full intro, "skip" jumps straight to Korea map */
  intro: "play" | "skip";
  /** Replay intro after all cards cycle */
  loop: boolean;
  /** Auto-advance city cards */
  autoplayCards: boolean;
  /** ms between cards */
  cardInterval: number;
  /** 3D pointer tilt / parallax on the stage */
  tilt: boolean;
  /** Dot spacing as fraction of stage width (globe view) */
  dotPitch: number;
  /** Dot spacing as fraction of stage width (country view) */
  dotPitchZoom: number;
  /** Show replay button */
  replayButton: boolean;
}

export interface JourneyCopy {
  badge?: string;
  eyebrow: string;
  /** Headline lines. `highlight` colours line in brand accent */
  lines: { text: string; highlight?: boolean }[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  trustBadges?: TrustBadge[];
}

export interface JourneyConfig {
  copy: JourneyCopy;
  origin: Place;
  destination: Place;
  steps: JourneyStep[];
  brand: Brand;
  cities: City[];
  theme: JourneyTheme;
  motion: MotionOptions;
  /** Camera used for the "country" view */
  focus: { lon: number; lat: number; zoom: number };
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

/** Imperative handle (pass controllerRef to <JourneyHero/>) */
export interface JourneyController {
  replay(): void;
  seek(seconds: number): void;
  skipIntro(): void;
  duration(): number;
  showCity(id: string): void;
}

