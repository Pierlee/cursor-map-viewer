import 'leaflet/dist/leaflet.css'
import './MapView.css'
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup } from 'react-leaflet'
import WmsTileLayer from './WmsTileLayer'
import { useState } from 'react'

const WMS_URL = 'https://f2w-image.onrender.com/geoserver/f2w_space/wms'
const WFS_URL = 'https://f2w-image.onrender.com/geoserver/f2w_space/ows'

function buildCqlFilter(activeLayer, filtersApplied){
  const clauses = []
  if(activeLayer === 'cars'){
    if (filtersApplied.cod_imovel){
      clauses.push(`cod_imovel = '${filtersApplied.cod_imovel}'`)
    }
    if (filtersApplied.municipio){
      clauses.push(`municipio ILIKE '%${filtersApplied.municipio}%'`)
    }
    if(filtersApplied.uf){
      const uf = filtersApplied.uf.toUpperCase()
      clauses.push(`uf = '${uf}'`)
    }
    if (filtersApplied.area){
      clauses.push(`area >= ${filtersApplied.area}`)
    }
  }
// Proteção Ambiental
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
  if(clauses.length === 0) return null
  return clauses.join(" AND ")
}

function CarsClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition}){
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'cars') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:cars',
        outputFormat: 'application/json',
        maxFeatures: '20',
        bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},EPSG:4326`,
      })

      if (cqlFilter) {
        params.set('cql_filter', cqlFilter)
      }

      const url = `${WFS_URL}?${params.toString()}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.features && data.features.length > 0) {
          const feature = data.features[0]
          setSelectedFeature(feature)
          setPopupPosition(e.latlng)
        } else {
          setSelectedFeature(null)
          setPopupPosition(null)
        } 
      } catch (error) {
        console.error('Erro no WFS: ', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })
  return null
}

function TisClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'tis') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:tis',
        outputFormat: 'application/json',
        maxFeatures: '20',
        bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},EPSG:4326`,
      })

      if (cqlFilter) {
        params.set('cql_filter', cqlFilter)
      }

      const url = `${WFS_URL}?${params.toString()}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.features && data.features.length > 0) {
          const feature = data.features[0]
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
    }
  })

  return null
}

function MapView({ activeLayer, filtersApplied }) {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [popupPosition, setPopupPosition] = useState(null)

  const cqlFilter = buildCqlFilter(activeLayer, filtersApplied)

  const layerMap = {
    cars: 'f2w_space:cars',
    prodes: 'f2w_space:prodes',
    tis: 'f2w_space:tis',
  }

  const layerName = layerMap[activeLayer]

  const wmsProps = {
    url: WMS_URL,
    format: "image/png",
    layers: layerName,
    transparent: true,
    version: "1.1.1",
    tiled: false
  }

  if(cqlFilter) {
    wmsProps.cql_filter = cqlFilter
  }
  
  const properties = selectedFeature?.properties || {}

  return(
    <main>
        <MapContainer className='map-container' center={[-3, -52]} zoom={10}>
          {/* Base Layer */}
          <TileLayer
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          />
          {/* WMS Layer */}
          <WmsTileLayer {...wmsProps}/>

          <CarsClickHandler
            activeLayer={activeLayer}
            cqlFilter={cqlFilter}
            setSelectedFeature={setSelectedFeature}
            setPopupPosition={setPopupPosition}
          />
          <TisClickHandler 
            activeLayer={activeLayer}
            cqlFilter={cqlFilter}
            setSelectedFeature={setSelectedFeature}
            setPopupPosition={setPopupPosition}
          />
          {selectedFeature && (
            <GeoJSON
              data={selectedFeature}
              style={{
                color: 'yellow',
                weight: 3,
                fillOpacity: 0.1,
              }}
            />
          )}
          {popupPosition && selectedFeature && (
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
        </MapContainer>
    </main>
  )
}

export default MapView