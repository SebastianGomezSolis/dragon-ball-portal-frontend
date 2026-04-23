import EntityCatalogPage from './EntityCatalogPage'
import { api } from '../services/api'

function PersonajesPage() {
  return (
    <EntityCatalogPage
      eyebrow="Catálogo"
      title="Personajes"
      description="Explorá personajes publicados y consultá su contenido."
      placeholder="Buscar personaje por nombre"
      loadEntities={api.getPersonajes}
      emptyText="No hay personajes publicados todavía."
      badge="Personaje"
      image="/images/pages/personajes.png"
      imageAlt="Personajes de Dragon Ball"
    />
  )
}

export default PersonajesPage
