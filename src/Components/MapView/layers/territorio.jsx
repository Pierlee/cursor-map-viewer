import { useMapEvents, Popup } from 'react-leaflet'

export const territorioLayerMap = {
  br_municipios_2024: 'f2w_space:br_municipios_2024',
  lm_bioma_250: 'f2w_space:lm_bioma_250',
}

export function appendTerritorioCqlClauses(activeLayer, filtersApplied, clauses) {
  // Municípios
  if (activeLayer === 'br_municipios_2024') {
    if (filtersApplied.cd_mun) {
      clauses.push(`cd_mun = '${filtersApplied.cd_mun}'`)
    }

    if (filtersApplied.nm_mun) {
      clauses.push(`nm_mun ILIKE '%${filtersApplied.nm_mun}%'`)
    }

    if (filtersApplied.sigla_uf) {
      clauses.push(`sigla_uf = '${filtersApplied.sigla_uf.toUpperCase()}'`)
    }

    if (filtersApplied.nm_uf) {
      clauses.push(`nm_uf ILIKE '%${filtersApplied.nm_uf}%'`)
    }
  }

  // Biomas
  if (activeLayer === 'lm_bioma_250') {
    if (filtersApplied.cd_bioma) {
      clauses.push(`cd_bioma = ${filtersApplied.cd_bioma}`)
    }

    if (filtersApplied.bioma) {
      clauses.push(`bioma ILIKE '%${filtersApplied.bioma}%'`)
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

function MunicipiosClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'br_municipios_2024') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:br_municipios_2024',
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
        console.error('Erro no WFS MUNICIPIOS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

function BiomasClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'lm_bioma_250') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:lm_bioma_250',
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
        console.error('Erro no WFS BIOMAS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

export function TerritorioClickHandlers(props) {
  return (
    <>
      <MunicipiosClickHandler {...props} />
      <BiomasClickHandler {...props} />
    </>
  )
}

export function TerritorioPopups({ activeLayer, popupPosition, selectedFeature }) {
  const properties = selectedFeature?.properties || {}

  return (
    <>
      {popupPosition && selectedFeature && activeLayer === 'br_municipios_2024' && (
        <Popup position={popupPosition}>
          <div>
            <strong>Município</strong>
            <br />
            Código: {properties.cd_mun || '-'}
            <br />
            Nome: {properties.nm_mun || '-'}
            <br />
            UF: {properties.sigla_uf || '-'}
            <br />
            Estado: {properties.nm_uf || '-'}
            <br />
            Área km²: {properties.area_km2 || '-'}
          </div>
        </Popup>
      )}

      {popupPosition && selectedFeature && activeLayer === 'lm_bioma_250' && (
        <Popup position={popupPosition}>
          <div>
            <strong>Bioma</strong>
            <br />
            Código: {properties.cd_bioma || '-'}
            <br />
            Nome: {properties.bioma || '-'}
          </div>
        </Popup>
      )}
    </>
  )
}
