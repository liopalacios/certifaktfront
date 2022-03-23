<template>
  <section class="documentation">
      <!--
      <div v-if="!isProduction()" class="hero is-warning">
        <div class="hero-body hero-lite is-paddingless">

          <div class="container is-fullhd">
            <h2 class="title is-4 is-paddingless is-marginless has-text-centered">ESTA ES UNA VERSIÓN DE PRUEBA</h2>
          </div>
        </div>
      </div>-->
    <TheHeader ref="header"/>
      <div class="hero is-primary">
        <div class="hero-body hero-lite ">
          <div class="container is-fullhd">
            <div class="columns">
              <div class="column is-3 center-vertical" style="padding:2px">
                <router-link style="margin: 0 auto;"
                  to="/"
                  class="navbar-item"
                  active-class="">                    
                  <img                        
                      src="https://certifakt.s3-us-west-2.amazonaws.com/logo_certifakt_text.png"
                      alt="CERTIFAKT">
                </router-link>
              </div>
              <div class="column is-5" style="text-align:center; padding:2px">
                <p class="title is-5" style="margin-bottom:2px">{{ getUser.ruc }}</p>
                <p class="title is-5">{{ getUser.razonSocial }}</p>
                <p class="subtitle is-hidden-touch">{{ subtitle }}</p>
              </div>                            
              <div class="column is-4 is-right center-vertical" style="padding:2px">
                <b-field  position="is-right" type="is-white">
                  <b-select v-model="oficinaSelected" :disabled="disabledOfi()" expanded placeholder="Seleccione punto de venta" rounded>
                    <option
                      v-for="(option, i) in oficinasOptions"
                      :value="option.value"
                      :key="i">
                      {{ option.text }}
                    </option>
                  </b-select>
                </b-field>
                <div class="columns">
                  <b-dropdown v-if="userIsAdmin" class="navbar-item column" >
                    <button class="button is-outlined is-default" slot="trigger">
                      <span>Configuración</span>
                      <b-icon icon="menu-down"></b-icon>
                    </button>
                    <b-dropdown-item @click="goRoute('/admin/datos-principales')">Datos principales</b-dropdown-item>
                    <b-dropdown-item @click="goRoute('/admin/puntos-venta')">Puntos de venta</b-dropdown-item>
                    <b-dropdown-item @click="goRoute('/admin/unidad-medida')">Unidades de medida</b-dropdown-item>
                    <b-dropdown-item @click="goRoute('/admin/cuentas-bancarias')">Cuentas bancarias</b-dropdown-item>
                    <b-dropdown-item @click="goRoute('/admin/mis-emails')">Mis Emails</b-dropdown-item>
                  </b-dropdown>
                            <!--<hr class="navbar-divider" style="display: block;">-->
                  <b-dropdown v-if="getUser" class="navbar-item column">
                    <button class="button is-outlined is-default" slot="trigger">
                      <span>{{getUser.fullName}}</span>
                      <b-icon icon="menu-down"></b-icon>
                    </button>
                    <b-dropdown-item @click="goRoute('/principal/cuenta')">Mi cuenta</b-dropdown-item>
                    <b-dropdown-item @click="goRoute('/admin/cambio-clave')">Cambiar Contraseña</b-dropdown-item>
                    <b-dropdown-item @click="cerrarSesion">Cerrar sesión</b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main class="main">
          <router-view/>
      </main>
    <TheFooter/>
  </section>
</template>

<script>
    import TheHeader from './TheHeader'
    import TheFooter from './TheFooter'
    import {mapGetters, mapMutations} from 'vuex'
    import Methods from '../api/methods'
    export default {
        components: {
            TheHeader,
            TheFooter
        },
        data(){

          return{
            idImagen: 100,
            oficinas:[],
            subtitle: 'Facturación electrónica',
          }
        },
      computed:{
        ...mapGetters({'getUser':'auth/getUser'}),
        ...mapGetters({'getUser':'auth/getUser'}),
        ...mapGetters({'getIdPuntoVenta':'auth/getIdPuntoVenta'}),
        ...mapGetters({'getPuntoVenta':'punto/getPuntoVenta'}),
        ...mapGetters({'getCompany':'auth/getCompany'}),
        oficinasOptions(){
          const listaOptions = []
          listaOptions.push({value:null,text:"Seleccione punto de venta"})
          this.oficinas.forEach(ofi=>{
            listaOptions.push({value:ofi,text:ofi.nombreCorto})
          })
          return listaOptions
        },
        oficinaSelected: {
          set(value){
            this.setPuntoVenta(value)
          },
          get(){
            return this.getPuntoVenta
          }
        },
        userIsAdmin(){
          return this.getUser.typeUser == '01'
        }
      },
      methods:{
        ...mapMutations({'setPuntoVenta':'punto/setPuntoVenta'}),
        cargarOficinas(){
          return new Promise((resolve, reject) => {
            const url = `api/oficinas`
            Methods.doGet(this,url).then(data=>{
              this.oficinas=data
              resolve()
            }).catch(error=>reject(error))
          })
        },
        isProduction(){
          return this.$isProduction
        },
        disabledOfi(){
          if(this.getIdPuntoVenta){
            return true;
          }else{
            return false;
          }
        },
        goRoute(ruta){
          this.$router.push(ruta)
        },
        cerrarSesion(){
          location.reload()
          localStorage.clear()
          this.$router.push("/login")
        }
      },
      mounted(){
        //this.getImageLogo()
      },
      beforeMount(){
        this.cargarOficinas().then(()=>{
          if(this.getIdPuntoVenta){
            const ofs = this.oficinas.find(ofi=>ofi.id==this.getIdPuntoVenta)
            this.oficinaSelected = ofs
            localStorage.setItem("ofs",JSON.stringify(ofs))
          }
        })
      }
      
    }
</script>

<style>
  .center-vertical{
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .hero-lite{
    padding: 0.9rem 0.5rem;
  }

  .documentation {
    padding: 0px;
  }

</style>
