import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { api } from '../services/api'

function ContribuirPage({ session, navigate, setGlobalMessage }) {
  const [formulario, setFormulario] = useState({ tipo: 'PERSONAJE', titulo: '', contenido: '' })
  const [cargando, setCargando] = useState(false)

  if (!session) {
    return (
        <section className="container py-5">
          <div className="alert alert-warning">
            Debés iniciar sesión para enviar contribuciones.
            <div className="mt-3">
              <button className="btn btn-warning" onClick={() => navigate('/login')}>
                Ir al login
              </button>
            </div>
          </div>
        </section>
    )
  }

  const actualizarCampo = (campo, valor) => setFormulario((prev) => ({ ...prev, [campo]: valor }))

  // 🔥 convierte texto a HTML automáticamente
  const convertirAHtml = (texto) => {
    if (!texto) return ""
    return `<p>${texto.replace(/\n/g, '</p><p>')}</p>`
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setCargando(true)

    try {
      const datos = {
        tipo: formulario.tipo,
        titulo: formulario.titulo,
        contenidoHtml: convertirAHtml(formulario.contenido)
      }

      await api.createContribucion(datos)

      setFormulario({ tipo: 'PERSONAJE', titulo: '', contenido: '' })

      setGlobalMessage({ type: 'success', text: 'Contribución enviada para revisión.' })
      navigate('/mis-contribuciones')

    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setCargando(false)
    }
  }

  return (
      <section className="container py-5">
        <div className="row g-4 align-items-stretch">
          <div className="col-xl-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 p-lg-5">
                <SectionTitle
                    eyebrow="Aporte"
                    title="Enviar nueva contribución"
                    description="Completá el formulario y enviá el contenido para revisión administrativa."
                />

                <form className="row g-3" onSubmit={manejarEnvio}>
                  <div className="col-md-4">
                    <label className="form-label">Tipo</label>
                    <select
                        className="form-select"
                        value={formulario.tipo}
                        onChange={(e) => actualizarCampo('tipo', e.target.value)}
                    >
                      <option value="PERSONAJE">Personaje</option>
                      <option value="SAGA">Saga</option>
                      <option value="RAZA">Raza</option>
                    </select>
                  </div>

                  <div className="col-md-8">
                    <label className="form-label">Título</label>
                    <input
                        className="form-control"
                        value={formulario.titulo}
                        onChange={(e) => actualizarCampo('titulo', e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Contenido</label>
                    <textarea
                        rows="8"
                        className="form-control"
                        value={formulario.contenido}
                        onChange={(e) => actualizarCampo('contenido', e.target.value)}
                        placeholder="Describe aquí el contenido..."
                    />
                  </div>

                  <div className="col-12 d-grid">
                    <button className="btn btn-warning fw-semibold" disabled={cargando}>
                      {cargando ? 'Enviando...' : 'Guardar contribución'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-xl-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h4 className="fw-bold">Recomendaciones</h4>
                <ul className="mb-0 text-secondary">
                  <li>Usá un título claro.</li>
                  <li>Escribí el contenido de forma simple y clara.</li>
                  <li>Separá ideas con saltos de línea.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ContribuirPage