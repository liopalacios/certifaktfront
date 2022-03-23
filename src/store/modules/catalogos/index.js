import actions from './actions';
import getters from './getters';
import mutations from './mutations';

let cuentas = [];
if (localStorage.getItem("cuentas")) {
  cuentas = JSON.parse(localStorage.getItem("cuentas"))
}

const state = {
  cuentas: cuentas,
  catalogo06: JSON.parse(localStorage.getItem("catalogo06")),
  catalogo07: JSON.parse(localStorage.getItem("catalogo07")),
  catalogo09: JSON.parse(localStorage.getItem("catalogo09")),
  catalogo10: JSON.parse(localStorage.getItem("catalogo10")),
  catalogo17: JSON.parse(localStorage.getItem("catalogo17")),
  catalogo18: JSON.parse(localStorage.getItem("catalogo18")),
  catalogo20: JSON.parse(localStorage.getItem("catalogo20")),
  catalogo59: JSON.parse(localStorage.getItem("catalogo59")),
  catalogo54: JSON.parse(localStorage.getItem("catalogo54")),
  ubigeo: JSON.parse(localStorage.getItem("ubigeo")),
  ubigeoTotal: JSON.parse(localStorage.getItem("ubigeoTotal")),
  parametros: JSON.parse(localStorage.getItem("parametros")),
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
