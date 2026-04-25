import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import LoadingBlock from '../components/LoadingBlock'
import { api } from '../services/api'
import { formatEstado, formatFecha } from '../utils/formatters'

function claseEstado(estado) {
  switch (estado) {
    case 'APROBADA':
      return 'success'
    case 'RECHAZADA':
      return 'danger'
    default:
      return 'warning'
  }
}

function MisContribucionesPage({ session, navigate, setGlobalMessage }) {
  const [elementos, setElementos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!session) return
    const cargar = async () => {
      try {
        const datos = await api.getMisContribuciones()
        setElementos(datos)
      } catch (error) {
        setGlobalMessage({ type: 'error', text: error.message })
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [session])

  if (!session) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">
          Debés iniciar sesión para ver tus contribuciones.
          <div className="mt-3">
            <button className="btn btn-warning" onClick={() => navigate('/login')}>Ir al login</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-5">
      <SectionTitle eyebrow="Panel personal" title="Mis contribuciones" description="Acá revisás todo lo que enviaste y el estado que tiene dentro del proceso de aprobación." />
      {cargando ? <LoadingBlock /> : (
        <div className="row g-3">
          {elementos.length === 0 && <div className="col-12"><div className="alert alert-secondary">No has enviado contribuciones todavía.</div></div>}
          {elementos.map((elemento) => (
            <div className="col-12" key={elemento.id}>
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between gap-3 mb-2">
                    <div>
                      <h5 className="mb-1">{elemento.titulo}</h5>
                      <div className="text-secondary small">{elemento.tipo} · {formatFecha(elemento.fechaCreacion)}</div>
                    </div>
                    <span className={`badge text-bg-${claseEstado(elemento.estado)} align-self-start`}>{formatEstado(elemento.estado)}</span>
                  </div>
                  <div className="small text-secondary mb-2">Observación del admin: {elemento.observacionAdmin || 'Sin observaciones.'}</div>
                  <div className="detail-html border-top pt-3" dangerouslySetInnerHTML={{ __html: elemento.contenidoHtml || '<p>Sin contenido.</p>' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default MisContribucionesPage
