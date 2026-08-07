/**
 * ProofLens — Centralized API Client
 *
 * Wraps fetch() with:
 *  - AbortController-based timeout (handles Render cold starts)
 *  - Structured error extraction from backend responses
 *  - User-friendly error messages for network/CORS/timeout failures
 *  - Console logging for debugging
 */

const API_BASE = import.meta.env.VITE_API_URL

/** Default timeout in milliseconds (120 s — accounts for Render cold starts). */
const DEFAULT_TIMEOUT_MS = 120_000

/** Transparently retry once on transient network failures (e.g. Render cold start). */
const MAX_NETWORK_RETRIES = 1
/** Delay between retry attempts in milliseconds. */
const NETWORK_RETRY_DELAY_MS = 1500

/**
 * Make an API request with timeout and structured error handling.
 *
 * Transient network-level failures (connection refused/reset — the classic
 * Render free-tier cold-start symptom) are transparently retried once.
 *
 * @param {string}  path        – API path (e.g. "/api/analyze")
 * @param {object}  options     – Standard fetch options (method, body, headers, …)
 * @param {number}  [timeoutMs] – Optional timeout override in ms
 * @returns {Promise<{data?: any, error?: string}>}
 */
export async function fetchApi(path, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const url = `${API_BASE}${path}`

  let lastError = null

  for (let attempt = 0; attempt <= MAX_NETWORK_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, NETWORK_RETRY_DELAY_MS))
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    console.info(`[ProofLens] → ${options.method || 'GET'} ${path} (attempt ${attempt + 1})`)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // HTTP error — try to extract a meaningful message from the body
      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response)
        console.error(`[ProofLens] ← ${response.status} ${path}:`, errorMessage)
        return { error: errorMessage }
      }

      const data = await response.json()
      console.info(`[ProofLens] ← 200 ${path}`)
      return { data }

    } catch (err) {
      clearTimeout(timeoutId)
      lastError = err

      // Only transient network errors (not timeouts, not offline) warrant a retry
      if (!isTransientNetworkError(err)) {
        break
      }
      console.warn(`[ProofLens] ↻ transient failure on ${path} (attempt ${attempt + 1}): ${err.message}`)
    }
  }

  const friendlyMessage = classifyNetworkError(lastError)
  console.error(`[ProofLens] ✗ ${path}:`, lastError?.name, lastError?.message)
  return { error: friendlyMessage }
}

/**
 * A retry is only worthwhile for transient network-level failures.
 * Timeouts (AbortError) and deliberate offline states are excluded.
 */
function isTransientNetworkError(err) {
  if (err.name === 'AbortError') return false
  if (typeof navigator !== 'undefined' && !navigator.onLine) return false
  // Browsers throw TypeError for connection refused/reset, CORS blocks, DNS
  // failures, and server-unreachable conditions.
  return err instanceof TypeError
}

/**
 * Extract a human-readable error message from an HTTP error response.
 */
async function extractErrorMessage(response) {
  try {
    const body = await response.json()
    // FastAPI HTTPException format: { detail: "..." }
    // Global exception handler format: { error: "...", detail: "..." }
    return body.detail || body.error || body.message || `Server error (${response.status})`
  } catch {
    // Body isn't JSON — use status text
    return `Server error: ${response.status} ${response.statusText}`
  }
}

/**
 * Classify a network-level error into a user-friendly message.
 */
function classifyNetworkError(err) {
  if (err.name === 'AbortError') {
    return (
      'The request timed out. The server may be starting up — please wait a moment and try again.'
    )
  }

  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    // This is what the browser throws for CORS blocks, DNS failures,
    // server unreachable, or network-offline conditions.
    if (!navigator.onLine) {
      return 'You appear to be offline. Please check your internet connection and try again.'
    }
    return (
      'Unable to reach the server. This may be due to a network issue or the server is starting up. Please try again in a few seconds.'
    )
  }

  return err.message || 'An unexpected error occurred. Please try again.'
}
