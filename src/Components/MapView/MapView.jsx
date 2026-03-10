import 'leaflet/dist/leaflet.css'
import './MapView.css'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import WmsTileLayer from './WmsTileLayer'
import { useState } from 'react'
import {
  TerritorioClickHandlers,
  TerritorioPopups,
  appendTerritorioCqlClauses,
  territorioLayerMap,
} from './layers/territorio'
import {
  OcupacaoHumanaClickHandlers,
  OcupacaoHumanaPopups,
  appendOcupacaoHumanaCqlClauses,
  ocupacaoHumanaLayerMap,
} from './layers/ocupacaoHumana'
import {
  MonitoramentoClickHandlers,
  MonitoramentoPopups,
  appendMonitoramentoCqlClauses,
  monitoramentoLayerMap,
} from './layers/monitoramento'
import {
  FiscalizacaoClickHandlers,
  FiscalizacaoPopups,
  appendFiscalizacaoCqlClauses,
  fiscalizacaoLayerMap,
} from './layers/fiscalizacao'
import {
  ProtecaoAmbientalClickHandlers,
  ProtecaoAmbientalPopups,
  appendProtecaoAmbientalCqlClauses,
  protecaoAmbientalLayerMap,
} from './layers/protecaoAmbiental'

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

  appendTerritorioCqlClauses(activeLayer, filtersApplied, clauses)
  appendOcupacaoHumanaCqlClauses(activeLayer, filtersApplied, clauses)
  appendMonitoramentoCqlClauses(activeLayer, filtersApplied, clauses)
  appendFiscalizacaoCqlClauses(activeLayer, filtersApplied, clauses)
  appendProtecaoAmbientalCqlClauses(activeLayer, filtersApplied, clauses)

  if (clauses.length === 0) return null
  return clauses.join(" AND ")
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
    ...territorioLayerMap,
    ...ocupacaoHumanaLayerMap,
    ...monitoramentoLayerMap,
    ...fiscalizacaoLayerMap,
    ...protecaoAmbientalLayerMap,
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

  const clickHandlerProps = {
    activeLayer,
    cqlFilter,
    setSelectedFeature,
    setPopupPosition,
    wfsUrl: WFS_URL,
  }

  return (
    <main>
      <MapContainer className='map-container' center={[-3, -52]} zoom={10}>
        {/* Base Layer */}
        <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />

        {/* WMS Layer */}
        <WmsTileLayer {...wmsProps} />

        <TerritorioClickHandlers {...clickHandlerProps} />
        <OcupacaoHumanaClickHandlers {...clickHandlerProps} />
        <MonitoramentoClickHandlers {...clickHandlerProps} />
        <FiscalizacaoClickHandlers {...clickHandlerProps} />
        <ProtecaoAmbientalClickHandlers {...clickHandlerProps} />

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

        <OcupacaoHumanaPopups activeLayer={activeLayer} popupPosition={popupPosition} selectedFeature={selectedFeature} />
        <TerritorioPopups activeLayer={activeLayer} popupPosition={popupPosition} selectedFeature={selectedFeature} />
        <MonitoramentoPopups activeLayer={activeLayer} popupPosition={popupPosition} selectedFeature={selectedFeature} />
        <FiscalizacaoPopups activeLayer={activeLayer} popupPosition={popupPosition} selectedFeature={selectedFeature} />
        <ProtecaoAmbientalPopups activeLayer={activeLayer} popupPosition={popupPosition} selectedFeature={selectedFeature} />
      </MapContainer>
    </main>
  )
}

export default MapView