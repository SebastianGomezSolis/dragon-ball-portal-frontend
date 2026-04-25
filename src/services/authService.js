const SESSION_KEY = 'dbportal.session'

export function getStoredSession() {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
