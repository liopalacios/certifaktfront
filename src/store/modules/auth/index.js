import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import Util from '../../../util'

const state = {
  token: Util.getToken(),
  user: Util.getUser(),
  idPuntoVenta: localStorage.getItem("idPuntoVenta"),
  company: JSON.parse(localStorage.getItem('company'))

};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
