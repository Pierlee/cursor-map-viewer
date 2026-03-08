import './Sidebar.css'

function Sidebar({ filtersDraft, activeLayer, setActiveLayer, updateField, onApplyFilters}) {
  return(
    <aside>
      <h2>Camadas</h2>
      <select 
        value={activeLayer}
        onChange={(e) => setActiveLayer(e.target.value)}
      >
        <option value="prodes">PRODES</option>
        <option value="cars">CARS</option>
        <option value="tis">TIS</option>
      </select>
      <h3>Filtros</h3>
      {activeLayer === "cars" && (
        <>
          <label htmlFor="cod_imovel">Codigo do Imovel</label>
          <input
            id="cod_imovel"
            type="text"
            value={filtersDraft.cod_imovel}
            onChange={e => updateField("cod_imovel", e.target.value)}
          />

          <label htmlFor="municipio">Município</label>
          <input
            id="municipio"
            type="text"
            value={filtersDraft.municipio}
            onChange={e => updateField("municipio", e.target.value)}
          />

          <label htmlFor="uf">UF</label>
          <input
            id="uf"
            type="text"
            value={filtersDraft.uf}
            onChange={e => updateField("uf", e.target.value)}
          />

          <label htmlFor="area">Area</label>
          <input
            id="area"
            type="number"
            value={filtersDraft.area}
            onChange={e => updateField("area", e.target.value)}
          />
        </>
      )}

      {activeLayer === "prodes" && (
        <>
          <label htmlFor="state">state</label>
          <input
            id="state"
            type="text"
            value={filtersDraft.state}
            onChange={e => updateField("state", e.target.value)}
          />

          <label htmlFor="image_date">image_date</label>
          <input
            id="image_date"
            type="text"
            value={filtersDraft.image_date}
            onChange={e => updateField("image_date", e.target.value)}
          />

          <label htmlFor="year">year</label>
          <input
            id="year"
            type="number"
            value={filtersDraft.year}
            onChange={e => updateField("year", e.target.value)}
          />

          <label htmlFor="uuid">uuid</label>
          <input
            id="uuid"
            type="text"
            value={filtersDraft.uuid}
            onChange={e => updateField("uuid", e.target.value)}
          />
        </>
      )}
      {activeLayer === "tis" && (
        <>
          <label htmlFor="terrai_cod">terrai_cod</label>
          <input
            id="terrai_cod"
            type="number"
            value={filtersDraft.terrai_cod}
            onChange={e => updateField("terrai_cod", e.target.value)}
          />

          <label htmlFor="terrai_nom">terrai_nom</label>
          <input
            id="terrai_nom"
            type="text"
            value={filtersDraft.terrai_nom}
            onChange={e => updateField("terrai_nom", e.target.value)}
          />

          <label htmlFor="etnia_nome">etnia_nome</label>
          <input
            id="etnia_nome"
            type="text"
            value={filtersDraft.etnia_nome}
            onChange={e => updateField("etnia_nome", e.target.value)}
          />

          <label htmlFor="municipio_">municipio_</label>
          <input
            id="municipio_"
            type="text"
            value={filtersDraft.municipio_}
            onChange={e => updateField("municipio_", e.target.value)}
          />

          <label htmlFor="uf_sigla">uf_sigla</label>
          <input
            id="uf_sigla"
            type="text"
            value={filtersDraft.uf_sigla}
            onChange={e => updateField("uf_sigla", e.target.value)}
          />

          <label htmlFor="fase_ti">fase_ti</label>
          <input
            id="fase_ti"
            type="text"
            value={filtersDraft.fase_ti}
            onChange={e => updateField("fase_ti", e.target.value)}
          />
        </>
      )}
      <button onClick={onApplyFilters}>Buscar</button>
    </aside>
  )
}

export default Sidebar