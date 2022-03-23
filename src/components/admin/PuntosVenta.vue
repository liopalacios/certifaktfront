<template>
    <div class="default-container">
        <h1 class="title is-spaced">Puntos de venta <b-tooltip  type="is-dark" label="Agregar punto de venta"
                                                                position="is-right">
          <button @click="isModalNuevoPuntoVenta=true" class="button is-small"><b-icon type="is-success" size="is-mediun" icon="plus"></b-icon></button>
        </b-tooltip></h1>
        <hr>

      <div class="columns is-multiline">
        <div :key="oficina.id" v-for="oficina in oficinas" class="column is-6">
          <div class="card">
            <div class="card-header">
              <p class="card-header-title">
         <span></span> <span style="margin-left: 10px;">{{oficina.nombreCorto}}</span>
              </p>
            </div>
            <div class="card-content">

                <div class="columns is-multiline">

                  <div class="column is-12">
                    <b-field label="Dirección">
                      <p>{{oficina.direccion}}</p>
                    </b-field>

                  </div>

                  <div class="column is-6">
                    <b-field label="Series">
                      <ul>
                        <li :key="serie.id" v-for="serie in oficina.series" style="padding: 0.2rem 0.4rem;">{{serie.tipoDocumento | FiltroTipoDocumento}}: <strong>{{serie.serie}}</strong></li>
                      </ul>
                    </b-field>
                  </div>

                  <div class="column is-6">
                    <b-field label="Usuarios">
                      <ul>
                        <li :key="user.id" v-for="user in oficina.usuarios" style="padding: 0.2rem 0.4rem;">{{user.fullName}}</li>
                      </ul>
                    </b-field>
                  </div>

                </div>

              <div class="has-text-centered">
                <button @click="editarOficina(oficina.id)"  class="button is-info is-rounded">Editar</button>
                <button @click="eliminarOficina(oficina.id)" class="button is-danger is-rounded">Eliminar</button>
              </div>

            </div>
          </div>
        </div>
      </div>



      <!--//MODAL NUEVO-->
      <b-modal :active.sync="isModalNuevoPuntoVenta" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Registrar punto de venta</span>
            </p>
          </div>
          <div class="card-content">

            <form @submit.prevent="guardarOficina">
              <div class="columns is-multiline">

                <div class="column is-6">
                  <b-field label="Nombre corto">
                    <b-input v-model="oficina.nombreCorto"
                             type="text"
                             required
                             placeholder="Ingrese nombre corto"></b-input>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Dirección">
                    <b-input v-model="oficina.direccion"
                             type="text"
                             required
                             placeholder="Ingrese dirección"></b-input>
                  </b-field>
                </div>

              </div>

              <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar punto de venta</button>

            </form>

          </div>
        </div>
      </b-modal>

    </div>
</template>

<script>

  import Methods from '../../api/methods'

  export default {
    data () {
      return {
        oficinas :[],
        oficina: {},
        isModalNuevoPuntoVenta: false,
      }
    },
    methods:{
      cargarOficinas(){
        return new Promise((resolve, reject) => {
          const url = `api/oficinas`
          Methods.doGet(this,url).then(data=>{
            this.oficinas=data
            resolve()
          }).catch(error=>reject(error))
        })
      },
      guardarOficina(event){
        event.preventDefault()
        const url = `api/oficinas`
        Methods.doPost(this, url, this.oficina).then(data=>{
          this.cargarOficinas().then(()=>{
            this.isModalNuevoPuntoVenta=false
            this.oficina={}
          })
        })
      },
      editarOficina(id){
        this.$router.push({ name: 'admin.puntos-venta.editar', params: { id }})
      },
      eliminarOficina(id){
        const url = `api/oficinas/${id}`
        Methods.doDelete(this,url).then(()=>{
          this.cargarOficinas().then()
        })
      }
    },

    computed:{
      isValidForm(){
        return this.oficina.nombreCorto && this.oficina.direccion
      }
    },

    beforeMount(){
      this.cargarOficinas().then()
    }
  }
</script>
