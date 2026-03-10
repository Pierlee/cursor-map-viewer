import 'leaflet/dist/leaflet.css'
import './MapView.css'
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Popup } from 'react-leaflet'
import WmsTileLayer from './WmsTileLayer'
import { useState } from 'react'

// =========================
// URLs GEOERVER
// =========================
const WMS_URL = 'https://f2w-image.onrender.com/geoserver/f2w_space/wms'
const WFS_URL = 'https://f2w-image.onrender.com/geoserver/f2w_space/ows'

// =========================
// CQL FILTERS
// =========================
function buildCqlFilter(activeLayer, filtersApplied) {
  const clauses = []

  // =========================
  // TERRITÓRIO
  // =========================

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

  // =========================
  // OCUPAÇÃO HUMANA
  // =========================

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

  // =========================
  // MONITORAMENTO
  // =========================

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

  // =========================
  // FISCALIZAÇÃO
  // =========================

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

  // =========================
  // PROTEÇÃO AMBIENTAL
  // =========================

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

  if (clauses.length === 0) return null
  return clauses.join(" AND ")
}

// =========================
// CLICK HANDLERS - TERRITÓRIO
// =========================

// Municípios
function MunicipiosClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'br_municipios_2024') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:br_municipios_2024',
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
        console.error('Erro no WFS MUNICIPIOS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// Biomas
function BiomasClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'lm_bioma_250') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:lm_bioma_250',
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
        console.error('Erro no WFS BIOMAS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// =========================
// CLICK HANDLERS - OCUPAÇÃO HUMANA
// =========================

// CAR
function CarsClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
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
        console.error('Erro no WFS CARS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// Terras Indígenas
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

// =========================
// CLICK HANDLERS - MONITORAMENTO
// =========================

// PRODES
function ProdesClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'prodes') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:prodes',
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
        console.error('Erro no WFS PRODES:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// MapBiomas
function MapbiomasClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'mapbiomas') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:mapbiomas',
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
        console.error('Erro no WFS MAPBIOMAS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// =========================
// CLICK HANDLERS - FISCALIZAÇÃO
// =========================

// Embargos IBAMA
function EmbargosIbamaClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'embargos_ibama') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:embargos_ibama',
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
        console.error('Erro no WFS EMBARGOS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// =========================
// CLICK HANDLERS - PROTEÇÃO AMBIENTAL
// =========================

// UCs Federais
function UcsClickHandler({ activeLayer, cqlFilter, setSelectedFeature, setPopupPosition }) {
  useMapEvents({
    async click(e) {
      if (activeLayer !== 'limites_ucs_federais_21072025') return

      const map = e.target
      const bounds = map.getBounds()

      const params = new URLSearchParams({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'f2w_space:limites_ucs_federais_21072025',
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
        console.error('Erro no WFS UCS:', error)
        setSelectedFeature(null)
        setPopupPosition(null)
      }
    }
  })

  return null
}

// =========================
// MAPVIEW
// =========================
function MapView({ activeLayer, filtersApplied }) {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [popupPosition, setPopupPosition] = useState(null)

  const cqlFilter = buildCqlFilter(activeLayer, filtersApplied)

  // =========================
  // WMS LAYERS
  // =========================
  const layerMap = {
    // Território
    br_municipios_2024: 'f2w_space:br_municipios_2024',
    lm_bioma_250: 'f2w_space:lm_bioma_250',

    // Ocupação Humana
    cars: 'f2w_space:cars',
    tis: 'f2w_space:tis',

    // Monitoramento
    prodes: 'f2w_space:prodes',
    mapbiomas: 'f2w_space:mapbiomas',

    // Fiscalização
    embargos_ibama: 'f2w_space:embargos_ibama',

    // Proteção Ambiental
    limites_ucs_federais_21072025: 'f2w_space:limites_ucs_federais_21072025',
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

  if (cqlFilter) {
    wmsProps.cql_filter = cqlFilter
  }

  const properties = selectedFeature?.properties || {}

  return (
    <main>
      <MapContainer className='map-container' center={[-3, -52]} zoom={10}>
        {/* Base Layer */}
        <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />

        {/* WMS Layer */}
        <WmsTileLayer {...wmsProps} />

        {/* =========================
            CLICK HANDLERS - TERRITÓRIO
        ========================= */}
        <MunicipiosClickHandler
          activeLayer={activeLayer}
          cqlFilter={cqlFilter}
          setSelectedFeature={setSelectedFeature}
          setPopupPosition={setPopupPosition}
        />
        <BiomasClickHandler
          activeLayer={activeLayer}
          cqlFilter={cqlFilter}
          setSelectedFeature={setSelectedFeature}
          setPopupPosition={setPopupPosition}
        />

        {/* =========================
            CLICK HANDLERS - OCUPAÇÃO HUMANA
        ========================= */}
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

        {/* =========================
            CLICK HANDLERS - MONITORAMENTO
        ========================= */}
        <ProdesClickHandler
          activeLayer={activeLayer}
          cqlFilter={cqlFilter}
          setSelectedFeature={setSelectedFeature}
          setPopupPosition={setPopupPosition}
        />
        <MapbiomasClickHandler
          activeLayer={activeLayer}
          cqlFilter={cqlFilter}
          setSelectedFeature={setSelectedFeature}
          setPopupPosition={setPopupPosition}
        />

        {/* =========================
            CLICK HANDLERS - FISCALIZAÇÃO
        ========================= */}
        <EmbargosIbamaClickHandler
          activeLayer={activeLayer}
          cqlFilter={cqlFilter}
          setSelectedFeature={setSelectedFeature}
          setPopupPosition={setPopupPosition}
        />

        {/* =========================
            CLICK HANDLERS - PROTEÇÃO AMBIENTAL
        ========================= */}
        <UcsClickHandler
          activeLayer={activeLayer}
          cqlFilter={cqlFilter}
          setSelectedFeature={setSelectedFeature}
          setPopupPosition={setPopupPosition}
        />

        {/* Highlight da feature selecionada */}
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

        {/* =========================
            POPUPS - OCUPAÇÃO HUMANA
        ========================= */}
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

        {/* =========================
            POPUPS - TERRITÓRIO
        ========================= */}
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

        {/* =========================
            POPUPS - MONITORAMENTO
        ========================= */}
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

        {/* =========================
            POPUPS - FISCALIZAÇÃO
        ========================= */}
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

        {/* =========================
            POPUPS - PROTEÇÃO AMBIENTAL
        ========================= */}
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
      </MapContainer>
    </main>
  )
}

export default MapView