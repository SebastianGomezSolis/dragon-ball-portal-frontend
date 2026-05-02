import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { api } from '../services/api'
import { guardarSesion } from '../services/authService'

function LoginPage({ setSession, navigate, setGlobalMessage }) {
  const [modo, setModo] = useState('login')
  const [formulario, setFormulario] = useState({
    username: localStorage.getItem('dbportal.username') ?? '',
    password: localStorage.getItem('dbportal.password') ?? '',
  })
  const [recordar, setRecordar] = useState(
      () => localStorage.getItem('dbportal.recordar') === 'true'
  )
  const [cargando, setCargando] = useState(false)

  const actualizarCampo = (campo, valor) => setFormulario((prev) => ({ ...prev, [campo]: valor }))

  const manejarLogin = async (evento) => {
    evento.preventDefault()
    setCargando(true)
    try {
      const datos = await api.login({ username: formulario.username, password: formulario.password })

      if (recordar) {
        localStorage.setItem('dbportal.recordar', 'true')
        localStorage.setItem('dbportal.username', formulario.username)
        localStorage.setItem('dbportal.password', formulario.password)
      } else {
        localStorage.removeItem('dbportal.recordar')
        localStorage.removeItem('dbportal.username')
        localStorage.removeItem('dbportal.password')
      }

      guardarSesion(datos)
      setSession(datos)
      setGlobalMessage({ type: 'success', text: `Bienvenido, ${datos.username}.` })
      navigate('/')
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setCargando(false)
    }
  }

  const manejarRegistro = async (evento) => {
    evento.preventDefault()
    setCargando(true)
    try {
      const respuesta = await api.register({
        username: formulario.username,
        password: formulario.password,
        rol: 'USER'
      })
      setGlobalMessage({
        type: 'success',
        text: typeof respuesta === 'string' ? respuesta : 'Usuario registrado correctamente.'
      })
      setModo('login')
      setFormulario({ username: '', password: '' })
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setCargando(false)
    }
  }

  return (
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <SectionTitle
                    eyebrow="Acceso"
                    title={modo === 'login' ? 'Iniciar sesión' : 'Crear usuario'}
                    description="Ingresá al portal para enviar contribuciones o revisar pendientes según tu rol."
                />

                <form onSubmit={modo === 'login' ? manejarLogin : manejarRegistro} className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Username</label>
                    <input
                        className="form-control"
                        value={formulario.username}
                        onChange={(e) => actualizarCampo('username', e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={formulario.password}
                        onChange={(e) => actualizarCampo('password', e.target.value)}
                    />
                  </div>

                  {modo === 'login' && (
                      <div className="col-12 d-flex align-items-center gap-2">
                        <input
                            type="checkbox"
                            id="recordar"
                            className="form-check-input m-0"
                            checked={recordar}
                            onChange={(e) => setRecordar(e.target.checked)}
                        />
                        <label htmlFor="recordar" className="form-check-label">
                          Recordar credenciales
                        </label>
                      </div>
                  )}

                  <div className="col-12 d-grid">
                    <button className="btn btn-warning fw-semibold" disabled={cargando}>
                      {cargando ? 'Procesando...' : modo === 'login' ? 'Iniciar sesión' : 'Registrar usuario'}
                    </button>
                  </div>
                </form>

                <hr className="my-4" />

                <button
                    className="btn btn-link p-0"
                    onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
                >
                  {modo === 'login'
                      ? '¿No tenés cuenta? Registrate aquí.'
                      : '¿Ya tenés cuenta? Volvé al login.'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default LoginPage