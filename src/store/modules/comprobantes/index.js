import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const date = new Date();
const from = new Date(date.getFullYear(), date.getMonth(), 1);
const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);

const state = {
  filtroDesde :from,
  filtroHasta: to,
  filtroTipoDocumento: null,
  filtroRuc: null,
  filtroSerie: null,
  filtroNumero: null,
  comprobantesEntity: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
