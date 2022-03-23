<template>
  <div id="app">    
    <router-view/>
    <b-loading :active.sync="isLoading" :is-full-page="false"></b-loading>
  </div>
</template>

<script>
import util from './util'

export default {
  name: 'app',
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    showSpinner() {
      this.isLoading=true
    },
    hideSpinner() {
      this.isLoading=false

    }
  },

  created: function () {

   /* if (!this.$http.defaults.headers.common['Authorization']) {
      this.$http.defaults.headers.common['Authorization'] = `Bearer ${util.getTokenIfExist()}`
    }*/

    this.$http.interceptors.request.use(
      conf => {
        this.showSpinner()
        return conf;
      },
      error => {
        this.hideSpinner()
        return Promise.reject(error);
      }
    );
    this.$http.interceptors.response.use(
      response => {
        this.hideSpinner()
        return response;
      },
      error => {
        console.log("Error response",error);
        this.hideSpinner()

        if (!error.response) {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Error al conectarse al servidor.`,
            position: 'is-top',
            type: 'is-danger'
          })
        }
        else{

         if(error.response.data.error=='invalid_grant'){
           this.$buefy.toast.open({
             duration: 5000,
             message: `Usuario o clave incorrectos.`,
             position: 'is-top',
             type: 'is-danger'
           })
         }

          if(error.response.data.error=='unauthorized'){
            this.$buefy.toast.open({
              duration: 5000,
              message: `Su cuenta esta desactivada.`,
              position: 'is-top',
              type: 'is-danger'
            })
            setTimeout(function(){
              localStorage.clear()
              location.reload();
              }, 2000);
          }

          if(error.response.data.error=='invalid_token'){
            this.$buefy.dialog.alert({
              title: 'Error',
              message: 'Su sesión ha expirado, vuelva a iniciar sesión.',
              type: 'is-danger',
              hasIcon: true,
              onConfirm: () => {
                localStorage.clear()
                this.$router.push({name:'login'})
                location.reload();
              }
            })
          }

        }

        return Promise.reject(error);
      }
    );


  },
}
</script>

<style lang="scss">
  @import "./assets/scss/main.scss";
  $loading-background: #7D7D7D;
  body, html, #app {
    height: 100%;
  }
  
</style>
