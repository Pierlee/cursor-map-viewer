import L from 'leaflet'
import { createLayerComponent } from '@react-leaflet/core'

const createWmsLayer = (props, context) => {
  const { url, ...wmsOptions } = props
  const layer = L.tileLayer.wms(url, wmsOptions)
  return { instance: layer, context }
}
const updateWmsLayer = (layer, props) => {
  const { url: _ignore, ...next} = props
  layer.setParams(next)
  console.log(" novos parametros - ", next)
}

const WmsTileLayer = createLayerComponent(createWmsLayer, updateWmsLayer)

export default WmsTileLayer  