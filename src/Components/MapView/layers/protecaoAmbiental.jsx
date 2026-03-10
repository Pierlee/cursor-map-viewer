import { useMapEvents, Popup } from 'react-leaflet'

export const protecaoAmbientalLayerMap = {
  limites_ucs_federais_21072025: 'f2w_space:limites_ucs_federais_21072025',
}

export function appendProtecaoAmbientalCqlClauses(activeLayer, filtersApplied, clauses) {
  // UCs Federais
  if (activeLayer === 'limites_ucs_federais_21072025') {
    if (filtersApplied.cnuc) {
      clauses.push(`cnuc ILIKE '%${filtersApplied.cnuc}%'`)
    }

    if (filtersApplied.nomeuc) {
      clauses.push(`nomeuc ILIKE '%${filtersApplied.nomeuc}%'`)
    }

    if (filtersApplied.siglacateg) {
      clauses.push(`siglacateg ILIKE '%${filtersApplied.siglacateg}%'`)
    }

    if (filtersApplied.grupouc) {
      clauses.push(`grupouc ILIKE '%${filtersApplied.grupouc}%'`)
    }

    if (filtersApplied.ufabrang) {
      clauses.push(`ufabrang ILIKE '%${filtersApplied.ufabrang.toUpperCase()}%'`)
    }

    if (filtersApplied.biomaibge) {
      clauses.push(`biomaibge ILIKE '%${filtersApplied.biomaibge}%'`)
    }

    if (filtersApplied.criacaoano) {
      clauses.push(`criacaoano = '${filtersApplied.criacaoano}'`)
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

function UcsClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'limites_ucs_federais_21072025') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:limites_ucs_federais_21072025',
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
        console.error('Erro no WFS UCS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

export function ProtecaoAmbientalClickHandlers(props) {
  return <UcsClickHandler {...props} />
}

export function ProtecaoAmbientalPopups({ activeLayer, popupPosition, selectedFeature }) {
  const properties = selectedFeature?.properties || {}

  return (
    <>
      {popupPosition && selectedFeature && activeLayer === 'limites_ucs_federais_21072025' && (
        <Popup position={popupPosition}>
          <div>
            <strong>Unidade de Conservação</strong>
            <br />
            CNUC: {properties.cnuc || '-'}
            <br />
            Nome: {properties.nomeuc || '-'}
            <br />
            Abreviação: {properties.abrev || '-'}
            <br />
            Categoria: {properties.siglacateg || '-'}
            <br />
            Grupo: {properties.grupouc || '-'}
            <br />
            UF: {properties.ufabrang || '-'}
            <br />
            Bioma: {properties.biomaibge || '-'}
            <br />
            Criação: {properties.criacaoano || '-'}
            <br />
            Demarcação: {properties.demarcacao || '-'}
            <br />
            Área: {properties.area || '-'}
          </div>
        </Popup>
      )}
    </>
  )
}
