import EntityCatalogPage from './EntityCatalogPage'
import { api } from '../services/api'

function SagasPage() {
  return (
    <EntityCatalogPage
      eyebrow="Catálogo"
      title="Sagas"
      description="Consultá las sagas registradas en el portal con una navegación rápida de lista y detalle."
      placeholder="Buscar saga por nombre"
      loadEntities={api.getSagas}
      emptyText="No hay sagas publicadas todavía."
      badge="Saga"
      image="/images/pages/sagas.jpg"
      imageAlt="Saga Dragon Ball"
    />
  )
}

export default SagasPage
