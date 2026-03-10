import { useMapEvents, Popup } from 'react-leaflet'

export const fiscalizacaoLayerMap = {
  embargos_ibama: 'f2w_space:embargos_ibama',
}

export function appendFiscalizacaoCqlClauses(activeLayer, filtersApplied, clauses) {
  // Embargos IBAMA
  if (activeLayer === 'embargos_ibama') {
    if (filtersApplied.numero_tad) {
      clauses.push(`numero_tad ILIKE '%${filtersApplied.numero_tad}%'`)
    }

    if (filtersApplied.sig_uf) {
      clauses.push(`sig_uf = '${filtersApplied.sig_uf.toUpperCase()}'`)
    }

    if (filtersApplied.nom_munici) {
      clauses.push(`nom_munici ILIKE '%${filtersApplied.nom_munici}%'`)
    }

    if (filtersApplied.status_tad) {
      clauses.push(`status_tad ILIKE '%${filtersApplied.status_tad}%'`)
    }

    if (filtersApplied.tipo_termo) {
      clauses.push(`tipo_termo ILIKE '%${filtersApplied.tipo_termo}%'`)
    }
  }
}

function isPointInRing(point, ring) {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi

    if (intersect) inside = !inside
  }

  return inside
}

function isPointInPolygonGeometry(point, geometry) {
  if (!geometry) return false

  const { type, coordinates } = geometry

  if (type === 'Polygon') {
    const [outerRing, ...holes] = coordinates || []
    if (!outerRing) return false

    if (!isPointInRing(point, outerRing)) return false

    for (const hole of holes) {
      if (isPointInRing(point, hole)) return false
    }

    return true
  }

  if (type === 'MultiPolygon') {
    for (const polygon of coordinates || []) {
      const [outerRing, ...holes] = polygon
      if (!outerRing) continue

      if (!isPointInRing(point, outerRing)) continue

      let inHole = false
      for (const hole of holes) {
        if (isPointInRing(point, hole)) {
          inHole = true
          break
        }
      }

      if (!inHole) return true
    }
  }

  return false
}

function findFeatureAtClick(features, latlng) {
  if (!features || features.length === 0) return null

  const point = [latlng.lng, latlng.lat]

  for (const feature of features) {
    if (isPointInPolygonGeometry(point, feature.geometry)) {
      return feature
    }
  }

  return features[0]
}

function EmbargosIbamaClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'embargos_ibama') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:embargos_ibama',
        outputFormat: 'application/json',
        maxFeatures: '20',
      })
      params.set('bbox', bbox)
      params.set('srsName', 'EPSG:4326')

      if (cqlFilter) {
        params.set('cql_filter', cqlFilter)
      }

      const url = `${wfsUrl}?${params.toString()}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        const feature = findFeatureAtClick(data.features, e.latlng)

        if (feature) {
          setSelectedFeature(feature)
          setPopupPosition(e.latlng)
        } else {
          setSelectedFeature(null)
          setPopupPosition(null)
        }
      } catch (error) {
        console.error('Erro no WFS EMBARGOS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

export function FiscalizacaoClickHandlers(props) {
  return <EmbargosIbamaClickHandler {...props} />
}

export function FiscalizacaoPopups({ activeLayer, popupPosition, selectedFeature }) {
  const properties = selectedFeature?.properties || {}

  return (
    <>
      {popupPosition && selectedFeature && activeLayer === 'embargos_ibama' && (
        <Popup position={popupPosition}>
          <div>
            <strong>Embargo IBAMA</strong>
            <br />
            Número TAD: {properties.numero_tad || '-'}
            <br />
            Tipo: {properties.tipo_termo || '-'}
            <br />
            Data: {properties.data_tad || '-'}
            <br />
            UF: {properties.sig_uf || '-'}
            <br />
            Município: {properties.nom_munici || '-'}
            <br />
            Estado: {properties.nom_uf || '-'}
            <br />
            Status: {properties.status_tad || '-'}
            <br />
            Área embargada: {properties.qtd_area_e || '-'}
            <br />
            Órgão: {properties.orgao || '-'}
          </div>
        </Popup>
      )}
    </>
  )
}
