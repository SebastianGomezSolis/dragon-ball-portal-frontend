import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import LoadingBlock from '../components/LoadingBlock'
import { api } from '../services/api'

function HomePage({ navigate, setGlobalMessage }) {
  const [personajes, setPersonajes] = useState([])
  const [sagas, setSagas] = useState([])
  const [razas, setRazas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDatosInicio = async () => {
      try {
        const [datosPersonajes, datosSagas, datosRazas] = await Promise.all([
          api.getPersonajes(),
          api.getSagas(),
          api.getRazas(),
        ])
        setPersonajes(datosPersonajes.slice(0, 4))
        setSagas(datosSagas.slice(0, 4))
        setRazas(datosRazas.slice(0, 4))
      } catch (error) {
        setGlobalMessage({ type: 'error', text: error.message })
      } finally {
        setCargando(false)
      }
    }

    cargarDatosInicio()
  }, [setGlobalMessage])

  return (
    <>
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100 feature-card">
              <img src="/images/pages/personajes.png" className="card-img-top section-card-image" alt="Personajes" />
              <div className="card-body">
                <h3 className="h5 fw-bold">Personajes</h3>
                <p className="text-secondary mb-3">Explorá las fichas publicadas y revisá su contenido detallado.</p>
                <button className="btn btn-outline-dark" onClick={() => navigate('/personajes')}>Entrar</button>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100 feature-card">
              <img src="/images/pages/sagas.jpg" className="card-img-top section-card-image" alt="Sagas" />
              <div className="card-body">
                <h3 className="h5 fw-bold">Sagas</h3>
                <p className="text-secondary mb-3">Consultá los grandes arcos narrativos de la serie dentro del portal.</p>
                <button className="btn btn-outline-dark" onClick={() => navigate('/sagas')}>Entrar</button>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100 feature-card">
              <img src="/images/pages/goku.jpg" className="card-img-top section-card-image" alt="Razas" />
              <div className="card-body">
                <h3 className="h5 fw-bold">Razas</h3>
                <p className="text-secondary mb-3">Descubrí el origen y las características de cada raza del universo Dragon Ball.</p>
                <button className="btn btn-outline-dark" onClick={() => navigate('/razas')}>Entrar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <SectionTitle eyebrow="Contenido publicado" title="Resumen general" description="Un vistazo rápido al contenido disponible dentro del portal." />

        {cargando ? (
          <LoadingBlock />
        ) : (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="h6 fw-bold text-uppercase text-warning">Personajes</h4>
                  <ul className="list-group list-group-flush mt-3">
                    {personajes.length === 0 ? <li className="list-group-item px-0 text-secondary">Sin registros publicados.</li> : personajes.map((item) => (
                      <li key={item.id} className="list-group-item px-0">{item.nombre}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="h6 fw-bold text-uppercase text-warning">Sagas</h4>
                  <ul className="list-group list-group-flush mt-3">
                    {sagas.length === 0 ? <li className="list-group-item px-0 text-secondary">Sin registros publicados.</li> : sagas.map((item) => (
                      <li key={item.id} className="list-group-item px-0">{item.nombre}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="h6 fw-bold text-uppercase text-warning">Razas</h4>
                  <ul className="list-group list-group-flush mt-3">
                    {razas.length === 0 ? <li className="list-group-item px-0 text-secondary">Sin registros publicados.</li> : razas.map((item) => (
                      <li key={item.id} className="list-group-item px-0">{item.nombre}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage
