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
import { getStoredSession, clearSession } from './services/authService'

const normalizeRoute = (hash) => {
  const value = (hash || '#/').replace('#', '')
  return value.startsWith('/') ? value : `/${value}`
}

function App() {
  const [route, setRoute] = useState(normalizeRoute(window.location.hash || '#/'))
  const [session, setSession] = useState(getStoredSession())
  const [globalMessage, setGlobalMessage] = useState(null)

  useEffect(() => {
    const onHashChange = () => setRoute(normalizeRoute(window.location.hash || '#/'))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (targetRoute) => {
    window.location.hash = targetRoute
  }

  const logout = () => {
    clearSession()
    setSession(null)
    setGlobalMessage({ type: 'success', text: 'Sesión cerrada correctamente.' })
    navigate('/')
  }

  const commonProps = {
    session,
    setSession,
    navigate,
    setGlobalMessage,
  }

  const page = useMemo(() => {
    switch (route) {
      case '/login':
        return <LoginPage {...commonProps} />
      case '/personajes':
        return <PersonajesPage {...commonProps} />
      case '/sagas':
        return <SagasPage {...commonProps} />
      case '/razas':
        return <RazasPage {...commonProps} />
      case '/contribuir':
        return <ContribuirPage {...commonProps} />
      case '/mis-contribuciones':
        return <MisContribucionesPage {...commonProps} />
      case '/admin/pendientes':
        return <AdminPendientesPage {...commonProps} />
      default:
        return <HomePage {...commonProps} />
    }
  }, [route, session])

  return (
    <div className="app-shell bg-body-tertiary min-vh-100 d-flex flex-column">
      <Header session={session} navigate={navigate} onLogout={logout} />
      <GlobalBanner route={route} navigate={navigate} />

      <main className="flex-grow-1">
        {globalMessage && (
          <div className="container pt-3">
            <div className={`alert alert-${globalMessage.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
              {globalMessage.text}
              <button type="button" className="btn-close" onClick={() => setGlobalMessage(null)}></button>
            </div>
          </div>
        )}
        {page}
      </main>

      <Footer />
    </div>
  )
}

export default App
