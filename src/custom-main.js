
import Vuelidate from 'vuelidate'

//Moment
import VueMoment from 'vue-moment'


//AXIOS
import axios from 'axios'
import VueAxios from 'vue-axios'
const endpoint=__API__
const AxiosInstance = axios.create({
  baseURL: endpoint,
  timeout: 180000,
})



/**
 * This is the main Light Bootstrap Dashboard Vue plugin where dashboard related plugins are registerd.
 */
export default {
  install (Vue) {
    Vue.use(Vuelidate)
    Vue.use(VueAxios, AxiosInstance)
    Vue.use(VueMoment)
  }
}
