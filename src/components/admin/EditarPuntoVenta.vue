<template>
    <div  class="default-container">
      <h1 class="title is-spaced">Editar punto de venta</h1>
      <hr>

      <!-- MODAL AGREGAR SERIE-->
      <b-modal :active.sync="isModalSerie" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Agregar serie</span>
            </p>
          </div>
          <div class="card-content">

            <form @submit.prevent="guardarSerie">
              <div class="columns is-multiline">

              <div class="column is-6">
                <b-field label="Tipo de documento">
                  <b-select  required expanded placeholder="Seleccione tipo"
                             v-model="serie.tipoDocumento">
                    <option
                      v-for="(option,i) in [{ text: 'Factura', value: '01' },{ text: 'Boleta', value: '03' }
                ,{ text: 'Nota de credito', value: '07' }
                ,{ text: 'Nota de debito', value: '08' }
                ,{ text: 'Guia de remision', value: '09' }
                ,{ text: 'Retencion', value: '20' }
                ,{ text: 'Percepcion', value: '40' }]"
                      :value="option.value"
                      :key="i">
                      {{ option.text }}
                    </option>
                  </b-select>
                </b-field>
              </div>

                <div class="column is-6">
                  <b-field label="Serie">
                    <b-input type="text" required v-model="serie.serie"></b-input>
                  </b-field>
                </div>



              </div>

              <button type="submit" class="button is-info is-rounded is-fullwidth">Guardar serie</button>

            </form>

          </div>
        </div>
      </b-modal>
      <!-- MODAL AGREGAR SERIE-->


      <!-- MODAL ASIGNAR USUARIO -->
      <b-modal :active.sync="isModalUsuarios" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Agregar usuario</span>
            </p>
          </div>
          <div class="card-content">


            <b-table
              :data="usuarios"
              :mobile-cards="true">

              <template slot-scope="props">

                <b-table-column label="Nombre">
                  {{ props.row.fullName}}
                </b-table-column>

                <b-table-column label="Nombre de usuario">
                  {{ props.row.username }}
                </b-table-column>


                <b-table-column label="Acciones"  width="50" centered>
                  <b-tooltip  type="is-dark" label="Asignar usuario"
                              position="is-left">
                    <button @click="asignarUsuario(props.row.id)" class="button is-small"><b-icon type="is-success" size="is-mediun" icon="plus"></b-icon></button>
                  </b-tooltip>
                </b-table-column>

              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon
                        icon="emoticon-sad"
                        size="is-large">
                      </b-icon>
                    </p>
                    <p>Ningún usuario.</p>
                  </div>
                </section>
              </template>
            </b-table>

          </div>
        </div>
      </b-modal>
      <!-- MODAL ASIGNAR USUARIO -->


      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            <span></span> <span style="margin-left: 10px;">{{oficina.nombreCorto}}</span>
          </p>
        </div>
        <div class="card-content">

          <div class="columns is-multiline">

            <div class="column is-6">
              <b-field label="Nombre corto">
                <b-input type="text" v-model="oficina.nombreCorto"></b-input>
              </b-field>

            </div>

            <div class="column is-6">
              <b-field label="Dirección">
                <b-input type="text" v-model="oficina.direccion"></b-input>
              </b-field>

            </div>

            <div class="column is-6">

              <b-field label="Series">

                <b-table
                  :data="oficina.series"
                  :mobile-cards="true">

                  <template slot-scope="props">

                    <b-table-column label="Tipo de documento">
                      {{ props.row.tipoDocumento  | FiltroTipoDocumento}}
                    </b-table-column>

                    <b-table-column label="Serie">
                      {{ props.row.serie }}
                    </b-table-column>


                    <b-table-column label="Acciones"  width="50" centered>
                      <b-tooltip  type="is-dark" label="Eliminar"
                                  position="is-left">
                        <button @click="eliminarSerie(props.row)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
                      </b-tooltip>
                    </b-table-column>

                  </template>

                  <template slot="empty">
                    <section class="section">
                      <div class="content has-text-grey has-text-centered">
                        <p>
                          <b-icon
                            icon="emoticon-sad"
                            size="is-large">
                          </b-icon>
                        </p>
                        <p>Ningún usuario.</p>
                      </div>
                    </section>
                  </template>
                </b-table>

              </b-field>

              <div class="has-text-centered">
                <b-tooltip  type="is-dark" label="Agregar serie"
                            position="is-right">
                  <button @click="isModalSerie=true" class="button is-small is-fullwidth">Agregar serie</button>
                </b-tooltip>
              </div>

            </div>

            <div class="column is-6">
              <b-field label="Usuarios">

                <b-table
                  :data="oficina.usuarios"
                  :mobile-cards="true">

                  <template slot-scope="props">

                    <b-table-column label="Nombre">
                      {{ props.row.fullName}}
                    </b-table-column>

                    <b-table-column label="Nombre de usuario">
                      {{ props.row.username }}
                    </b-table-column>


                    <b-table-column label="Acciones"  width="50" centered>
                      <b-tooltip  type="is-dark" label="Eliminar"
                                  position="is-left">
                        <button @click="desasignarUsuario(props.row.id)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
                      </b-tooltip>
                    </b-table-column>

                  </template>

                  <template slot="empty">
                    <section class="section">
                      <div class="content has-text-grey has-text-centered">
                        <p>
                          <b-icon
                            icon="emoticon-sad"
                            size="is-large">
                          </b-icon>
                        </p>
                        <p>Ningún usuario.</p>
                      </div>
                    </section>
                  </template>
                </b-table>

              </b-field>

              <div class="has-text-centered">
                <b-tooltip  type="is-dark" label="Asignar usuario"
                            position="is-right">
                  <button @click="isModalUsuarios=true" class="button is-small is-fullwidth">Asignar usuario</button>
                </b-tooltip>
              </div>
            </div>

          </div>

          <div class="has-text-centered">
            <button @click="guardarCambios"  class="button is-info is-rounded">Guardar cambios</button>

          </div>

        </div>
      </div>

    </div>
