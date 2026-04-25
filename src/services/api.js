const BASE_API = 'http://localhost:8080/api'

async function solicitar(ruta, opciones = {}) {
  const encabezados = {
    'Content-Type': 'application/json',
    ...(opciones.headers || {}),
  }

  const respuesta = await fetch(`${BASE_API}${ruta}`, {
    ...opciones,
    headers: encabezados,
    credentials: 'include',
  })

  const texto = await respuesta.text()
  let datos = null
  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = texto
  }

  if (!respuesta.ok) {
    const mensaje = typeof datos === 'string' ? datos : datos?.message || 'Ocurrió un error en la solicitud.'
    throw new Error(mensaje)
  }

  return datos
}

export const api = {
  login: (carga) => solicitar('/auth/login', { method: 'POST', body: JSON.stringify(carga) }),
  register: (carga) => solicitar('/auth/register', { method: 'POST', body: JSON.stringify(carga) }),
  logout: () => solicitar('/auth/logout', { method: 'POST' }),
  getPersonajes: (nombre = '') => solicitar(`/personajes${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),
  getSagas: (nombre = '') => solicitar(`/sagas${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),
  getRazas: (nombre = '') => solicitar(`/razas${nombre ? `?nombre=${encodeURIComponent(nombre)}` : ''}`),
  createContribucion: (carga) => solicitar('/contribuciones', { method: 'POST', body: JSON.stringify(carga) }),
  getMisContribuciones: () => solicitar('/contribuciones/mias'),
  getPendientes: () => solicitar('/admin/pendientes'),
  aprobarContribucion: (id, carga) => solicitar(`/admin/contribuciones/${id}/aprobar`, { method: 'POST', body: JSON.stringify(carga) }),
  rechazarContribucion: (id, carga) => solicitar(`/admin/contribuciones/${id}/rechazar`, { method: 'POST', body: JSON.stringify(carga) }),
}
