import { useState } from "react"
import Header from "./Components/Header/Header"
import MapView from "./Components/MapView/MapView"
import Sidebar from "./Components/Sidebar/Sidebar"

function App() {
  const initialFilters = {
    cod_imovel: '',
    municipio: '',
    uf: '',
    area: '',
    // campos de PRODES
    state: '',
    image_date: '',
    year: '',
    uuid: '',
    // campos tis
    terrai_cod: '',
    terrai_nom: '',
    etnia_nome: '',
    municipio_: '',
    uf_sigla: '',
    fase_ti: '',
  }
  const [activeLayer, setActiveLayer] = useState('cars')
  const [filtersDraft, setFiltersDraft] = useState(initialFilters)
  const [filtersApplied, setFiltersApplied] = useState(initialFilters)

  function updateField(field, value) {
    setFiltersDraft(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleApplyFilters(){
    setFiltersApplied(filtersDraft)
  }
  return (
    <>
      <div className="container">
        <Header />
        <Sidebar 
          filtersDraft={filtersDraft}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          updateField={updateField}
          onApplyFilters={handleApplyFilters}
        />
        <MapView 
          activeLayer={activeLayer}
          filtersApplied={filtersApplied}
        />
      </div>
    </>
  )
}

export default App