</template>

<script>
  import Methods from '../../api/methods'
    export default {
      name: "editar-oficina",
      data(){
          return{
            oficina : {},
            serie: {tipoDocumento:'01'},
            usuarios: [],
            isModalSerie: false,
            isModalUsuarios: false
          }
      },
      computed:{
        isValidFormSerie(){
          return this.serie.tipoDocumento && this.serie.serie
        }
      },
      mounted(){
          this.loadOficina()
        this.loadUsuarios()
      },
      methods:{
        asignarUsuario(idUsuario){
          const url = `api/usuarios/oficinas`
            Methods.doPut(this,url,{idUsuario, idOficina:this.oficina.id}).then(()=>{
              this.loadOficinaPromise().then(()=>{
                this.$buefy.toast.open({
                  message: "Usuario asignado correctamente."
                });
                this.isModalUsuarios=false
              })
            })
        },
        desasignarUsuario(idUsuario){
          const url = `api/usuarios/oficinas`
          Methods.doPut(this,url,{idUsuario}).then(()=>{
            this.loadOficinaPromise().then()
          })
        },
        loadUsuarios(){
          const url = `api/usuarios`
          Methods.doGet(this,url).then(data=>{
            this.usuarios=data
          })
        },
         loadOficina(){
         this.loadOficinaPromise().then()
         },
        loadOficinaPromise(){
          return new Promise((resolve, reject) => {
            const idOficina =this.$route.params.id
            const url= `api/oficinas/${idOficina}`
            Methods.doGet(this,url).then(data=>{
              this.oficina=data
              resolve()
            }).catch(()=>reject())
          })
        },
        guardarCambios(){
           const url = `api/oficinas`
          Methods.doPut(this,url,this.oficina).then(data=>{
            this.loadOficinaPromise().then()
          })
        },
        guardarSerie(){
           const url = `api/oficinas/${this.oficina.id}/series`
          Methods.doPost(this,url,this.serie).then(data=>{
            this.loadOficinaPromise().then(()=>{
              this.isModalSerie=false
              this.serie= {tipoDocumento:'01'}
            })
          })
        },
        eliminarSerie(serie){
          this.$buefy.dialog.confirm({
            title: 'Confirmar',
            message: `¿Seguro que desea eliminar esta serie "${serie.serie}"?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.confirmarEliminarSerie(serie.id)
          })
        },
        confirmarEliminarSerie(id){
           const url = `api/oficinas/${this.oficina.id}/series/${id}`
          Methods.doDelete(this,url).then(()=>{
            this.loadOficinaPromise().then(()=>{
              this.serie = {tipoDocumento:'01'}
              this.isModalSerie=false
            })
          })
        }
      },
      watch:{
          '$route':'loadOficina'
      }
    }
</script>

<style scoped>

</style>
