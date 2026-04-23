import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import LoadingBlock from '../components/LoadingBlock'
import { api } from '../services/api'
import { formatFecha } from '../utils/formatters'

function AdminPendientesPage({ session, navigate, setGlobalMessage }) {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [observacion, setObservacion] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const loadPendientes = async () => {
    try {
      setLoading(true)
      const data = await api.getPendientes()
      setItems(data)
      setSelected(data[0] || null)
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.rol === 'ADMIN') loadPendientes()
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

  const processDecision = async (action) => {
    if (!selected) return
    setProcessing(true)
    try {
      if (action === 'approve') {
        await api.aprobarContribucion(selected.id, { observacionAdmin: observacion })
        setGlobalMessage({ type: 'success', text: 'Contribución aprobada correctamente.' })
      } else {
        await api.rechazarContribucion(selected.id, { observacionAdmin: observacion })
        setGlobalMessage({ type: 'success', text: 'Contribución rechazada correctamente.' })
      }
      setObservacion('')
      await loadPendientes()
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <section className="container py-5">
      <SectionTitle eyebrow="Admin" title="Contribuciones pendientes" description="Revisá las propuestas enviadas por los usuarios y decidí si se publican o no." />
      {loading ? <LoadingBlock /> : (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="list-group shadow-sm">
              {items.length === 0 && <div className="list-group-item text-secondary">No hay pendientes por revisar.</div>}
              {items.map((item) => (
                <button key={item.id} type="button" className={`list-group-item list-group-item-action ${selected?.id === item.id ? 'active' : ''}`} onClick={() => setSelected(item)}>
                  <div className="fw-semibold">{item.titulo}</div>
                  <div className="small">{item.tipo} · {formatFecha(item.fechaCreacion)}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                {!selected ? (
                  <div className="text-secondary">Seleccioná una contribución para revisar.</div>
                ) : (
                  <>
                    <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                      <div>
                        <h4 className="mb-1">{selected.titulo}</h4>
                        <div className="text-secondary small">{selected.tipo} · Usuario #{selected.usuario?.id}</div>
                      </div>
                      <span className="badge text-bg-warning">Pendiente</span>
                    </div>
                    <div className="detail-html border rounded p-3 bg-light-subtle mb-3" dangerouslySetInnerHTML={{ __html: selected.contenidoHtml || '<p>Sin contenido.</p>' }} />
                    <label className="form-label">Observación del administrador</label>
                    <textarea rows="4" className="form-control mb-3" value={observacion} onChange={(e) => setObservacion(e.target.value)} />
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-success" disabled={processing} onClick={() => processDecision('approve')}>Aprobar</button>
                      <button className="btn btn-danger" disabled={processing} onClick={() => processDecision('reject')}>Rechazar</button>
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
