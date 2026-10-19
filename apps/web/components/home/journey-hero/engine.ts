import { gsap } from "gsap";
import type { GeoData } from "./geo-data";
import { KOREA_PROVINCES, PROVINCE_GROUPS, CITY_TO_PROVINCE_ID } from "./korea-provinces";
import type { JourneyConfig, JourneyController } from "./types";
import { geometry, lerpView, mercY, project, type Geometry, type View } from "./view";

const TAU = Math.PI * 2;
const RAD = Math.PI / 180;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------------------------------------
 * Timeline (seconds at speed 1)
 * Flight arc with steps -> Arrive -> Smooth Zoom to South Korea -> Explore
 * ---------------------------------------------------------------------------------------------- */
const T = {
  arcStart: 0.85,
  arcDur: 2.6,
  arrive: 3.45,
  fade: 3.65,
  morph: 3.75,
  morphDur: 1.65,
  cities: 5.15,
  explore: 5.4,
};

// Inverse curve for milestone node reveals as the plane reaches them
const p1inv = (y: number) => (y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt(2 * (1 - y)) / 2);

export type Phase = "intro" | "explore";

/**
 * Exact geographic influence radius (in design units) for each South Korean city.
 * Used for Voronoi-weighted territorial boundaries matching real Korean geography.
 */
export const CITY_RADII: Record<string, number> = {
  seoul: 22,
  incheon: 18,
  seongnam: 15,
  pyeongtaek: 18,
  cheonan: 18,
  cheongju: 20,
  seosan: 22,
  hongseong: 18,
  nonsan: 18,
  jeonju: 20,
  imsil: 18,
  daegu: 24,
  busan: 26,
  jeju: 32,
};

interface State {
  intro: number; // disc + frame fade in
  reveal: number; // radial dot wave
  pinO: number;
  pinD: number;
  planeA: number;
  arc: number; // fraction of arc flown
  pulse: number; // ripple on arrival in Korea
  n: Record<number, number>; // step nodes (1: TOPIK, 2: Admission, 3: Visa)
  l: Record<number, number>; // step labels
  fade: number; // flight route fades out
  morph: number; // camera zooms from globe to South Korea
  cities: number; // city dots appear
}

interface ThemeColors {
  map: string;
  muted: string;
  ocean: string;
  disc0: string;
  disc1: string;
  lime: string;
  ink: string;
}

export interface EngineOptions {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  config: JourneyConfig;
  geo: GeoData;
  onPhase: (p: Phase) => void;
  reducedMotion?: boolean;
}

export class JourneyEngine {
  private cfg: JourneyConfig;
  private root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private off: HTMLCanvasElement;
  private offCtx: CanvasRenderingContext2D;
  private geo: GeoData;
  private onPhase: (p: Phase) => void;

  private W = 0;
  private H = 0;
  private dpr = 1;
  private g!: Geometry;
  private S!: State;
  private tl!: gsap.core.Timeline;
  private phase: Phase = "intro";
  private dirty = true;
  private colors!: ThemeColors;
  private el = new Map<string, HTMLElement>();
  private cityEls: { el: HTMLElement; lon: number; lat: number }[] = [];
  private provinceEls = new Map<number, HTMLElement>();
  private ringBox = new Map<number[], [number, number, number, number]>();

  // province polygon cache & smooth transition weights
  private provPathKey = "";
  private provPathCache = new Map<number, Path2D>();
  private provinceWeights: Record<number, number> = {};
  private targetHoveredProvince: number | null = null;
  private activeHoveredProvince: number | null = null;

  // cached dot raster
  private dotKey = "";
  private dx = new Float32Array(0);
  private dy = new Float32Array(0);
  private dc = new Uint8Array(0); // 0: ocean, 1: muted land, 2: green highlight
  private dcov = new Float32Array(0);
  private dCity = new Int8Array(0); // -1: none, 0..13: city index
  private dn = 0;

  private ptr: { x: number; y: number; a: number } = { x: -999, y: -999, a: 0 };
  private ptrTarget = 0;
  private targetHoveredCity: number | null = null;
  private activeHoveredCity: number | null = null;
  private hoverTransition = 0;
  private tick = () => this.frame();
  private destroyed = false;
  private started = false;
  private steps: JourneyConfig["steps"];

  constructor(o: EngineOptions) {
    this.cfg = o.config;
    this.root = o.root;
    this.canvas = o.canvas;
    this.geo = o.geo;
    this.onPhase = o.onPhase;
    this.ctx = this.canvas.getContext("2d")!;
    this.off = document.createElement("canvas");
    this.offCtx = this.off.getContext("2d", { willReadFrequently: true })!;
    this.steps = this.cfg.steps;
    this.S = this.freshState();
    PROVINCE_GROUPS.forEach((pg) => {
      this.provinceWeights[pg.id] = 1;
    });
    this.collect();
    this.readTheme();
    this.build();
    if (o.reducedMotion || this.cfg.motion.intro === "skip") this.jumpToEnd();
    gsap.ticker.add(this.tick);
  }

