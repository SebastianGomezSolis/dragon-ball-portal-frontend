import { useEffect, useState } from 'react'
import DetailCard from '../components/DetailCard'
import EntityList from '../components/EntityList'
import LoadingBlock from '../components/LoadingBlock'
import SearchPanel from '../components/SearchPanel'
import SectionTitle from '../components/SectionTitle'

function EntityCatalogPage({ eyebrow, title, description, placeholder, loadEntities, emptyText, badge, image, imageAlt }) {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = async (nombre = '') => {
    try {
      setLoading(true)
      setError('')
      const data = await loadEntities(nombre)
      setItems(data)
      setSelected(data[0] || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    fetchItems(search)
  }

  return (
    <section className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <SectionTitle eyebrow={eyebrow} title={title} description={description} />
          <SearchPanel value={search} onChange={setSearch} onSearch={handleSearch} placeholder={placeholder} />
        </div>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-4">
            <EntityList items={items} onSelect={setSelected} emptyText={emptyText} />
          </div>
          <div className="col-lg-8">
            <DetailCard item={selected} badge={badge} />
          </div>
        </div>
      )}
    </section>
  )
}

export default EntityCatalogPage
