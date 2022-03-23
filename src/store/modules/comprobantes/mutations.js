const setFiltroDesde = (state, filtroDesde) => {
  state.filtroDesde = filtroDesde;
}

const setFiltroHasta = (state, filtroHasta) => {
  state.filtroHasta = filtroHasta;
}

const setFiltroTipoDocumento = (state, filtroTipoDocumento) => {
  state.filtroTipoDocumento = filtroTipoDocumento;
}

const setFiltroRuc = (state, filtroRuc) => {
  state.filtroRuc = filtroRuc;
}

const setFiltroSerie = (state, filtroSerie) => {
  state.filtroSerie = filtroSerie;
}

const setFiltroNumero = (state, filtroNumero) => {
  state.filtroNumero = filtroNumero;
}


export default {
  setFiltroDesde,
  setFiltroHasta,
  setFiltroTipoDocumento,
  setFiltroRuc,
  setFiltroSerie,
  setFiltroNumero
};
