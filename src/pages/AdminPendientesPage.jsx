import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import LoadingBlock from '../components/LoadingBlock'
import { api } from '../services/api'
import { formatFecha } from '../utils/formatters'

function AdminPendientesPage({ session, navigate, setGlobalMessage }) {
  const [elementos, setElementos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [observacion, setObservacion] = useState('')
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)

  const cargarPendientes = async () => {
    try {
      setCargando(true)
      const datos = await api.getPendientes()
      setElementos(datos)
      setSeleccionado(datos[0] || null)
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (session?.rol === 'ADMIN') cargarPendientes()
  }, [session])

  if (!session) {
    return (
      <section className="container py-5"><div className="alert alert-warning">Debés iniciar sesión como administrador.</div></section>
    )
  }

  if (session.rol !== 'ADMIN') {
    return (
      <section className="container py-5">
        <div className="alert alert-danger">Solo un administrador puede revisar pendientes.</div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Volver</button>
      </section>
    )
  }

  const procesarDecision = async (accion) => {
    if (!seleccionado) return
    setProcesando(true)
    try {
      if (accion === 'aprobar') {
        await api.aprobarContribucion(seleccionado.id, { observacionAdmin: observacion })
        setGlobalMessage({ type: 'success', text: 'Contribución aprobada correctamente.' })
      } else {
        await api.rechazarContribucion(seleccionado.id, { observacionAdmin: observacion })
        setGlobalMessage({ type: 'success', text: 'Contribución rechazada correctamente.' })
      }
      setObservacion('')
      await cargarPendientes()
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setProcesando(false)
    }
  }

  return (
    <section className="container py-5">
      <SectionTitle eyebrow="Admin" title="Contribuciones pendientes" description="Revisá las propuestas enviadas por los usuarios y decidí si se publican o no." />
      {cargando ? <LoadingBlock /> : (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="list-group shadow-sm">
              {elementos.length === 0 && <div className="list-group-item text-secondary">No hay pendientes por revisar.</div>}
              {elementos.map((elemento) => (
                <button key={elemento.id} type="button" className={`list-group-item list-group-item-action ${seleccionado?.id === elemento.id ? 'active' : ''}`} onClick={() => setSeleccionado(elemento)}>
                  <div className="fw-semibold">{elemento.titulo}</div>
                  <div className="small">{elemento.tipo} · {formatFecha(elemento.fechaCreacion)}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                {!seleccionado ? (
                  <div className="text-secondary">Seleccióná una contribución para revisar.</div>
                ) : (
                  <>
                    <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                      <div>
                        <h4 className="mb-1">{seleccionado.titulo}</h4>
                        <div className="text-secondary small">{seleccionado.tipo} · Usuario #{seleccionado.usuario?.id}</div>
                      </div>
                      <span className="badge text-bg-warning">Pendiente</span>
                    </div>
                    <div className="detail-html border rounded p-3 bg-light-subtle mb-3" dangerouslySetInnerHTML={{ __html: seleccionado.contenidoHtml || '<p>Sin contenido.</p>' }} />
                    <label className="form-label">Observación del administrador</label>
                    <textarea rows="4" className="form-control mb-3" value={observacion} onChange={(e) => setObservacion(e.target.value)} />
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-success" disabled={procesando} onClick={() => procesarDecision('aprobar')}>Aprobar</button>
                      <button className="btn btn-danger" disabled={procesando} onClick={() => procesarDecision('rechazar')}>Rechazar</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminPendientesPage
