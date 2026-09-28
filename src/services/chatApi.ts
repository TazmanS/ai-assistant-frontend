export type HealthStatus = 'checking' | 'online' | 'offline'

export const RESPONSE_TRUNCATED_MARKER = '\n[RESPONSE_TRUNCATED]'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

function endpoint(path: string) {
  return `${apiBaseUrl}${path}`
}

async function responseError(response: Response) {
  const body = await response.text().catch(() => '')
  const detail = body.trim().slice(0, 240)
  return new Error(detail || `Request failed with status ${response.status}`)
}

export async function checkBackendHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(endpoint('/api/health'), {
      method: 'GET',
      headers: { Accept: 'application/json, text/plain, */*' },
      cache: 'no-store',
      signal,
    })
    return response.ok
  } catch {
    return false
  }
}

function getTextFromSseData(data: string): string {
  if (data === '[DONE]') return ''
  try {
    const value: unknown = JSON.parse(data)
    if (typeof value === 'string') return value
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>
      for (const key of ['delta', 'token', 'content', 'text', 'message']) {
        if (typeof record[key] === 'string') return record[key]
      }
      const choices = record.choices
      if (Array.isArray(choices) && choices[0] && typeof choices[0] === 'object') {
        const choice = choices[0] as Record<string, unknown>
        const delta = choice.delta
        if (delta && typeof delta === 'object' && typeof (delta as Record<string, unknown>).content === 'string') {
          return (delta as Record<string, string>).content
        }
      }
      return ''
    }
  } catch {
    // Plain-text SSE data is valid too.
  }
  return data
}

async function consumeSse(response: Response, onChunk: (chunk: string) => void, signal?: AbortSignal) {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let eventData: string[] = []
  const dispatch = () => {
    if (eventData.length) onChunk(getTextFromSseData(eventData.join('\n')))
    eventData = []
  }

  try {
    while (true) {
      if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
      const { value, done } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line) { dispatch(); continue }
        if (line.startsWith(':')) continue
        const colon = line.indexOf(':')
        const field = colon < 0 ? line : line.slice(0, colon)
        const value = colon < 0 ? '' : line.slice(colon + 1).replace(/^ /, '')
        if (field === 'data') eventData.push(value)
      }
      if (done) break
    }
    if (buffer.startsWith('data:')) eventData.push(buffer.slice(5).replace(/^ /, ''))
    dispatch()
  } finally {
    reader.releaseLock()
  }
}

export async function streamChat(
  message: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(endpoint('/api/chat/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream, text/plain, application/json' },
    body: JSON.stringify({ message }),
    signal,
  })

  if (!response.ok) throw await responseError(response)
  if (!response.body) throw new Error('The server returned an empty response stream.')

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  if (contentType.includes('text/event-stream')) {
    await consumeSse(response, onChunk, signal)
    return
  }

  if (contentType.includes('application/json')) {
    const payload: unknown = await response.json()
    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      onChunk(payload.message)
      return
    }
    throw new Error('The server returned JSON without a string "message" field.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  try {
    while (true) {
      if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
      const { value, done } = await reader.read()
      const chunk = decoder.decode(value, { stream: !done })
      if (chunk) onChunk(chunk)
      if (done) break
    }
  } finally {
    reader.releaseLock()
  }
}
