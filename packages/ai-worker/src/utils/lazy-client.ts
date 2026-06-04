/**
 * Build-safe lazy proxy for module-level service clients.
 * See apps/web/lib/lazy-client.ts for the canonical implementation.
 */
export function lazyClient<T extends object>(
  build: () => T,
  serviceName: string,
): T {
  let instance: T | null = null
  return new Proxy({} as T, {
    get(_t, prop) {
      if (!instance) {
        try {
          instance = build()
        } catch (err) {
          if (err instanceof Error) throw err
          throw new Error(`Failed to initialize ${serviceName}: ${String(err)}`)
        }
      }
      const value = (instance as unknown as Record<PropertyKey, unknown>)[prop]
      return typeof value === 'function' ? (value as Function).bind(instance) : value
    },
    has(_t, prop) {
      if (!instance) instance = build()
      return prop in (instance as object)
    },
  })
}