  /* ---------- public ---------- */
  controller(): Omit<JourneyController, "showCity"> {
    return {
      replay: () => this.replay(),
      seek: (s: number) => {
        this.tl?.pause();
        this.tl?.time(s);
        this.dirty = true;
      },
      skipIntro: () => this.jumpToEnd(),
      duration: () => this.tl?.duration() ?? 0,
    };
  }

  start() {
    if (this.started) return;
    this.started = true;
    if (this.cfg.motion.intro === "play" && this.tl && this.tl.time() < 0.001) this.tl.play();
  }

  replay() {
    this.S = this.freshState();
    this.targetHoveredProvince = null;
    this.activeHoveredProvince = null;
    this.targetHoveredCity = null;
    this.activeHoveredCity = null;
    PROVINCE_GROUPS.forEach((pg) => {
      this.provinceWeights[pg.id] = 1;
    });
    this.hoverTransition = 0;
    this.rebuildTimeline();
    this.setPhase("intro");
    this.started = true;
    this.tl?.restart();
    this.dirty = true;
  }

  setSize(W: number, H: number, dpr: number) {
    W = Math.max(1, Math.round(W));
    H = Math.max(1, Math.round(H));
    if (W === this.W && H === this.H && dpr === this.dpr) return;
    this.W = W;
    this.H = H;
    this.dpr = dpr;
    this.canvas.width = Math.round(W * dpr);
    this.canvas.height = Math.round(H * dpr);
    this.off.width = W;
    this.off.height = H;
    this.g = geometry(this.cfg, W, H);
    this.dotKey = "";
    this.dirty = true;
  }

  setPointer(x: number | null, y?: number) {
    if (x === null) {
      this.ptrTarget = 0;
    } else {
      this.ptr.x = x;
      this.ptr.y = y!;
      this.ptrTarget = 1;
    }
    this.dirty = true;
  }

  setHover(provinceId: number | null, cityIndex: number | null) {
    if (this.targetHoveredProvince === provinceId && this.targetHoveredCity === cityIndex) return;
    this.targetHoveredProvince = provinceId;
    this.targetHoveredCity = cityIndex;
    if (provinceId !== null) {
      this.activeHoveredProvince = provinceId;
    }
    if (cityIndex !== null) {
      this.activeHoveredCity = cityIndex;
    }
    this.dirty = true;
  }

  setHoveredCity(index: number | null) {
    const pId =
      index !== null && this.cfg.cities[index]
        ? (CITY_TO_PROVINCE_ID[this.cfg.cities[index].id] ?? null)
        : null;
    this.setHover(pId, index);
  }

  readTheme() {
    const cs = getComputedStyle(this.root);
    const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
    this.colors = {
      map: v("--jh-map", "#C41E3A"), // Endow Crimson website theme color for map dots
      muted: v("--jh-map-muted", "#94a3b8"),
      ocean: v("--jh-ocean", "#cbd5e1"),
      disc0: v("--jh-disc-0", "#ffffff"),
      disc1: v("--jh-disc-1", "#ffffff"),
      lime: v("--jh-lime", "#8cc63f"), // Light green for the location points
      ink: v("--jh-ink", "#09090b"),
    };
    this.dirty = true;
  }

  destroy() {
    this.destroyed = true;
    gsap.ticker.remove(this.tick);
    this.tl?.kill();
  }

  /* ---------- setup ---------- */
  private freshState(): State {
    const count = this.steps ? this.steps.length : (this.cfg.steps?.length || 6);
    const idx = (n: number, v = 0) =>
      Object.fromEntries(Array.from({ length: n }, (_, i) => [i, v])) as Record<number, number>;
    return {
      intro: 0,
      reveal: 0,
      pinO: 0,
      pinD: 0,
      planeA: 0,
      arc: 0,
      pulse: 0,
      n: idx(count),
      l: idx(count),
      fade: 0,
      morph: 0,
      cities: 0,
    };
  }

  private collect() {
    this.root.querySelectorAll<HTMLElement>("[data-jh]").forEach((e) => this.el.set(e.dataset.jh!, e));
    const byId = new Map(this.cfg.cities.map((c) => [c.id, c]));
    this.root.querySelectorAll<HTMLElement>("[data-jh-city]").forEach((e) => {
      const c = byId.get(e.dataset.jhCity!);
      if (c) this.cityEls.push({ el: e, lon: c.lon, lat: c.lat });
    });
    this.root.querySelectorAll<HTMLElement>("[data-jh-province]").forEach((e) => {
      const pid = Number(e.dataset.jhProvince);
      if (pid) this.provinceEls.set(pid, e);
    });
  }

  private setPhase(p: Phase) {
    if (p === this.phase) return;
    this.phase = p;
    this.onPhase(p);
  }

  private jumpToEnd() {
    this.started = true;
    this.tl?.pause();
    this.tl?.progress(1);
    this.setPhase("explore");
    this.dirty = true;
  }

  private build() {
    this.rebuildTimeline();
  }

