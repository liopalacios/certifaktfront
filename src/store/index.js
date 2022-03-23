import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import catalogos from './modules/catalogos'
import comprobantes from './modules/comprobantes'
import punto from './modules/punto'


Vue.use(Vuex)

const store = new Vuex.Store({

  modules: {
   auth,
    catalogos,
    comprobantes,
    punto
  }


})
export default store
