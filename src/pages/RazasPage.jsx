import EntityCatalogPage from './EntityCatalogPage'
import { api } from '../services/api'

function RazasPage() {
  return (
    <EntityCatalogPage
      eyebrow="Catálogo"
      title="Razas"
      description="Mostrá las razas del universo Dragon Ball y revisá su contenido publicado."
      placeholder="Buscar raza por nombre"
      loadEntities={api.getRazas}
      emptyText="No hay razas publicadas todavía."
      badge="Raza"
      image="/images/pages/goku.jpg"
      imageAlt="Goku Dragon Ball"
    />
  )
}

export default RazasPage
