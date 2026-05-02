import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import GlobalBanner from './components/GlobalBanner'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PersonajesPage from './pages/PersonajesPage'
import SagasPage from './pages/SagasPage'
import RazasPage from './pages/RazasPage'
import ContribuirPage from './pages/ContribuirPage'
import MisContribucionesPage from './pages/MisContribucionesPage'
import AdminPendientesPage from './pages/AdminPendientesPage'
import CompararPage from './pages/CompararPage'
import { obtenerSesionGuardada, limpiarSesion } from './services/authService'
import { api } from './services/api'

const normalizarRuta = (hash) => {
  const valor = (hash || '#/').replace('#', '')
  return valor.startsWith('/') ? valor : `/${valor}`
}

function App() {
  const [ruta, setRuta] = useState(normalizarRuta(window.location.hash || '#/'))
  const [sesion, setSesion] = useState(obtenerSesionGuardada())
  const [mensajeGlobal, setMensajeGlobal] = useState(null)

  useEffect(() => {
    const alCambiarHash = () => setRuta(normalizarRuta(window.location.hash || '#/'))
    window.addEventListener('hashchange', alCambiarHash)
    return () => window.removeEventListener('hashchange', alCambiarHash)
  }, [])

  const navegar = (rutaDestino) => {
    window.location.hash = rutaDestino
  }

  const cerrarSesion = async () => {
    try { await api.logout() } catch { /* ignorar */ }
    limpiarSesion()
    setSesion(null)
    setMensajeGlobal({ type: 'success', text: 'Sesión cerrada correctamente.' })
    navegar('/')
  }

  const propsComunes = {
    session: sesion,
    setSession: setSesion,
    navigate: navegar,
    setGlobalMessage: setMensajeGlobal,
  }

  const pagina = useMemo(() => {
    switch (ruta) {
      case '/login':
        return <LoginPage {...propsComunes} />
      case '/personajes':
        return <PersonajesPage {...propsComunes} />
      case '/sagas':
        return <SagasPage {...propsComunes} />
      case '/razas':
        return <RazasPage {...propsComunes} />
      case '/contribuir':
        return <ContribuirPage {...propsComunes} />
      case '/mis-contribuciones':
        return <MisContribucionesPage {...propsComunes} />
      case '/admin/pendientes':
        return <AdminPendientesPage {...propsComunes} />
      case '/comparar':
        return <CompararPage {...propsComunes} />
      default:
        return <HomePage {...propsComunes} />
    }
  }, [ruta, sesion])

  return (
      <div className="app-shell bg-body-tertiary min-vh-100 d-flex flex-column">
        <Header session={sesion} navigate={navegar} onLogout={cerrarSesion} />
        <GlobalBanner route={ruta} navigate={navegar} />

        <main className="flex-grow-1">
          {mensajeGlobal && (
              <div className="container pt-3">
                <div className={`alert alert-${mensajeGlobal.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
                  {mensajeGlobal.text}
                  <button type="button" className="btn-close" onClick={() => setMensajeGlobal(null)}></button>
                </div>
              </div>
          )}
          {pagina}
        </main>

        <Footer />
      </div>
  )
}

export default App