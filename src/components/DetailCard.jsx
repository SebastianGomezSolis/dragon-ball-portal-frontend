function DetailCard({ item, titleField = 'nombre', badge, emptyText = 'Seleccioná un elemento para ver el detalle.' }) {
  const title = item?.[titleField] || ''
  const imageSrc = item?.imagenUrl || item?.imagen_url || item?.imageUrl || item?.image_url || ''

  const normalizedTitle = (title || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const fallbackByName = {
    'goku': '/images/gallery/goku.jpg',
    'vegeta': '/images/gallery/vegeta.jpg',
    'gohan': '/images/gallery/gohan.jpg',
    'piccolo': '/images/gallery/piccolo.jpg',
    'freezer': '/images/gallery/freezer.jpg',
    'frieza': '/images/gallery/freezer.jpg',
  }

  const finalImage = imageSrc || fallbackByName[normalizedTitle] || ''

  const html = (() => {
    const raw = item?.contenidoHtml || '<p>Sin contenido.</p>'
    return raw.replace(/^\s*<h[1-6][^>]*>.*?<\/h[1-6]>\s*/i, '')
  })()

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        {!item ? (
          <div className="text-secondary">{emptyText}</div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <h4 className="card-title mb-0">{title}</h4>
              {badge && <span className="badge text-bg-warning">{badge}</span>}
            </div>

            {finalImage && (
              <div className="detail-image-shell mb-4">
                <div className="detail-image-frame">
                  <img
                    src={finalImage}
                    alt={title}
                    className="detail-main-image"
                    onError={(e) => {
                      const shell = e.currentTarget.closest('.detail-image-shell')
                      if (shell) shell.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="detail-html" dangerouslySetInnerHTML={{ __html: html }} />
          </>
        )}
      </div>
    </div>
  )
}

export default DetailCard
