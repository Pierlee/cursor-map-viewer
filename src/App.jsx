import { useState } from "react"
import Header from "./Components/Header/Header"
import MapView from "./Components/MapView/MapView"
import Sidebar from "./Components/Sidebar/Sidebar"

function App() {
  const initialFilters = {
    // =========================
    // TERRITÓRIO
    // =========================
  
    // Municípios
    cd_mun: '',
    nm_mun: '',
    sigla_uf: '',
    nm_uf: '',
  
    // Biomas
    cd_bioma: '',
    bioma: '',
  
    // =========================
    // OCUPAÇÃO HUMANA
    // =========================
  
    // CAR
    cod_imovel: '',
    municipio: '',
    uf: '',
    area: '',
  
    // Terras Indígenas
    terrai_cod: '',
    terrai_nom: '',
    etnia_nome: '',
    municipio_: '',
    uf_sigla: '',
    fase_ti: '',
  
    // =========================
    // MONITORAMENTO
    // =========================
  
    // PRODES
    state: '',
    image_date: '',
    year: '',
    uuid: '',
    source: '',
    main_class: '',
    source: '',
    main_class: '',
  
    // MapBiomas
    codealerta: '',
    fonte: '',
    estado: '',
    anodetec: '',
    vpressao: '',
  
    // =========================
    // FISCALIZAÇÃO
    // =========================
  
    // Embargos IBAMA
    numero_tad: '',
    sig_uf: '',
    nom_munici: '',
    status_tad: '',
    tipo_termo: '',
  
    // =========================
    // PROTEÇÃO AMBIENTAL
    // =========================
  
    // UCs Federais
    cnuc: '',
    nomeuc: '',
    siglacateg: '',
    grupouc: '',
    ufabrang: '',
    biomaibge: '',
    criacaoano: '',
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
