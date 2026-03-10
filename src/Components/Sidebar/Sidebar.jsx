import './Sidebar.css'

function Sidebar({ filtersDraft, activeLayer, setActiveLayer, updateField, onApplyFilters }) {
  return (
    <aside>
      <h2>Camadas</h2>

      <select
        value={activeLayer}
        onChange={(e) => setActiveLayer(e.target.value)}
      >
        {/* Território */}
        <option value="br_municipios_2024">Municípios</option>
        <option value="lm_bioma_250">Biomas</option>

        {/* Ocupação Humana */}
        <option value="cars">CARs</option>
        <option value="tis">Terras Indígenas</option>

        {/* Monitoramento */}
        <option value="prodes">PRODES</option>
        <option value="mapbiomas">MapBiomas</option>

        {/* Fiscalização */}
        <option value="embargos_ibama">Embargos IBAMA</option>

        {/* Proteção Ambiental */}
        <option value="limites_ucs_federais_21072025">UCs Federais</option>
      </select>

      <h3>Filtros</h3>

      {/* =========================
          TERRITÓRIO
      ========================= */}

      {activeLayer === "br_municipios_2024" && (
        <>
          <label htmlFor="cd_mun">Código do Município</label>
          <input
            id="cd_mun"
            type="text"
            value={filtersDraft.cd_mun}
            onChange={e => updateField("cd_mun", e.target.value)}
          />

          <label htmlFor="nm_mun">Nome do Município</label>
          <input
            id="nm_mun"
            type="text"
            value={filtersDraft.nm_mun}
            onChange={e => updateField("nm_mun", e.target.value)}
          />

          <label htmlFor="sigla_uf">UF</label>
          <input
            id="sigla_uf"
            type="text"
            value={filtersDraft.sigla_uf}
            onChange={e => updateField("sigla_uf", e.target.value)}
          />

          <label htmlFor="nm_uf">Nome do Estado</label>
          <input
            id="nm_uf"
            type="text"
            value={filtersDraft.nm_uf}
            onChange={e => updateField("nm_uf", e.target.value)}
          />
        </>
      )}

      {activeLayer === "lm_bioma_250" && (
        <>
          <label htmlFor="cd_bioma">Código do Bioma</label>
          <input
            id="cd_bioma"
            type="number"
            value={filtersDraft.cd_bioma}
            onChange={e => updateField("cd_bioma", e.target.value)}
          />

          <label htmlFor="bioma">Nome do Bioma</label>
          <input
            id="bioma"
            type="text"
            value={filtersDraft.bioma}
            onChange={e => updateField("bioma", e.target.value)}
          />
        </>
      )}

      {/* =========================
          OCUPAÇÃO HUMANA
      ========================= */}

      {activeLayer === "cars" && (
        <>
          <label htmlFor="cod_imovel">Código do Imóvel</label>
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

          <label htmlFor="area">Área Mínima</label>
          <input
            id="area"
            type="number"
            value={filtersDraft.area}
            onChange={e => updateField("area", e.target.value)}
          />
        </>
      )}

      {activeLayer === "tis" && (
        <>
          <label htmlFor="terrai_cod">Código da Terra Indígena</label>
          <input
            id="terrai_cod"
            type="number"
            value={filtersDraft.terrai_cod}
            onChange={e => updateField("terrai_cod", e.target.value)}
          />

          <label htmlFor="terrai_nom">Nome da Terra Indígena</label>
          <input
            id="terrai_nom"
            type="text"
            value={filtersDraft.terrai_nom}
            onChange={e => updateField("terrai_nom", e.target.value)}
          />

          <label htmlFor="etnia_nome">Etnia</label>
          <input
            id="etnia_nome"
            type="text"
            value={filtersDraft.etnia_nome}
            onChange={e => updateField("etnia_nome", e.target.value)}
          />

          <label htmlFor="municipio_">Município</label>
          <input
            id="municipio_"
            type="text"
            value={filtersDraft.municipio_}
            onChange={e => updateField("municipio_", e.target.value)}
          />

          <label htmlFor="uf_sigla">UF</label>
          <input
            id="uf_sigla"
            type="text"
            value={filtersDraft.uf_sigla}
            onChange={e => updateField("uf_sigla", e.target.value)}
          />

          <label htmlFor="fase_ti">Fase</label>
          <input
            id="fase_ti"
            type="text"
            value={filtersDraft.fase_ti}
            onChange={e => updateField("fase_ti", e.target.value)}
          />
        </>
      )}

      {/* =========================
          MONITORAMENTO
      ========================= */}

      {activeLayer === "prodes" && (
        <>
          <label htmlFor="state">Estado</label>
          <input
            id="state"
            type="text"
            value={filtersDraft.state}
            onChange={e => updateField("state", e.target.value)}
          />

          <label htmlFor="image_date">Data da Imagem</label>
          <input
            id="image_date"
            type="text"
            value={filtersDraft.image_date}
            onChange={e => updateField("image_date", e.target.value)}
          />

          <label htmlFor="year">Ano</label>
          <input
            id="year"
            type="number"
            value={filtersDraft.year}
            onChange={e => updateField("year", e.target.value)}
          />

          <label htmlFor="uuid">UUID</label>
          <input
            id="uuid"
            type="text"
            value={filtersDraft.uuid}
            onChange={e => updateField("uuid", e.target.value)}
          />

          <label htmlFor="source">Fonte</label>
          <input
            id="source"
            type="text"
            value={filtersDraft.source}
            onChange={e => updateField("source", e.target.value)}
          />

          <label htmlFor="main_class">Classe Principal</label>
          <input
            id="main_class"
            type="text"
            value={filtersDraft.main_class}
            onChange={e => updateField("main_class", e.target.value)}
          />
        </>
      )}

      {activeLayer === "mapbiomas" && (
        <>
          <label htmlFor="codealerta">Código do Alerta</label>
          <input
            id="codealerta"
            type="number"
            value={filtersDraft.codealerta}
            onChange={e => updateField("codealerta", e.target.value)}
          />

          <label htmlFor="fonte">Fonte</label>
          <input
            id="fonte"
            type="text"
            value={filtersDraft.fonte}
            onChange={e => updateField("fonte", e.target.value)}
          />

          <label htmlFor="bioma">Bioma</label>
          <input
            id="bioma"
            type="text"
            value={filtersDraft.bioma}
            onChange={e => updateField("bioma", e.target.value)}
          />

          <label htmlFor="estado">Estado</label>
          <input
            id="estado"
            type="text"
            value={filtersDraft.estado}
            onChange={e => updateField("estado", e.target.value)}
          />

          <label htmlFor="municipio">Município</label>
          <input
            id="municipio"
            type="text"
            value={filtersDraft.municipio}
            onChange={e => updateField("municipio", e.target.value)}
          />

          <label htmlFor="anodetec">Ano da Detecção</label>
          <input
            id="anodetec"
            type="number"
            value={filtersDraft.anodetec}
            onChange={e => updateField("anodetec", e.target.value)}
          />

          <label htmlFor="vpressao">Vetor de Pressão</label>
          <input
            id="vpressao"
            type="text"
            value={filtersDraft.vpressao}
            onChange={e => updateField("vpressao", e.target.value)}
          />
        </>
      )}

      {/* =========================
          FISCALIZAÇÃO
      ========================= */}

      {activeLayer === "embargos_ibama" && (
        <>
          <label htmlFor="numero_tad">Número do TAD</label>
          <input
            id="numero_tad"
            type="text"
            value={filtersDraft.numero_tad}
            onChange={e => updateField("numero_tad", e.target.value)}
          />

          <label htmlFor="sig_uf">UF</label>
          <input
            id="sig_uf"
            type="text"
            value={filtersDraft.sig_uf}
            onChange={e => updateField("sig_uf", e.target.value)}
          />

          <label htmlFor="nom_munici">Município</label>
          <input
            id="nom_munici"
            type="text"
            value={filtersDraft.nom_munici}
            onChange={e => updateField("nom_munici", e.target.value)}
          />

          <label htmlFor="status_tad">Status</label>
          <input
            id="status_tad"
            type="text"
            value={filtersDraft.status_tad}
            onChange={e => updateField("status_tad", e.target.value)}
          />

          <label htmlFor="tipo_termo">Tipo de Termo</label>
          <input
            id="tipo_termo"
            type="text"
            value={filtersDraft.tipo_termo}
            onChange={e => updateField("tipo_termo", e.target.value)}
          />
        </>
      )}

      {/* =========================
          PROTEÇÃO AMBIENTAL
      ========================= */}

      {activeLayer === "limites_ucs_federais_21072025" && (
        <>
          <label htmlFor="cnuc">Código CNUC</label>
          <input
            id="cnuc"
            type="text"
            value={filtersDraft.cnuc}
            onChange={e => updateField("cnuc", e.target.value)}
          />

          <label htmlFor="nomeuc">Nome da Unidade</label>
          <input
            id="nomeuc"
            type="text"
            value={filtersDraft.nomeuc}
            onChange={e => updateField("nomeuc", e.target.value)}
          />

          <label htmlFor="siglacateg">Categoria</label>
          <input
            id="siglacateg"
            type="text"
            value={filtersDraft.siglacateg}
            onChange={e => updateField("siglacateg", e.target.value)}
          />

          <label htmlFor="grupouc">Grupo</label>
          <input
            id="grupouc"
            type="text"
            value={filtersDraft.grupouc}
            onChange={e => updateField("grupouc", e.target.value)}
          />

          <label htmlFor="ufabrang">UF de Abrangência</label>
          <input
            id="ufabrang"
            type="text"
            value={filtersDraft.ufabrang}
            onChange={e => updateField("ufabrang", e.target.value)}
          />

          <label htmlFor="biomaibge">Bioma</label>
          <input
            id="biomaibge"
            type="text"
            value={filtersDraft.biomaibge}
            onChange={e => updateField("biomaibge", e.target.value)}
          />

          <label htmlFor="criacaoano">Ano de Criação</label>
          <input
            id="criacaoano"
            type="text"
            value={filtersDraft.criacaoano}
            onChange={e => updateField("criacaoano", e.target.value)}
          />
        </>
      )}

      <button onClick={onApplyFilters}>Buscar</button>
    </aside>
  )
}

export default Sidebar