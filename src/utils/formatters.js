export function formatRole(rol) {
  if (!rol) return 'Invitado'
  return rol === 'ADMIN' ? 'Administrador' : 'Usuario'
}

export function formatEstado(estado) {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente'
    case 'APROBADA':
      return 'Aprobada'
    case 'RECHAZADA':
      return 'Rechazada'
    default:
      return estado || 'Sin estado'
  }
}

export function formatFecha(fecha) {
  if (!fecha) return 'Sin fecha'
  const date = new Date(fecha)
  return Number.isNaN(date.getTime()) ? fecha : date.toLocaleString('es-CR')
}
