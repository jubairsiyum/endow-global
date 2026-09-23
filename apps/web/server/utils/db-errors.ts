export function isMissingColumnError(error: unknown): boolean {
  let current: unknown = error

  for (let depth = 0; depth < 3 && current; depth++) {
    if (typeof current !== 'object') break

    const candidate = current as {
      code?: unknown
      errno?: unknown
      message?: unknown
      cause?: unknown
    }

    if (candidate.code === 'ER_BAD_FIELD_ERROR' || candidate.errno === 1054) return true
    if (typeof candidate.message === 'string' && /unknown column|bad field|failed query/i.test(candidate.message)) {
      return true
    }

    current = candidate.cause
  }

  return false
}

export function isMissingTableError(error: unknown): boolean {
  let current: unknown = error

  for (let depth = 0; depth < 3 && current; depth++) {
    if (typeof current !== 'object') break

    const candidate = current as {
      code?: unknown
      errno?: unknown
      message?: unknown
      cause?: unknown
    }

    if (candidate.code === 'ER_NO_SUCH_TABLE' || candidate.errno === 1146) return true
    if (typeof candidate.message === 'string' && /table .*doesn't exist|table .*not found/i.test(candidate.message)) {
      return true
    }

    current = candidate.cause
  }

  return false
}
