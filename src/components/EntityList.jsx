function EntityList({ items, titleField = 'nombre', onSelect, emptyText }) {
  return (
    <ul className="list-group shadow-sm">
      {items.length === 0 && <li className="list-group-item text-secondary">{emptyText}</li>}
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="list-group-item list-group-item-action"
          onClick={() => onSelect(item)}
        >
          <div className="fw-semibold">{item[titleField]}</div>
        </button>
      ))}
    </ul>
  )
}

export default EntityList