  private rebuildTimeline() {
    this.tl?.kill();
    const S = this.S;
    const speed = this.cfg.motion.speed || 1;

    const flightStart = 0.85;
    const flightDur = 2.7; // Continuous, silky-smooth unbroken flight
    const arrive = flightStart + flightDur;

    const tl = gsap.timeline({
      paused: true,
    });
    tl.timeScale(speed);

    // Initial globe & pins
    tl.to(S, { intro: 1, duration: 0.75, ease: "power3.out" }, 0)
      .to(S, { reveal: 1, duration: 1.4, ease: "power2.out" }, 0.08)
      .to(S, { pinO: 1, duration: 0.5, ease: "back.out(2.4)" }, 0.45)
      .to(S, { pinD: 1, duration: 0.5, ease: "back.out(2.4)" }, 0.65)
      .to(S, { planeA: 1, duration: 0.35, ease: "power2.out" }, flightStart - 0.1);

    // ONE continuous, unbroken, silky smooth flight from Dhaka to Korea:
    tl.to(S, { arc: 1, duration: flightDur, ease: "sine.inOut" }, flightStart);

    // Milestone roadmap nodes & labels light up smoothly as the plane cruises over them:
    this.steps.forEach((s, i) => {
      // Analytical progress time along sine.inOut easing:
      // y = (1 - cos(pi * t)) / 2 => t = acos(1 - 2*y) / pi
      const normT = Math.acos(1 - 2 * clamp01(s.at)) / Math.PI;
      const t = flightStart + normT * flightDur;
      tl.to(S.n, { [i]: 1, duration: 0.36, ease: "back.out(2.4)" }, t - 0.05)
        .to(S.l, { [i]: 1, duration: 0.36, ease: "power2.out" }, t + 0.04);
    });

    // Arrival in South Korea:
    tl.to(S, { planeA: 0, duration: 0.25, ease: "power2.in" }, arrive - 0.1)
      .to(S, { pulse: 1, duration: 1.0, ease: "power2.out" }, arrive - 0.05);

    const fadeStart = arrive + 0.25;
    const morphStart = fadeStart + 0.12;
    const morphDur = 1.6;
    const exploreTime = morphStart + morphDur + 0.08;

    tl.to(S, { fade: 1, duration: 0.65, ease: "power2.inOut" }, fadeStart)
      .to(S, { morph: 1, duration: morphDur, ease: "power3.inOut" }, morphStart);

    tl.to({}, { duration: 0.01 }, exploreTime);

    tl.eventCallback("onUpdate", () => {
      this.dirty = true;
      this.setPhase(tl.time() >= exploreTime - 0.05 ? "explore" : "intro");
    });

    this.tl = tl;
  }

  /* ---------- frame loop ---------- */
  private frame() {
    if (this.destroyed || !this.W) return;
    const d = this.ptrTarget - this.ptr.a;
    if (Math.abs(d) > 0.002) {
      this.ptr.a += d * 0.18;
      this.dirty = true;
    } else if (this.ptr.a !== this.ptrTarget) {
      this.ptr.a = this.ptrTarget;
      this.dirty = true;
    }

    // Smooth hover transition for city focus
    const targetH = this.targetHoveredCity !== null ? 1 : 0;
    const dH = targetH - this.hoverTransition;
    if (Math.abs(dH) > 0.004) {
      this.hoverTransition += dH * 0.16;
      this.dirty = true;
    } else if (this.hoverTransition !== targetH) {
      this.hoverTransition = targetH;
      if (targetH === 0) {
        this.activeHoveredCity = null;
      }
      this.dirty = true;
    }

    // Smooth color weights per province (1 = Endow Red, 0 = Soft Muted Gray)
    let weightsDirty = false;
    for (const pg of PROVINCE_GROUPS) {
      const target =
        this.targetHoveredProvince === null
          ? 1
          : this.targetHoveredProvince === pg.id
            ? 1
            : 0;
      const current = this.provinceWeights[pg.id] ?? 1;
      const diff = target - current;
      if (Math.abs(diff) > 0.003) {
        this.provinceWeights[pg.id] = current + diff * 0.16;
        weightsDirty = true;
      } else if (current !== target) {
        this.provinceWeights[pg.id] = target;
        weightsDirty = true;
      }
    }
    if (weightsDirty) {
      this.dirty = true;
      if (this.targetHoveredProvince === null) {
        const allOne = PROVINCE_GROUPS.every((p) => Math.abs((this.provinceWeights[p.id] ?? 1) - 1) < 0.01);
        if (allOne) {
          this.activeHoveredProvince = null;
          this.activeHoveredCity = null;
        }
      }
    }

    if (!this.dirty) return;
    this.dirty = false;
    this.draw();
  }

  private computeView(): {
    v: View;
    pitch: number;
    ds: number;
    oceanA: number;
    mutedA: number;
    discA: number;
    clipR: number;
  } {
    const { g, S, cfg } = this;
    const m = S.morph;
    const v = lerpView(g.globe, g.focus, m);
    const pitch = lerp(cfg.motion.dotPitch, cfg.motion.dotPitchZoom, m) * g.W;
    const ds = lerp(0.36, 0.37, m);
    const R = g.discR * (0.9 + 0.1 * S.intro);
    return {
      v,
      pitch,
      ds,
      oceanA: lerp(1, 0.28, m),
      mutedA: lerp(1, 0.40, m),
      discA: S.intro * (1 - clamp01(m * 1.4)),
      clipR: lerp(R, Math.hypot(g.W, g.H) * 1.15, m * m),
    };
  }

