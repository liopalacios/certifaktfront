<template>


  <div class="login-page">

    <div class="login-form">
      <div v-if="!isProduction()" class="hero is-warning">
        <div class="hero-body hero-lite is-paddingless">

          <div class="container is-fullhd">
            <h2 class="title is-4 is-paddingless is-marginless has-text-centered">ESTA ES UNA VERSIÓN DE PRUEBA</h2>
          </div>
        </div>
      </div>

      <h1 class="is-size-3 has-text-centered"><img class="logo-filekom" src="https://certifakt.s3-us-west-2.amazonaws.com/logo_certifakt_text.png"
                                                   alt=""></h1>


      <form @submit.prevent="onLogin">
        <section>
          <b-field label="Usuario">
            <b-input v-model="credentials.username" placeholder="Ingrese su nombre de usuario"
                     type="text"></b-input>
          </b-field>

          <b-field label="Clave">
            <b-input v-model="credentials.password" placeholder="Ingrese su clave secreta" type="password"></b-input>
          </b-field>

          <div class="control btnlogin">
            <button type="submit" class="button is-large is-info is-rounded is-fullwidth">Iniciar sesión</button>
          </div>


        </section>
      </form>
    </div>
  </div>

</template>


<script>

  import Methods from '../api/methods'
  import {mapMutations} from 'vuex'
  import Util from '../util'

  export default {
    data() {
      return {
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },

    methods: {
      ...mapMutations({
        'setToken': 'auth/setToken', 'setUser': 'auth/setUser', 'setIdPuntoVenta': 'auth/setIdPuntoVenta',
        'setCompany': 'auth/setCompany'
      }),
      ...mapMutations({'setCatalogo54': 'catalogos/setCatalogo54'}),
      ...mapMutations({'setCatalogo59': 'catalogos/setCatalogo59'}),
      ...mapMutations({'setCatalogo06': 'catalogos/setCatalogo06'}),
      ...mapMutations({'setCatalogo07': 'catalogos/setCatalogo07'}),
      ...mapMutations({'setCatalogo09': 'catalogos/setCatalogo09'}),
      ...mapMutations({'setCatalogo10': 'catalogos/setCatalogo10'}),
      ...mapMutations({'setCatalogo17': 'catalogos/setCatalogo17'}),
      ...mapMutations({'setCatalogo18': 'catalogos/setCatalogo18'}),
      ...mapMutations({'setCatalogo20': 'catalogos/setCatalogo20'}),
      ...mapMutations({'setUbigeo': 'catalogos/setUbigeo'}),
      ...mapMutations({'setUbigeoTotal': 'catalogos/setUbigeoTotal'}),
      ...mapMutations({'setCuentas': 'catalogos/setCuentas'}),
      ...mapMutations({'setParametros': 'catalogos/setParametros'}),
      onLogin() {
        this.login({credentials: this.credentials}).then(data => {
          console.log(data)
          localStorage.setItem("token", data.accessToken)
          localStorage.setItem("expires", data.expires)
          localStorage.setItem("user", JSON.stringify(data.user))
          this.setToken(data.accessToken)
          this.setUser(JSON.stringify(data.user))

          this.cargarDataInicial()

        })
      },

      login(payload) {
        const url = 'api/auth/login'
        var data = {'username': payload.credentials.username, 'password': payload.credentials.password}
        return Methods.doPost(this, url, data)
      },
      cargarDataInicial() {
        const url = `api/dataInicial`
        Methods.doGet(this, url).then(data => {
          console.log(data)
          
          this.setCatalogo54(data.catalogos.filter((catalogo) => catalogo.numero == "54"))
          localStorage.setItem("catalogo54", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "54")))

          this.setCatalogo59(data.catalogos.filter((catalogo) => catalogo.numero == "59"))
          localStorage.setItem("catalogo59", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "59")))

          this.setCatalogo06(data.catalogos.filter((catalogo) => catalogo.numero == "06"))
          localStorage.setItem("catalogo06", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "06")))

          this.setCatalogo07(data.catalogos.filter((catalogo) => catalogo.numero == "07"))
          localStorage.setItem("catalogo07", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "07")))

          this.setCatalogo09(data.catalogos.filter((catalogo) => catalogo.numero == "09"))
          localStorage.setItem("catalogo09", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "09")))

          this.setCatalogo10(data.catalogos.filter((catalogo) => catalogo.numero == "10"))
          localStorage.setItem("catalogo10", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "10")))

          this.setCatalogo17(data.catalogos.filter((catalogo) => catalogo.numero == "17"))
          localStorage.setItem("catalogo17", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "17")))

          this.setCatalogo18(data.catalogos.filter((catalogo) => catalogo.numero == "18") ? data.catalogos.filter((catalogo) => catalogo.numero == "18") : [])
          localStorage.setItem("catalogo18", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "18") ? data.catalogos.filter((catalogo) => catalogo.numero == "18") : []))

          this.setCatalogo20(data.catalogos.filter((catalogo) => catalogo.numero == "20") ? data.catalogos.filter((catalogo) => catalogo.numero == "20") : [])
          localStorage.setItem("catalogo20", JSON.stringify(data.catalogos.filter((catalogo) => catalogo.numero == "20") ? data.catalogos.filter((catalogo) => catalogo.numero == "20") : []))

          this.setUbigeo(data.ubigeo ? data.ubigeo : [])
          localStorage.setItem("ubigeo", JSON.stringify(data.ubigeo ? data.ubigeo : []))

          this.setUbigeoTotal(data.ubigeoTotal ? data.ubigeoTotal : [])
          localStorage.setItem("ubigeoTotal", JSON.stringify(data.ubigeoTotal ? data.ubigeoTotal : []))

          this.setParametros(data.parametros)
          localStorage.setItem("parametros", JSON.stringify(data.parametros))

          localStorage.setItem("misunidades", JSON.stringify(data.misunidades))

          this.setCompany(data.company)
          localStorage.setItem("company", JSON.stringify(data.company))

          this.setCuentas(data.cuentas)
          localStorage.setItem("cuentas", JSON.stringify(data.cuentas))

          if (data.idPuntoVenta) {
            this.setIdPuntoVenta(data.idPuntoVenta)
            localStorage.setItem("idPuntoVenta", data.idPuntoVenta)
          }

          //REDIRIGIR
          //this.$router.push("/")
          window.location.href = '/'
          const message = `Bienvenid@ ${Util.getUser().fullName}`
          Util.showNotification(this, message, 'info')

        })
      },

      cargarUsuarioDemo() {

        const user = this.$route.params.user
        const pass = this.$route.params.pass

        if (user && pass) {
          this.credentials.username = user
          this.credentials.password = pass
        }

      },

      isProduction() {
        return this.$isProduction
      }

    },

    watch: {
      '$route': 'cargarUsuarioDemo'
    },
    created() {
      if (Util.getToken()) {
        window.location.href = ''
      }
    },
    beforeMount() {

      this.cargarUsuarioDemo()

    }, mounted() {
      if (!this.$isProduction) {
        this.credentials.username = 'demo@certifakt.com.pe'
        this.credentials.password = 'demo'
      }
    }
  }

</script>

<style lang="scss">
  @import "../assets/scss/main.scss";
 
  .login-page {
    display: flex;
    flex-direction: row;
    height: 100%;
    background-color: #eee;
  }

  .login-form {
    width: 480px;
    margin: auto;
  }

  form {
    width: 100%;
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    input, button {
      width: 100%;
      margin: 5px 0;
    }
  }

  .logo-filekom {
    width: 80%;
  }

  .btnlogin {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;

  }
</style>
