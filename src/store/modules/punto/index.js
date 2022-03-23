import actions from './actions';
import getters from './getters';
import mutations from './mutations';


let pv = null

if (localStorage.getItem("ofs") !== undefined && localStorage.getItem("ofs") !== 'undefined') {
  pv = JSON.parse(localStorage.getItem("ofs"));
}


const state = {
  puntoVenta: pv
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
