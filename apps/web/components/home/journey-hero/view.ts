import type { JourneyConfig } from './types'

/** Stage geometry. Everything is expressed relative to the stage width `W`. */
export const STAGE_ASPECT = 460 / 530 // width / height
export const DESIGN_W = 460 // px width the authoring pixel offsets are designed for

const RAD = Math.PI / 180
export const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))

export interface View {
  lon0: number
  lat0: number
  /** pixels per radian of Mercator x */
  k: number
  /** screen position of (lon0, lat0) in px */
  ax: number
  ay: number
}

export interface Geometry {
  W: number
  H: number
  u: number // px per design-unit
  discCx: number
  discCy: number
  discR: number
  globe: View
  focus: View
}

export function geometry(cfg: JourneyConfig, W: number, H: number): Geometry {
  const discR = 0.49 * W
  const discCx = 0.5 * W
  const discCy = 0.5 * W
  // Globe view: Dhaka bottom-left, Korea upper-right, elegant trajectory
  const globe: View = { lon0: 110.9, lat0: 30.1, k: 2.344 * discR, ax: discCx, ay: discCy }
  const focus: View = {
    lon0: 127.4,
    lat0: 35.85,
    k: 8.2 * W,
    ax: 0.42 * W,
    ay: 0.54 * H,
  }
  return { W, H, u: W / DESIGN_W, discCx, discCy, discR, globe, focus }
}

export function project(v: View, lon: number, lat: number): [number, number] {
  return [v.ax + v.k * (lon - v.lon0) * RAD, v.ay - v.k * (mercY(lat) - mercY(v.lat0))]
}

export function lerpView(a: View, b: View, t: number): View {
  const l = (x: number, y: number) => x + (y - x) * t
  return {
    lon0: l(a.lon0, b.lon0),
    lat0: l(a.lat0, b.lat0),
    k: Math.exp(l(Math.log(a.k), Math.log(b.k))),
    ax: l(a.ax, b.ax),
    ay: l(a.ay, b.ay),
  }
}

/** Where a lon/lat ends up in the final (country) view; used to place city markers and cards */
export function focusPoint(
  cfg: JourneyConfig,
  W: number,
  lon: number,
  lat: number
): [number, number] {
  const H = W / STAGE_ASPECT
  return project(geometry(cfg, W, H).focus, lon, lat)
}
