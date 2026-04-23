import { formatRole } from '../utils/formatters'

function NavItem({ label, href, onClick, highlight = false }) {
  return (
    <li className="nav-item">
      <a className={`nav-link ${highlight ? 'fw-semibold text-warning' : ''}`} href={href} onClick={onClick}>{label}</a>
    </li>
  )
}

function Header({ session, navigate, onLogout }) {
  const isAdmin = session?.rol === 'ADMIN'
  const isLogged = Boolean(session)

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#/">
          <img src="/images/branding/icon.jpg" alt="Icono Dragon Ball Portal" className="brand-icon rounded-circle" />
          <span>Dragon Ball Portal</span>
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavItem label="Inicio" href="#/" />
            <NavItem label="Personajes" href="#/personajes" />
            <NavItem label="Sagas" href="#/sagas" />
            <NavItem label="Razas" href="#/razas" />
            {isLogged && <NavItem label="Contribuir" href="#/contribuir" />}
            {isLogged && <NavItem label="Mis contribuciones" href="#/mis-contribuciones" />}
            {isAdmin && <NavItem label="Pendientes" href="#/admin/pendientes" highlight />}
          </ul>

          <div className="d-flex align-items-center gap-3 text-white small">
            {isLogged ? (
              <>
                <div className="text-end d-none d-md-block">
                  <div className="fw-semibold">{session.username}</div>
                  <div className="text-secondary">{formatRole(session.rol)}</div>
                </div>
                <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Cerrar sesión</button>
              </>
            ) : (
              <button className="btn btn-warning btn-sm fw-semibold" onClick={() => navigate('/login')}>Iniciar sesión</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
