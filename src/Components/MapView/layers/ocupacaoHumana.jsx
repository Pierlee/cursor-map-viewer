import { useMapEvents, Popup } from 'react-leaflet'

export const ocupacaoHumanaLayerMap = {
  cars: 'f2w_space:cars',
  tis: 'f2w_space:tis',
}

export function appendOcupacaoHumanaCqlClauses(activeLayer, filtersApplied, clauses) {
  // CAR
  if (activeLayer === 'cars') {
    if (filtersApplied.cod_imovel) {
      clauses.push(`cod_imovel = '${filtersApplied.cod_imovel}'`)
    }

    if (filtersApplied.municipio) {
      clauses.push(`municipio ILIKE '%${filtersApplied.municipio}%'`)
    }

    if (filtersApplied.uf) {
      const uf = filtersApplied.uf.toUpperCase()
      clauses.push(`uf = '${uf}'`)
    }

    if (filtersApplied.area) {
      clauses.push(`area >= ${filtersApplied.area}`)
    }
  }

  // Terras Indígenas
  if (activeLayer === 'tis') {
    if (filtersApplied.terrai_cod) {
      clauses.push(`terrai_cod = ${filtersApplied.terrai_cod}`)
    }

    if (filtersApplied.terrai_nom) {
      clauses.push(`terrai_nom ILIKE '%${filtersApplied.terrai_nom}%'`)
    }

    if (filtersApplied.etnia_nome) {
      clauses.push(`etnia_nome ILIKE '%${filtersApplied.etnia_nome}%'`)
    }

    if (filtersApplied.municipio_) {
      clauses.push(`municipio_ ILIKE '%${filtersApplied.municipio_}%'`)
    }

    if (filtersApplied.uf_sigla) {
      clauses.push(`uf_sigla = '${filtersApplied.uf_sigla.toUpperCase()}'`)
    }

    if (filtersApplied.fase_ti) {
      clauses.push(`fase_ti ILIKE '%${filtersApplied.fase_ti}%'`)
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

function CarsClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'cars') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:cars',
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
        console.error('Erro no WFS CARS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

function TisClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition, wfsUrl }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'tis') return

      const { lat, lng } = e.latlng
      const delta = 0.0005
      const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta},EPSG:4326`

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:tis',
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
        console.error('Erro no WFS TIS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    },
  })

  return null
}

export function OcupacaoHumanaClickHandlers(props) {
  return (
    <>
      <CarsClickHandler {...props} />
      <TisClickHandler {...props} />
    </>
  )
}

export function OcupacaoHumanaPopups({ activeLayer, popupPosition, selectedFeature }) {
  const properties = selectedFeature?.properties || {}

  return (
    <>
      {popupPosition && selectedFeature && activeLayer === 'cars' && (
        <Popup position={popupPosition}>
          <div>
            <strong>CAR</strong>
            <br />
            Código: {properties.cod_imovel || '-'}
            <br />
            Município: {properties.municipio || '-'}
            <br />
            UF: {properties.uf || '-'}
            <br />
            Área: {properties.area || '-'}
          </div>
        </Popup>
      )}

      {popupPosition && selectedFeature && activeLayer === 'tis' && (
        <Popup position={popupPosition}>
          <div>
            <strong>Terra Indígena</strong>
            <br />
            Código: {properties.terrai_cod || '-'}
            <br />
            Nome: {properties.terrai_nom || '-'}
            <br />
            Etnia: {properties.etnia_nome || '-'}
            <br />
            Município: {properties.municipio_ || '-'}
            <br />
            UF: {properties.uf_sigla || '-'}
            <br />
            Fase: {properties.fase_ti || '-'}
            <br />
            Superfície: {properties.superficie || '-'}
          </div>
        </Popup>
      )}
    </>
  )
}
