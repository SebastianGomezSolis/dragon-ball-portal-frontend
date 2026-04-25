import { useEffect, useState } from 'react'
import DetailCard from '../components/DetailCard'
import EntityList from '../components/EntityList'
import LoadingBlock from '../components/LoadingBlock'
import SearchPanel from '../components/SearchPanel'
import SectionTitle from '../components/SectionTitle'

function EntityCatalogPage({ eyebrow, title, description, placeholder, loadEntities, emptyText, badge, image, imageAlt }) {
  const [busqueda, setBusqueda] = useState('')
  const [elementos, setElementos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarElementos = async (nombre = '') => {
    try {
      setCargando(true)
      setError('')
      const datos = await loadEntities(nombre)
      setElementos(datos)
      setSeleccionado(datos[0] || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarElementos()
  }, [])

  const manejarBusqueda = (evento) => {
    evento.preventDefault()
    cargarElementos(busqueda)
  }

  return (
    <section className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <SectionTitle eyebrow={eyebrow} title={title} description={description} />
          <SearchPanel value={busqueda} onChange={setBusqueda} onSearch={manejarBusqueda} placeholder={placeholder} />
        </div>
      </div>

      {cargando ? (
        <LoadingBlock />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-4">
            <EntityList items={elementos} onSelect={setSeleccionado} emptyText={emptyText} />
          </div>
          <div className="col-lg-8">
            <DetailCard item={seleccionado} badge={badge} />
          </div>
        </div>
      )}
    </section>
  )
}

export default EntityCatalogPage
