const API_BASE = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Ocurrió un error en la solicitud.'
    throw new Error(message)
  }

  return data
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getPersonajes: (nombre = '') => request(`/personajes${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),
  getSagas: (nombre = '') => request(`/sagas${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),
  getRazas: (nombre = '') => request(`/razas${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),
  createContribucion: (payload) => request('/contribuciones', { method: 'POST', body: JSON.stringify(payload) }),
  getMisContribuciones: () => request('/contribuciones/mias'),
  getPendientes: () => request('/admin/pendientes'),
  aprobarContribucion: (id, payload) => request(`/admin/contribuciones/${id}/aprobar`, { method: 'POST', body: JSON.stringify(payload) }),
  rechazarContribucion: (id, payload) => request(`/admin/contribuciones/${id}/rechazar`, { method: 'POST', body: JSON.stringify(payload) }),
}
