<template>
    <div class="default-container container-main">
        <h2 class="title is-4 is-spaced">Usuarios <b-tooltip  type="is-dark" label="Agregar usuario"
                                                         position="is-right">
          <button @click="isModalNuevoUsuario=true" class="button is-small"><b-icon type="is-success" size="is-mediun" icon="plus"></b-icon></button>
        </b-tooltip></h2>
        <hr>

      <b-table
        :data="usuarios"
        :mobile-cards="true">

        <template slot-scope="props">

          <b-table-column label="Nombres">
            {{ props.row.fullName }}
          </b-table-column>

          <b-table-column label="Tipo">
            {{ props.row.typeUser | TipoUsuario}}
          </b-table-column>

          <b-table-column label="Dni">
            {{ props.row.dni }}
          </b-table-column>

          <b-table-column label="Nombre de usuario">
            {{ props.row.username }}
          </b-table-column>

          <b-table-column label="Estado">

            <b-switch v-model="props.row.enabled"
                      type="is-success"
                      disabled>
            </b-switch>
          </b-table-column>

          <b-table-column label="Acciones"  width="50" centered>
            <b-tooltip  type="is-dark" label="Editar"
                        position="is-left">
              <button @click="editarUsuario(props.row.id)" class="button is-small"><b-icon type="is-info" size="is-mediun" icon="pencil"></b-icon></button>
            </b-tooltip>
            <b-tooltip  type="is-dark" label="Eliminar"
                        position="is-left">
              <button @click="eliminarUsuario(props.row)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
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

      <!--//MODAL NUEVO-->
      <b-modal :active.sync="isModalNuevoUsuario" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Registrar usuario</span>
            </p>
          </div>
          <div class="card-content">

            <form @submit.prevent="guardarUsuario">
              <div class="columns is-multiline">

                <div class="column is-6">
                  <b-field label="Nombres completos">
                    <b-input type="text" required v-model="usuario.fullName"></b-input>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Tipo de usuario">
                    <b-select required expanded placeholder="Seleccione tipo"
                              v-model="usuario.typeUser">
                      <option
                        v-for="(option,i) in [{ text: 'Normal', value: '02' },
                { text: 'Administrador', value: '01' }
               ]"
                        :value="option.value"
                        :key="i">
                        {{ option.text }}
                      </option>
                    </b-select>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Dni">
                    <b-input type="text" required v-model="usuario.dni"></b-input>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Nombre de usuario">
                    <b-input type="email" required v-model="usuario.username"></b-input>
                  </b-field>
                </div>


              </div>

              <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar usuario</button>

            </form>

          </div>
        </div>
      </b-modal>

    </div>
</template>

<script>
  import Methods from '../../api/methods'
  export default {
    name: "usuarios-component",
    data(){
      return {
        usuarios:[],
        usuario:{typeUser:'02'},
        isModalNuevoUsuario: false
      }
    },
    computed:{
      isValidForm(){
        return true
      }
    },
    watch:{
      'usuario.username':'printusername'
    },
    methods:{
      printusername(){
        //console.log("los users "+this.usuario.username);
      },
      guardarUsuario(){
        const url = `api/usuarios`
        Methods.doPost(this,url,this.usuario).then(data=>{
          this.promiseLoadUsuarios().then(()=>{
            this.usuario={typeUser:'02'}
            this.isModalNuevoUsuario=false
          })
        })
      },
      eliminarUsuario(user){

        this.$buefy.dialog.confirm({
          title: 'Confirmar',
          message: `¿Seguro que desea eliminar el usuario "${user.fullName}"?`,
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.confirmarEliminar(user.id)
        })

      },
      confirmarEliminar(id){
        const url = `api/usuarios/${id}`
        Methods.doDelete(this,url).then(()=>{
          this.promiseLoadUsuarios().then(()=>{
          })
        })
      },
      editarUsuario(id){
        this.$router.push({name:'admin.usuarios.editar', params:{id}})
      },
      promiseLoadUsuarios(){
        return new Promise((resolve, reject) => {
          const url = `api/usuarios`
          Methods.doGet(this,url).then(data=>{
            this.usuarios=data
            resolve()
          }).catch(error=>reject(error))
        })
      }
    },
    beforeMount(){
      this.promiseLoadUsuarios().then()
    }
  }
</script>
