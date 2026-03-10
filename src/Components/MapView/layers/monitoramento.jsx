import { useMapEvents, Popup } from 'react-leaflet'

export const monitoramentoLayerMap = {
  prodes: 'f2w_space:prodes',
  mapbiomas: 'f2w_space:mapbiomas',
}

export function appendMonitoramentoCqlClauses(activeLayer, filtersApplied, clauses) {
  // PRODES
  if (activeLayer === 'prodes') {
    if (filtersApplied.year) {
      clauses.push(`year = ${filtersApplied.year}`)
    }

    if (filtersApplied.uuid) {
      clauses.push(`uuid = '${filtersApplied.uuid}'`)
    }

    if (filtersApplied.source) {
      clauses.push(`source ILIKE '%${filtersApplied.source}%'`)
    }

    if (filtersApplied.main_class) {
      clauses.push(`main_class ILIKE '%${filtersApplied.main_class}%'`)
    }
  }

  // MapBiomas
  if (activeLayer === 'mapbiomas') {
    if (filtersApplied.codealerta) {
      clauses.push(`codealerta = ${filtersApplied.codealerta}`)
    }

    if (filtersApplied.fonte) {
      clauses.push(`fonte ILIKE '%${filtersApplied.fonte}%'`)
    }

    if (filtersApplied.bioma) {
      clauses.push(`bioma ILIKE '%${filtersApplied.bioma}%'`)
    }

    if (filtersApplied.estado) {
      clauses.push(`estado ILIKE '%${filtersApplied.estado}%'`)
    }

    if (filtersApplied.municipio) {
      clauses.push(`municipio ILIKE '%${filtersApplied.municipio}%'`)
    }

    if (filtersApplied.anodetec) {
      clauses.push(`anodetec = ${filtersApplied.anodetec}`)
    }

    if (filtersApplied.vpressao) {
      clauses.push(`vpressao ILIKE '%${filtersApplied.vpressao}%'`)
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

function ProdesClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'prodes') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:prodes',
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
        console.error('Erro no WFS PRODES:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

function MapbiomasClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'mapbiomas') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:mapbiomas',
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
        console.error('Erro no WFS MAPBIOMAS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

export function MonitoramentoClickHandlers(props) {
  return (
    <>
      <ProdesClickHandler {...props} />
      <MapbiomasClickHandler {...props} />
    </>
  )
}

export function MonitoramentoPopups({ activeLayer, popupPosition, selectedFeature }) {
  const properties = selectedFeature?.properties || {}

  return (
    <>
      {popupPosition && selectedFeature && activeLayer === 'prodes' && (
        <Popup position={popupPosition}>
          <div>
            <strong>PRODES</strong>
            <br />
            UUID: {properties.uuid || '-'}
            <br />
            Ano: {properties.year || '-'}
            <br />
            Área km²: {properties.area_km || '-'}
            <br />
            Classe: {properties.main_class || '-'}
            <br />
            Fonte: {properties.source || '-'}
          </div>
        </Popup>
      )}

      {popupPosition && selectedFeature && activeLayer === 'mapbiomas' && (
        <Popup position={popupPosition}>
          <div>
            <strong>MapBiomas</strong>
            <br />
            Código alerta: {properties.codealerta || '-'}
            <br />
            Fonte: {properties.fonte || '-'}
            <br />
            Bioma: {properties.bioma || '-'}
            <br />
            Estado: {properties.estado || '-'}
            <br />
            Município: {properties.municipio || '-'}
            <br />
            Área ha: {properties.areaha || '-'}
            <br />
            Ano detecção: {properties.anodetec || '-'}
            <br />
            Data detecção: {properties.datadetec || '-'}
            <br />
            Data publicação: {properties.dtpubli || '-'}
            <br />
            Pressão: {properties.vpressao || '-'}
          </div>
        </Popup>
      )}
    </>
  )
}