  private draw() {
    const { ctx, g, S, colors: c } = this;
    const { v, pitch, ds, oceanA, mutedA, discA, clipR } = this.computeView();
    const W = g.W,
      H = g.H;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    /* --- projected anchors --- */
    const [oxp, oyp] = project(v, this.cfg.origin.lon, this.cfg.origin.lat);
    const [dxp, dyp] = project(v, this.cfg.destination.lon, this.cfg.destination.lat);

    /* --- transparent world circle map (no solid white backing) --- */
    const R = g.discR * (0.9 + 0.1 * S.intro);

    /* --- surrounding geographic coastline guide outside South Korea (no solid flat fill - dots provide the texture!) --- */
    if (S.morph > 0.05) {
      ctx.save();
      const landAlpha = clamp01((S.morph - 0.05) / 0.5) * 0.28;
      ctx.globalAlpha = landAlpha;
      const landPath = this.tracePath(this.geo.land, v, W, H);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 0.75 * g.u;
      ctx.stroke(landPath);
      ctx.restore();
    }

    /* --- South Korea administrative province wash & ambient shadow --- */
    const koreaAlpha = clamp01((S.morph - 0.4) / 0.42);
    if (koreaAlpha > 0.005) {
      this.paintKoreaProvinces(v, koreaAlpha);
    }

    /* --- halftone regional & globe dots (including South Korea textured dots!) --- */
    this.paintDots(v, pitch, ds, oceanA, mutedA, clipR, R);

    /* --- South Korea administrative borders & active division highlight glow --- */
    if (koreaAlpha > 0.005) {
      this.paintKoreaBorders(v, koreaAlpha);
    }

    /* --- flight arc (pure red trajectory) --- */
    const fade = 1 - S.fade;
    const arc = this.arcGeometry(oxp, oyp, dxp, dyp);
    if (S.pinO > 0.01 && fade > 0.003) {
      ctx.save();
      ctx.globalAlpha = fade * clamp01(S.pinD * 1.5);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // subtle background guide track in red tint
      ctx.setLineDash([2 * g.u, 6 * g.u]);
      ctx.strokeStyle = "rgba(196, 30, 58, 0.22)";
      ctx.lineWidth = 1.5 * g.u;
      this.strokeArc(arc, 1);
      ctx.setLineDash([]);

      // pure red energized flight trajectory
      if (S.arc > 0.001) {
        ctx.strokeStyle = "rgba(196, 30, 58, 0.16)";
        ctx.lineWidth = 6 * g.u;
        this.strokeArc(arc, S.arc);

        ctx.strokeStyle = "#C41E3A";
        ctx.lineWidth = 2.4 * g.u;
        this.strokeArc(arc, S.arc);
      }
      ctx.restore();
    }

    // arrival ripple at South Korea destination
    if (S.pulse > 0 && S.pulse < 1 && fade > 0.003) {
      ctx.save();
      ctx.globalAlpha = (1 - S.pulse) * 0.75 * fade;
      ctx.strokeStyle = c.map;
      ctx.lineWidth = 2 * g.u;
      for (let k = 0; k < 2; k++) {
        const pp = clamp01(S.pulse * 1.3 - k * 0.25);
        if (pp <= 0) continue;
        ctx.beginPath();
        ctx.arc(dxp, dyp, (6 + pp * 34) * g.u, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    }

    this.layoutDom(oxp, oyp, dxp, dyp, arc, v);
  }

  /* ---------- arc maths ---------- */
  private arcGeometry(ax: number, ay: number, bx: number, by: number) {
    const cx0 = bx - ax,
      cy0 = by - ay;
    const len = Math.hypot(cx0, cy0) || 1;
    let nx = cy0 / len,
      ny = -cx0 / len;
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    const bulge = 0.4 * len;
    const cx = (ax + bx) / 2 + nx * bulge,
      cy = (ay + by) / 2 + ny * bulge;
    const N = 80;
    const pts: number[] = [];
    const cum: number[] = [0];
    for (let i = 0; i <= N; i++) {
      const t = i / N,
        mt = 1 - t;
      const x = mt * mt * ax + 2 * mt * t * cx + t * t * bx;
      const y = mt * mt * ay + 2 * mt * t * cy + t * t * by;
      pts.push(x, y);
      if (i) cum.push(cum[i - 1] + Math.hypot(x - pts[2 * i - 2], y - pts[2 * i - 1]));
    }
    return { pts, cum, N, total: cum[N], ax, ay, bx, by, cx, cy };
  }

  private arcAt(a: ReturnType<JourneyEngine["arcGeometry"]>, f: number): [number, number, number] {
    const target = clamp01(f) * a.total;
    let i = 1;
    while (i < a.N && a.cum[i] < target) i++;
    const s0 = a.cum[i - 1],
      s1 = a.cum[i];
    const frac = s1 > s0 ? (target - s0) / (s1 - s0) : 0;
    const x0 = a.pts[2 * i - 2],
      y0 = a.pts[2 * i - 1],
      x1 = a.pts[2 * i],
      y1 = a.pts[2 * i + 1];
    const x = lerp(x0, x1, frac);
    const y = lerp(y0, y1, frac);

    // Continuous analytical tangent on quadratic bezier curve
    const t = clamp01((i - 1 + frac) / a.N);
    const mt = 1 - t;
    const dx = 2 * mt * (a.cx - a.ax) + 2 * t * (a.bx - a.cx);
    const dy = 2 * mt * (a.cy - a.ay) + 2 * t * (a.by - a.cy);
    const ang = Math.atan2(dy, dx);
    return [x, y, ang];
  }

  private strokeArc(a: ReturnType<JourneyEngine["arcGeometry"]>, f: number) {
    const ctx = this.ctx;
    const target = clamp01(f) * a.total;
    ctx.beginPath();
    ctx.moveTo(a.pts[0], a.pts[1]);
    for (let i = 1; i <= a.N; i++) {
      if (a.cum[i] <= target) ctx.lineTo(a.pts[2 * i], a.pts[2 * i + 1]);
      else {
        const t = (target - a.cum[i - 1]) / (a.cum[i] - a.cum[i - 1]);
        ctx.lineTo(lerp(a.pts[2 * i - 2], a.pts[2 * i], t), lerp(a.pts[2 * i - 1], a.pts[2 * i + 1], t));
        break;
      }
    }
    ctx.stroke();
  }

  /* ---------- dot raster ---------- */
  private ringBounds(r: number[]) {
    let b = this.ringBox.get(r);
    if (!b) {
      let x0 = 1e9,
        y0 = 1e9,
        x1 = -1e9,
        y1 = -1e9;
      for (let i = 0; i < r.length; i += 2) {
        if (r[i] < x0) x0 = r[i];
        if (r[i] > x1) x1 = r[i];
        if (r[i + 1] < y0) y0 = r[i + 1];
        if (r[i + 1] > y1) y1 = r[i + 1];
      }
      b = [x0, y0, x1, y1];
      this.ringBox.set(r, b);
    }
    return b;
  }

  private tracePath(rings: number[][], v: View, W: number, H: number): Path2D {
    const p = new Path2D();
    const pad = 40;
    for (const r of rings) {
      const [x0, y0, x1, y1] = this.ringBounds(r);
      const [sx0, sy1] = project(v, x0, y0);
      const [sx1, sy0] = project(v, x1, y1);
      if (sx1 < -pad || sx0 > W + pad || sy1 < -pad || sy0 > H + pad) continue;
      const k = v.k * RAD;
      const my0 = mercY(v.lat0);
      for (let i = 0; i < r.length; i += 2) {
        const x = v.ax + k * (r[i] - v.lon0);
        const y = v.ay - v.k * (mercY(r[i + 1]) - my0);
        if (i === 0) p.moveTo(x, y);
        else p.lineTo(x, y);
      }
      p.closePath();
    }
    return p;
  }

  private getProvincePath(pg: (typeof PROVINCE_GROUPS)[0], v: View): Path2D {
    const key = `${v.k.toFixed(1)}|${v.ax.toFixed(1)}|${v.ay.toFixed(1)}|${v.lon0.toFixed(2)}|${v.lat0.toFixed(2)}`;
    if (key !== this.provPathKey) {
      this.provPathKey = key;
      this.provPathCache.clear();
    }
    let path = this.provPathCache.get(pg.id);
    if (!path) {
      const allRings: number[][] = [];
      for (const feat of pg.featureNames) {
        const rings = KOREA_PROVINCES[feat];
        if (rings) allRings.push(...rings);
      }
      path = this.tracePath(allRings, v, this.W, this.H);
      this.provPathCache.set(pg.id, path);
    }
    return path;
  }

  private paintKoreaProvinces(v: View, alpha: number) {
    const { ctx, g } = this;
    const u = g.u;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Ambient drop shadow under South Korea perimeter casting onto surrounding land & ocean
    if (this.S.morph > 0.5) {
      ctx.save();
      ctx.shadowColor = "rgba(16, 27, 61, 0.16)";
      ctx.shadowBlur = 18 * u;
      ctx.shadowOffsetY = 4 * u;
      for (const pg of PROVINCE_GROUPS) {
        const path = this.getProvincePath(pg, v);
        ctx.fillStyle = "#ffffff";
        ctx.fill(path, "evenodd");
      }
      ctx.restore();
    }

    // Draw soft translucent base wash for each province (anchors boundaries under the halftone dots)
    for (const pg of PROVINCE_GROUPS) {
      const path = this.getProvincePath(pg, v);
      const weight = this.provinceWeights[pg.id] ?? 1;

      const r = Math.round(lerp(226, 196, weight));
      const gCol = Math.round(lerp(232, 30, weight));
      const b = Math.round(lerp(240, 58, weight));
      const fillAlpha = lerp(0.06, 0.12, weight);

      ctx.fillStyle = `rgba(${r},${gCol},${b},${fillAlpha})`;
      ctx.fill(path, "evenodd");
    }

    ctx.restore();
  }

  private paintKoreaBorders(v: View, alpha: number) {
    const { ctx, g } = this;
    const u = g.u;
    const isExplore = this.phase === "explore" || this.S.morph > 0.95;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Crisp, fine white administrative border (thinner and delicate dividing lines)
    for (const pg of PROVINCE_GROUPS) {
      const path = this.getProvincePath(pg, v);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 1.05 * u;
      ctx.lineJoin = "round";
      ctx.stroke(path);
    }

    // Highlight the active hovered division with an elevated white border and soft red glow
    if (isExplore && this.activeHoveredProvince !== null) {
      const pg = PROVINCE_GROUPS.find((p) => p.id === this.activeHoveredProvince);
      if (pg) {
        const path = this.getProvincePath(pg, v);
        ctx.save();
        ctx.shadowColor = "rgba(196, 30, 58, 0.45)";
        ctx.shadowBlur = 8 * u;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.6 * u;
        ctx.lineJoin = "round";
        ctx.stroke(path);
        ctx.restore();
      }
    }

    ctx.restore();

    // Render exact province IDs to offscreen canvas for instantaneous pixel hit testing
    if (isExplore) {
      this.offCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.offCtx.clearRect(0, 0, this.W, this.H);
      for (const pg of PROVINCE_GROUPS) {
        const path = this.getProvincePath(pg, v);
        this.offCtx.fillStyle = `rgb(0, 0, ${pg.id})`;
        this.offCtx.fill(path, "evenodd");
      }
    }
  }

  getHoverAt(x: number, y: number): { provinceId: number | null; cityIndex: number | null } {
    if (this.phase !== "explore") return { provinceId: null, cityIndex: null };

    // 1. Proximity check for city markers within the active province
    if (this.activeHoveredProvince !== null) {
      const pg = PROVINCE_GROUPS.find((p) => p.id === this.activeHoveredProvince);
      if (pg && pg.cityIds.length > 0) {
        for (const cid of pg.cityIds) {
          const cIdx = this.cfg.cities.findIndex((c) => c.id === cid);
          if (cIdx >= 0) {
            const c = this.cfg.cities[cIdx];
            const [cx, cy] = project(this.g.focus, c.lon, c.lat);
            if (Math.hypot(x - cx, y - cy) < 22 * this.g.u) {
              return { provinceId: this.activeHoveredProvince, cityIndex: cIdx };
            }
          }
        }
      }
    }

    // 2. Exact polygon / area check via offscreen canvas
    if (x >= 0 && x < this.W && y >= 0 && y < this.H) {
      const pix = this.offCtx.getImageData(x | 0, y | 0, 1, 1).data;
      const pId = pix[2];
      if (pId >= 1 && pId <= 11) {
        const pg = PROVINCE_GROUPS.find((p) => p.id === pId);
        let closestCityIdx: number | null = null;
        if (pg && pg.cityIds.length > 0) {
          let bestDist = Infinity;
          for (const cid of pg.cityIds) {
            const idx = this.cfg.cities.findIndex((c) => c.id === cid);
            if (idx >= 0) {
              const c = this.cfg.cities[idx];
              const [cx, cy] = project(this.g.focus, c.lon, c.lat);
              const d = Math.hypot(x - cx, y - cy);
              if (d < bestDist) {
                bestDist = d;
                closestCityIdx = idx;
              }
            }
          }
        }
        return { provinceId: pId, cityIndex: closestCityIdx };
      }
    }

    return { provinceId: null, cityIndex: null };
  }

  getCityAt(x: number, y: number): number | null {
    return this.getHoverAt(x, y).cityIndex;
  }

  private rebuildDots(v: View, pitch: number) {
    const { W, H } = this.g;
    const o = this.offCtx;
    o.setTransform(1, 0, 0, 1, 0, 0);
    o.clearRect(0, 0, W, H);
    o.fillStyle = "rgb(255,0,0)";
    o.fill(this.tracePath(this.geo.land, v, W, H), "evenodd");

    // Origin country (Bangladesh) in green channel
    if (this.geo.regions[this.cfg.origin.country]) {
      o.fillStyle = "rgb(0,255,0)";
      o.fill(this.tracePath(this.geo.regions[this.cfg.origin.country], v, W, H), "evenodd");
    }

    // South Korea exact province boundaries (Green = 255, Blue = province ID 1..11)
    for (const pg of PROVINCE_GROUPS) {
      o.fillStyle = `rgb(0,255,${pg.id})`;
      for (const feat of pg.featureNames) {
        const rings = KOREA_PROVINCES[feat];
        if (rings) o.fill(this.tracePath(rings, v, W, H), "evenodd");
      }
    }

    const cPts = this.cfg.cities.map((c) => project(v, c.lon, c.lat));
    const cIdxMap = new Map(this.cfg.cities.map((c, i) => [c.id, i]));

    const img = o.getImageData(0, 0, W, H).data;
    const rowH = pitch * 0.8660254;
    const rows = Math.ceil(H / rowH) + 1;
    const cols = Math.ceil(W / pitch) + 1;
    const cap = rows * cols;
    if (this.dx.length < cap) {
      this.dx = new Float32Array(cap);
      this.dy = new Float32Array(cap);
      this.dc = new Uint8Array(cap);
      this.dcov = new Float32Array(cap);
      this.dCity = new Int8Array(cap);
    }
    let n = 0;
    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      if (y >= H) break;
      const off = r & 1 ? pitch / 2 : 0;
      const iy = (y | 0) * W;
      for (let c = 0; c < cols; c++) {
        const x = c * pitch + off;
        if (x >= W) break;
        const i = (iy + (x | 0)) * 4;
        const a = img[i + 3];
        if (a > 10) {
          const isHl = img[i + 1] > img[i];
          this.dc[n] = isHl ? 2 : 1;
          this.dcov[n] = a / 255;
          this.dCity[n] = isHl ? img[i + 2] : -1;
        } else {
          this.dc[n] = 0;
          this.dcov[n] = 1;
          this.dCity[n] = -1;
        }
        this.dx[n] = x;
        this.dy[n] = y;
        n++;
      }
    }
    this.dn = n;
  }

  private paintDots(
    v: View,
    pitch: number,
    ds: number,
    oceanA: number,
    mutedA: number,
    clipR: number,
    discR: number
  ) {
    const { ctx, g, S, colors: c } = this;
    const key = [
      v.lon0.toFixed(3),
      v.lat0.toFixed(3),
      v.k.toFixed(1),
      v.ax.toFixed(1),
      v.ay.toFixed(1),
      pitch.toFixed(2),
      g.W,
      g.H,
    ].join("|");
    if (key !== this.dotKey) {
      this.rebuildDots(v, pitch);
      this.dotKey = key;
    }
    const cx = g.discCx,
      cy = g.discCy;
    const clipping = clipR < Math.hypot(g.W, g.H);
    const revealR = S.reveal * discR * 1.35;
    const revealSoft = discR * 0.35;
    const pr = g.W * 0.13;
    const pa = this.ptr.a;
    const px = this.ptr.x,
      py = this.ptr.y;

    const pO = new Path2D(),
      pM = new Path2D(),
      pOrigin = new Path2D();
    const pProv: Path2D[] = [];
    for (let id = 0; id <= 11; id++) {
      pProv[id] = new Path2D();
    }
    const clip2 = clipR * clipR;
    const intro = S.intro;

    // Follow camera center smoothly as it transitions from globe center to Korea focus
    const m = S.morph;
    const curCx = lerp(cx, v.ax, m);
    const curCy = lerp(cy, v.ay, m);

    // Elliptical boundary radius smoothly transitions from circle disc to feathered stage boundary
    const rx = lerp(discR, g.W * 0.45, m);
    const ry = lerp(discR, g.H * 0.47, m);

    for (let i = 0; i < this.dn; i++) {
      const x = this.dx[i],
        y = this.dy[i];
      const cls = this.dc[i];

      let rf = 1;
      const ddx = x - cx,
        ddy = y - cy;
      const d2 = ddx * ddx + ddy * ddy;
      if (clipping && d2 > clip2) continue;
      if (S.reveal < 1) {
        rf = clamp01((revealR - Math.sqrt(d2)) / revealSoft);
        if (rf <= 0) continue;
      }
      if (intro <= 0) continue;
      let r: number;
      if (cls === 0) r = pitch * 0.14;
      else r = pitch * (cls === 2 ? ds + 0.15 : ds * 0.88) * (0.4 + 0.6 * this.dcov[i]);

      // Ultra-smooth elliptical feathering so the box edges fade away seamlessly
      if (cls !== 2) {
        const dxNorm = (x - curCx) / rx;
        const dyNorm = (y - curCy) / ry;
        const dNorm = Math.hypot(dxNorm, dyNorm);
        if (dNorm > 0.60) {
          const t = clamp01((dNorm - 0.60) / 0.40);
          const edgeFade = 1 - t * t * (3 - 2 * t);
          r *= edgeFade;
          if (edgeFade <= 0.01) continue;
        }
      }

      if (pa > 0.01) {
        const dd = Math.hypot(x - px, y - py);
        if (dd < pr) {
          const f = (1 - dd / pr) * pa;
          r *= cls === 0 ? 1 + 2.5 * f : 1 + 0.7 * f;
        }
      }
      r *= rf;
      if (r < 0.15) continue;

      if (cls === 0) {
        pO.moveTo(x + r, y);
        pO.arc(x, y, r, 0, TAU);
      } else if (cls === 1) {
        pM.moveTo(x + r, y);
        pM.arc(x, y, r, 0, TAU);
      } else {
        const provId = this.dCity[i];
        if (provId >= 1 && provId <= 11) {
          pProv[provId].moveTo(x + r, y);
          pProv[provId].arc(x, y, r, 0, TAU);
        } else {
          pOrigin.moveTo(x + r, y);
          pOrigin.arc(x, y, r, 0, TAU);
        }
      }
    }

    ctx.save();
    if (clipping && m < 0.1) {
      ctx.beginPath();
      ctx.arc(cx, cy, clipR, 0, TAU);
      ctx.clip();
    }

    ctx.globalAlpha = oceanA * 0.70;
    ctx.fillStyle = c.ocean;
    ctx.fill(pO);

    ctx.globalAlpha = mutedA;
    ctx.fillStyle = c.muted;
    ctx.fill(pM);

    // Origin country (Bangladesh) in theme red
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.map;
    ctx.fill(pOrigin);

    // South Korea province dots: rich halftone dot matrix texture matching the initial globe!
    // Smooth per-province interpolation between Endow Crimson Red (#C41E3A) and Slate Gray (#94a3b8)
    for (const pg of PROVINCE_GROUPS) {
      const weight = this.provinceWeights[pg.id] ?? 1;
      const r = Math.round(lerp(148, 196, weight));
      const gCol = Math.round(lerp(163, 30, weight));
      const b = Math.round(lerp(184, 58, weight));
      ctx.fillStyle = `rgb(${r},${gCol},${b})`;
      ctx.fill(pProv[pg.id]);
    }

    ctx.restore();
  }

  /* ---------- DOM overlay ---------- */
  private put(
    id: string,
    x: number,
    y: number,
    o: { s?: number; o?: number; r?: number; anchor?: string } = {}
  ) {
    const e = this.el.get(id);
    if (!e) return;
    const op = o.o ?? 1;
    if (op <= 0.002) {
      if (e.style.visibility !== "hidden") e.style.visibility = "hidden";
      return;
    }
    e.style.visibility = "visible";
    e.style.opacity = op >= 0.999 ? "1" : op.toFixed(3);
    e.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(${o.anchor ?? "-50%,-50%"}) rotate(${(o.r ?? 0).toFixed(2)}deg) scale(${(o.s ?? 1).toFixed(4)})`;
  }

  private layoutDom(
    ox: number,
    oy: number,
    dx: number,
    dy: number,
    arc: ReturnType<JourneyEngine["arcGeometry"]>,
    v: View
  ) {
    const { g, S, cfg } = this;
    const u = g.u;
    const fade = 1 - S.fade;

    /* pins + pills */
    this.put("pin-o", ox, oy, { s: S.pinO, o: S.pinO > 0.01 ? fade : 0 });
    this.put("pin-d", dx, dy, { s: S.pinD, o: S.pinD > 0.01 ? fade : 0 });
    const po = cfg.origin.pill ?? { x: 0, y: 26 };
    const pd = cfg.destination.pill ?? { x: 0, y: 40 };
    this.put("pill-o", ox + po.x * u, oy + po.y * u, { s: clamp01(S.pinO), o: S.pinO > 0.02 ? fade : 0 });
    this.put("pill-d", dx + pd.x * u, dy + pd.y * u, { s: clamp01(S.pinD), o: S.pinD > 0.02 ? fade : 0 });

    /* plane */
    const [pxp, pyp, pang] = this.arcAt(arc, S.arc);
    this.put("plane", pxp, pyp, {
      s: 0.6 + 0.4 * S.planeA,
      o: S.planeA * fade,
      r: pang / RAD + 90,
    });

    /* step nodes + labels */
    this.steps.forEach((s, i) => {
      const [nx, ny] = this.arcAt(arc, s.at);
      this.put(`node-${i}`, nx, ny, { s: S.n[i], o: S.n[i] > 0.01 ? fade : 0 });

      const gap = 17 * u;
      const side = s.side;
      const [lx, ly, anchor] =
        side === "right"
          ? [nx + gap, ny, "0%,-50%"]
          : side === "left"
            ? [nx - gap, ny, "-100%,-50%"]
            : side === "top"
              ? [nx, ny - gap, "-50%,-100%"]
              : [nx, ny + gap, "-50%,0%"];
      this.put(`label-${i}`, lx, ly, { s: 0.9 + 0.1 * S.l[i], o: S.l[i] * fade, anchor });
    });

    /* division labels in South Korea view */
    const morphLabelAlpha = clamp01((S.morph - 0.65) / 0.32);
    PROVINCE_GROUPS.forEach((pg) => {
      const el = this.provinceEls.get(pg.id);
      if (el) {
        const [x, y] = project(v, pg.center[0], pg.center[1]);
        el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%)`;
        el.style.opacity = `${(morphLabelAlpha * 0.95).toFixed(3)}`;
      }
    });

    /* city markers in South Korea view */
    this.cityEls.forEach((c) => {
      const [x, y] = project(v, c.lon, c.lat);
      c.el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%)`;
    });
  }
}

/** #rgb / #rrggbb / rgb()/rgba() -> rgba() with alpha */
function hexA(color: string, a: number): string {
  const s = color.trim();
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h.slice(0, 6), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1].split(/[ ,/]+/).map(Number);
    return `rgba(${r},${g},${b},${a})`;
  }
  return s;
}
