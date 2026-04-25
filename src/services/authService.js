const CLAVE_SESION = 'dbportal.session'

export function obtenerSesionGuardada() {
  const raw = sessionStorage.getItem(CLAVE_SESION)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(CLAVE_SESION)
    return null
  }
}

export function guardarSesion(datos) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datos))
}

export function limpiarSesion() {
  sessionStorage.removeItem(CLAVE_SESION)
}
