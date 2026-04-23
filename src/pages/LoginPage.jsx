import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import { api } from '../services/api'
import { saveSession } from '../services/authService'

function LoginPage({ setSession, navigate, setGlobalMessage }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const data = await api.login({ username: form.username, password: form.password })
      saveSession(data)
      setSession(data)
      setGlobalMessage({ type: 'success', text: `Bienvenido, ${data.username}.` })
      navigate('/')
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.register({
        username: form.username,
        password: form.password,
        rol: 'USER'
      })
      setGlobalMessage({
        type: 'success',
        text: typeof response === 'string' ? response : 'Usuario registrado correctamente.'
      })
      setMode('login')
      setForm({ username: '', password: '' })
    } catch (error) {
      setGlobalMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
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
                    title={mode === 'login' ? 'Iniciar sesión' : 'Crear usuario'}
                    description="Ingresá al portal para enviar contribuciones o revisar pendientes según tu rol."
                />

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Username</label>
                    <input
                        className="form-control"
                        value={form.username}
                        onChange={(e) => updateField('username', e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) => updateField('password', e.target.value)}
                    />
                  </div>

                  <div className="col-12 d-grid">
                    <button className="btn btn-warning fw-semibold" disabled={loading}>
                      {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrar usuario'}
                    </button>
                  </div>
                </form>

                <hr className="my-4" />

                <button
                    className="btn btn-link p-0"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login'
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