import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Filters from './filters'
import HighchartsVue from 'highcharts-vue'
import router from './router'
import store from './store'
import CustomMain from './custom-main'
Vue.use(HighchartsVue)
Vue.use(CustomMain)

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$filters = Vue.options.filters
Vue.prototype.$isProduction = __ENTORNO__=='production'?true:false

Vue.use(Buefy, {
  defaultDayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  defaultMonthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
})

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  template: '<App/>',
})




