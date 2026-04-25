function EntityList({ items, titleField = 'nombre', onSelect, emptyText }) {
  return (
    <ul className="list-group shadow-sm">
      {items.length === 0 && <li className="list-group-item text-secondary">{emptyText}</li>}
      {items.map((elemento) => (
        <button
          key={elemento.id}
          type="button"
          className="list-group-item list-group-item-action"
          onClick={() => onSelect(elemento)}
        >
          <div className="fw-semibold">{elemento[titleField]}</div>
        </button>
      ))}
    </ul>
  )
}

export default EntityList
