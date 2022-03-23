<template>
    <!--<header class="navbar header has-shadow" :class="{ 'is-primary is-transparent': light }">-->
        <!--<div class="container is-fullhd">
            <div class="navbar-brand">-->
              <!--
                <router-link style="margin: 0px; padding: 0rem"
                    to="/"
                    class="navbar-item"
                    active-class="">                    
                    <img                        
                        src="https://certifakt.s3-us-west-2.amazonaws.com/logo_certifakt_text.png"
                        alt="Buefy">
                </router-link>
                <a
                    class="navbar-item"
                    href="https://www.facebook.com/certifakt/"
                    target="_blank"
                    title="Facebook">
                    <b-icon icon="facebook"/>
                </a>

                <a
                    class="navbar-item"
                    href=""
                    target="_blank"
                    title="Twitter">
                    <b-icon icon="twitter"/>
                </a>-->

                <!--
                <span
                    class="navbar-burger burger"
                    :class="{ 'is-active': isMenuActive }"
                    @click="isMenuActive = !isMenuActive">
                    <span/>
                    <span/>
                    <span/>
                </span>-->
           <!-- </div>

            <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
                <div class="navbar-end">-->

                 <!--   <router-link
                        to="/"
                        exact
                        class="navbar-item">
                        Home
                    </router-link>

                    <hr class="navbar-divider" style="display: block;">

                  <router-link
                    to="/"
                    exact
                    class="navbar-item">
                    Eventos
                  </router-link>-->

                  <!--<hr class="navbar-divider" style="display: block;">-->

                    <!-- Mobile menu -->
                    <!--
                    <div class="navbar-item has-dropdown is-hoverable is-hidden-desktop">
                        <div class="navbar-item">Menú</div>

                        <div class="navbar-dropdown is-boxed">
                            <template v-for="items in menu">
                                <div
                                    :key="items.category"
                                    class="navbar-item is-subitem">
                                    {{ items.category }}
                                </div>

                                <template v-for="page in items.pages">
                                    <router-link
                                        v-if="page.name"
                                        :key="page.name"
                                        :to="page.path"
                                        class="navbar-item">
                                        <span class="navbar-item-text">{{ page.name }}</span>
                                        <b-tag v-if="page.isNew" type="is-success">New!</b-tag>
                                        <b-tag v-if="page.isUpdated" type="is-info">Updated</b-tag>
                                    </router-link>

                                    
                                    <template v-else>
                                        <div class="navbar-item" :key="page.name">
                                            {{ page.category }}
                                        </div>
                                        <router-link
                                            v-for="page in page.pages"
                                            :key="page.name"
                                            :to="page.path"
                                            class="navbar-item"
                                            style="margin-left: 1rem;">
                                            <span class="navbar-item-text">{{ page.name }}</span>
                                            <b-tag v-if="page.isNew" type="is-success">
                                                New!
                                            </b-tag>
                                            <b-tag v-if="page.isUpdated" type="is-info">
                                                Updated
                                            </b-tag>
                                        </router-link>
                                    </template>
                                </template>

                            </template>
                        </div>
                    </div>-->

                 

                  <!--<hr v-if="userIsAdmin" class="navbar-divider" style="display: block;">-->
                  <!--
                  <b-dropdown v-if="userIsAdmin" class="navbar-item">
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

                  <hr class="navbar-divider" style="display: block;">-->
                  <!--
                  <b-dropdown v-if="getUser" class="navbar-item">
                    <button class="button is-outlined is-info" slot="trigger">
                      <span>{{getUser.fullName}}</span>
                      <b-icon icon="menu-down"></b-icon>
                    </button>
                    <b-dropdown-item @click="goRoute('/principal/cuenta')">Mi cuenta</b-dropdown-item>
                    <b-dropdown-item @click="goRoute('/admin/cambio-clave')">Cambiar Contraseña</b-dropdown-item>
                    <b-dropdown-item @click="cerrarSesion">Cerrar sesión</b-dropdown-item>
                  </b-dropdown>-->

                <!--
                </div>
            </div>
        </div>-->
    <!--</header>-->
    <div>
      
    </div>
</template>

<script>

    import {mapGetters, mapMutations} from 'vuex'
    import menu from '../menu'
    import Methods from  '../api/methods'
    export default {
        props: {
            light: Boolean
        },
      data () {
        return {
          menu,
          activeNotifications: false,
          isMenuActive : false,
          oficinas:[],
        }
      },
      computed: {
        ...mapGetters({'getUser':'auth/getUser'}),
        ...mapGetters({'getIdPuntoVenta':'auth/getIdPuntoVenta'}),
        ...mapGetters({'getPuntoVenta':'punto/getPuntoVenta'}),
        routeName () {
          const {name} = this.$route
          return this.capitalizeFirstLetter(name)
        },
        oficinasOptions(){
          const listaOptions = []
          listaOptions.push({value:null,text:"Seleccione Oficina"})
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
      methods: {
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
        capitalizeFirstLetter (string) {
          return string.charAt(0).toUpperCase() + string.slice(1)
        },
        toggleNotificationDropDown () {
          this.activeNotifications = !this.activeNotifications
        },
        closeDropDown () {
          this.activeNotifications = false
        },
        toggleSidebar () {
          this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
        },
        hideSidebar () {
          this.$sidebar.displaySidebar(false)
        },

        goRoute(ruta){
          this.$router.push(ruta)
        },
        cerrarSesion(){
          location.reload()
          localStorage.clear()
          this.$router.push("/login")
        },
        closeMenu() {
          this.isMenuActive = false
        },
        toggleHtmlClip() {
          document
            .documentElement
            .classList
            .toggle('is-clipped-touch', this.isMenuActive)
        },

      },
      beforeMount(){
        this.cargarOficinas().then(()=>{
          if(this.getIdPuntoVenta){
            this.oficinaSelected=this.oficinas.find(ofi=>ofi.id==this.getIdPuntoVenta)

          }
        })
      },
        created() {
            this.$eventBus.$on('close-menu', this.closeMenu)
        },
        beforeDestroy() {
            this.$eventBus.$off('close-menu')
        }
    }
</script>
