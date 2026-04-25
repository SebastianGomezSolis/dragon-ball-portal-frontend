const bannerConfig = {
  '/': {
    eyebrow: 'Dragon Ball Portal',
    title: 'Tu enciclopedia del universo Dragon Ball.',
    description: 'Consultá personajes, sagas y razas; iniciá sesión para enviar contenido y administrá revisiones desde el panel correspondiente.',
    buttonLabel: 'Explorar personajes',
    buttonRoute: '/personajes',
    image: '/images/pages/goku.jpg',
    imageAlt: 'Goku Ultra Instinto',
  },
  '/personajes': {
    eyebrow: 'Personajes',
    title: 'Héroes, villanos y guerreros legendarios.',
    description: 'Revisá fichas publicadas, buscá por nombre y consultá el contenido completo de cada personaje.',
    buttonLabel: 'Ver catálogo',
    buttonRoute: '/personajes',
    image: '/images/pages/personajes.png',
    imageAlt: 'Equipo de personajes de Dragon Ball',
  },
  '/sagas': {
    eyebrow: 'Sagas',
    title: 'Las historias más importantes de la franquicia.',
    description: 'Recorré las distintas sagas y su contenido publicado dentro del portal.',
    buttonLabel: 'Ver sagas',
    buttonRoute: '/sagas',
    image: '/images/pages/sagas.jpg',
    imageAlt: 'Escena grupal de Dragon Ball',
  },
  '/razas': {
    eyebrow: 'Razas',
    title: 'Descubrí el origen de cada guerrero.',
    description: 'Explorá las razas del universo Dragon Ball y sus características más representativas.',
    buttonLabel: 'Ver razas',
    buttonRoute: '/razas',
    image: '/images/pages/goku.jpg',
    imageAlt: 'Retrato de Goku',
  },
  '/contribuir': {
    eyebrow: 'Contribuciones',
    title: 'Agregá nuevo contenido al portal.',
    description: 'Enviá aportes con formato HTML para que el equipo administrador los revise y publique.',
    buttonLabel: 'Mis contribuciones',
    buttonRoute: '/mis-contribuciones',
    image: '/images/pages/personajes.png',
    imageAlt: 'Personajes de Dragon Ball',
  },
  '/mis-contribuciones': {
    eyebrow: 'Mi actividad',
    title: 'Seguimiento de tus aportes.',
    description: 'Consultá el estado de cada envío y las observaciones del administrador.',
    buttonLabel: 'Enviar aporte',
    buttonRoute: '/contribuir',
    image: '/images/pages/goku.jpg',
    imageAlt: 'Goku Ultra Instinto',
  },
  '/admin/pendientes': {
    eyebrow: 'Panel administrativo',
    title: 'Revisión y moderación de contribuciones.',
    description: 'Aprobá o rechazá los contenidos pendientes para mantener actualizado el portal.',
    buttonLabel: 'Ver inicio',
    buttonRoute: '/',
    image: '/images/pages/sagas.jpg',
    imageAlt: 'Saga Dragon Ball',
  },
  '/login': {
    eyebrow: 'Acceso',
    title: 'Ingresá al portal.',
    description: 'Autenticáte para enviar contribuciones, revisar tu panel personal o administrar contenido.',
    buttonLabel: 'Volver al inicio',
    buttonRoute: '/',
    image: '/images/pages/goku.jpg',
    imageAlt: 'Goku',
  },
}

function resolverConfig(ruta) {
  return bannerConfig[ruta] || bannerConfig['/']
}

function GlobalBanner({ route, navigate }) {
  const config = resolverConfig(route)

  return (
    <section className="global-banner text-white">
      <div className="banner-overlay">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="text-warning fw-semibold text-uppercase mb-2">{config.eyebrow}</div>
              <h1 className="display-5 fw-bold mb-3">{config.title}</h1>
              <p className="lead mb-4 banner-copy">{config.description}</p>
              <button className="btn btn-warning btn-lg fw-semibold" onClick={() => navigate(config.buttonRoute)}>
                {config.buttonLabel}
              </button>
            </div>
            <div className="col-lg-5">
              <div className="banner-image-card shadow-lg">
                <img src={config.image} alt={config.imageAlt} className="img-fluid w-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GlobalBanner
