function LoadingBlock({ text = 'Cargando información...' }) {
  return (
    <div className="d-flex align-items-center gap-3 py-4">
      <div className="spinner-border text-warning" role="status"></div>
      <span>{text}</span>
    </div>
  )
}

export default LoadingBlock
