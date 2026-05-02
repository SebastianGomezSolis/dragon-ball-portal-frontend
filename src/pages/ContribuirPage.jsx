import { useState, useEffect, useRef } from 'react'
import SectionTitle from '../components/SectionTitle'
import { api } from '../services/api'

function EditorQuill({ onChange }) {
  const contenedorRef = useRef(null)
  const quillRef = useRef(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    if (!contenedorRef.current || quillRef.current) return
    if (typeof window.Quill === 'undefined') return

    const quill = new window.Quill(contenedorRef.current, {
      theme: 'snow',
      placeholder: 'Describí el personaje, saga o raza con detalle...',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'clean'],
        ],
      },
    })

    quill.on('text-change', () => {
      onChangeRef.current(quill.root.innerHTML)
    })

    quillRef.current = quill
  }, [])

  return (
      <div
          ref={contenedorRef}
          style={{ minHeight: '220px', background: '#fff', borderRadius: '0 0 6px 6px' }}
      />
  )
}

function ContribuirPage({ session, navigate, setGlobalMessage }) {
  const [formulario, setFormulario] = useState({ tipo: 'PERSONAJE', titulo: '' })
  const [contenidoHtml, setContenidoHtml] = useState('')
  const [cargando, setCargando] = useState(false)
  const [quillListo, setQuillListo] = useState(false)

  useEffect(() => {
    if (typeof window.Quill !== 'undefined') {
      setQuillListo(true)
      return
    }
    const intervalo = setInterval(() => {
      if (typeof window.Quill !== 'undefined') {
        setQuillListo(true)
        clearInterval(intervalo)
      }
    }, 100)
    return () => clearInterval(intervalo)
  }, [])

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

  const actualizarCampo = (campo, valor) =>
      setFormulario((prev) => ({ ...prev, [campo]: valor }))

  const esVacio = (html) => {
    const texto = html.replace(/<[^>]*>/g, '').replace(/\s/g, '')
    return texto.length === 0
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    if (!formulario.titulo.trim()) {
      setGlobalMessage({ type: 'error', text: 'El título es requerido.' })
      return
    }

    if (esVacio(contenidoHtml)) {
      setGlobalMessage({ type: 'error', text: 'El contenido no puede estar vacío.' })
      return
    }

    setCargando(true)
    try {
      await api.createContribucion({
        tipo: formulario.tipo,
        titulo: formulario.titulo,
        contenidoHtml,
      })

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
                        placeholder="Ej: Broly, Saga del Torneo del Poder, Saiyajin..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Contenido</label>
                    {quillListo ? (
                        <EditorQuill onChange={setContenidoHtml} />
                    ) : (
                        <div className="border rounded p-3 text-secondary">Cargando editor...</div>
                    )}
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
                <h4 className="fw-bold mb-3">Recomendaciones</h4>
                <ul className="text-secondary mb-0">
                  <li className="mb-2">Usá un título claro y específico.</li>
                  <li className="mb-2">Podés usar <strong>negrita</strong>, <em>cursiva</em> y listas para organizar el contenido.</li>
                  <li className="mb-2">Describí el personaje o saga con detalle: origen, poderes, historia.</li>
                  <li className="mb-2">El administrador revisará el contenido antes de publicarlo.</li>
                </ul>
                <hr />
                <h6 className="fw-semibold mb-2">Tipos disponibles</h6>
                <ul className="text-secondary mb-0 small">
                  <li><strong>Personaje:</strong> héroes, villanos, personajes secundarios.</li>
                  <li><strong>Saga:</strong> arcos argumentales de la serie.</li>
                  <li><strong>Raza:</strong> especies del universo Dragon Ball.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ContribuirPage