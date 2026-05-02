import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import LoadingBlock from '../components/LoadingBlock'
import { api } from '../services/api'

const TIPOS = [
    { label: 'Personajes', cargar: api.getPersonajes },
    { label: 'Sagas', cargar: api.getSagas },
    { label: 'Razas', cargar: api.getRazas },
]

function PanelSelector({ titulo, items, seleccionado, onSelect }) {
    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white fw-semibold">{titulo}</div>
            <div className="card-body p-0" style={{ overflowY: 'auto', maxHeight: '320px' }}>
                <ul className="list-group list-group-flush">
                    {items.length === 0 && (
                        <li className="list-group-item text-secondary small">Sin resultados.</li>
                    )}
                    {items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`list-group-item list-group-item-action ${seleccionado?.id === item.id ? 'active' : ''}`}
                            onClick={() => onSelect(item)}
                        >
                            {item.nombre}
                        </button>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function PanelDetalle({ item, titulo }) {
    if (!item) {
        return (
            <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-dark text-white fw-semibold">{titulo}</div>
                <div className="card-body d-flex align-items-center justify-content-center text-secondary">
                    Seleccioná un elemento de la lista.
                </div>
            </div>
        )
    }

    const html = (() => {
        const crudo = item?.contenidoHtml || '<p>Sin contenido.</p>'
        return crudo.replace(/^\s*<h[1-6][^>]*>.*?<\/h[1-6]>\s*/i, '')
    })()

    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white fw-semibold">{titulo}</div>
            <div className="card-body">
                <h5 className="fw-bold mb-3">{item.nombre}</h5>
                <div
                    className="detail-html"
                    style={{ fontSize: '0.9rem' }}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    )
}

function CompararPage() {
    const [tipoIdx, setTipoIdx] = useState(0)
    const [items, setItems] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [izq, setIzq] = useState(null)
    const [der, setDer] = useState(null)

    const cargar = async (idx) => {
        try {
            setCargando(true)
            setError('')
            setIzq(null)
            setDer(null)
            const datos = await TIPOS[idx].cargar()
            setItems(datos)
        } catch (err) {
            setError(err.message)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => { cargar(tipoIdx) }, [tipoIdx])

    const cambiarTipo = (idx) => {
        setTipoIdx(idx)
    }

    const seleccionarIzq = (item) => {
        if (der?.id === item.id) setDer(null)
        setIzq(item)
    }

    const seleccionarDer = (item) => {
        if (izq?.id === item.id) setIzq(null)
        setDer(item)
    }

    const limpiar = () => {
        setIzq(null)
        setDer(null)
    }

    return (
        <section className="container py-5">
            <SectionTitle
                eyebrow="Herramienta"
                title="Comparar"
                description="Elegí dos elementos para ver su información lado a lado."
            />

            <div className="d-flex gap-2 mb-4">
                {TIPOS.map((tipo, idx) => (
                    <button
                        key={tipo.label}
                        className={`btn btn-sm ${tipoIdx === idx ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => cambiarTipo(idx)}
                    >
                        {tipo.label}
                    </button>
                ))}

                {(izq || der) && (
                    <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={limpiar}>
                        Limpiar selección
                    </button>
                )}
            </div>

            {cargando ? (
                <LoadingBlock />
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <PanelSelector
                                titulo={`${TIPOS[tipoIdx].label} — Izquierda`}
                                items={items}
                                seleccionado={izq}
                                onSelect={seleccionarIzq}
                            />
                        </div>
                        <div className="col-md-6">
                            <PanelSelector
                                titulo={`${TIPOS[tipoIdx].label} — Derecha`}
                                items={items}
                                seleccionado={der}
                                onSelect={seleccionarDer}
                            />
                        </div>
                    </div>

                    {(izq || der) && (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <PanelDetalle item={izq} titulo={izq ? izq.nombre : 'Sin selección'} />
                            </div>
                            <div className="col-md-6">
                                <PanelDetalle item={der} titulo={der ? der.nombre : 'Sin selección'} />
                            </div>
                        </div>
                    )}

                    {!izq && !der && (
                        <div className="alert alert-secondary mt-2">
                            Seleccioná un elemento en cada columna para comenzar la comparación.
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default CompararPage