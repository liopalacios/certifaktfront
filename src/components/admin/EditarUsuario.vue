<template>
    <div class="default-container">
        <h1 class="title is-spaced">Editar usuario</h1>
        <hr>


      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
         <span><b-icon
           icon="pencil"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Editar usuario</span>
          </p>
        </div>
        <div class="card-content">

          <form @submit.prevent="guardarCambios">
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
                  <b-input type="number" required v-model="usuario.dni"></b-input>
                </b-field>
              </div>

              <div class="column is-6">
                <b-field label="Email">
                  <b-input type="email" required v-model="usuario.username"></b-input>
                </b-field>
              </div>

              <div class="column is-6">
                <b-field label="Estado">
                  <b-switch v-model="usuario.enabled"
                            type="is-success"
                            >
                  </b-switch>
                </b-field>
              </div>


            </div>

            <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar usuario</button>

          </form>

        </div>
      </div>

    </div>
</template>

<script>
  import Methods from '../../api/methods'
  export default {
    name: "editar-usuario",
    data(){
      return{
        usuario:{typeUser:'02'}
      }
    },
    methods:{
      loadUserById(id){
        const url = `api/usuarios/${id}`
        Methods.doGet(this,url).then(data=>{this.usuario=data})
      },
      changeUrlUser(){
        this.loadUserById(this.$route.params.id)
      },
      guardarCambios(){
        const url = `api/usuarios`
        Methods.doPut(this,url,this.usuario).then(data=>{
          this.usuario=data
        })
      },
    },
    watch:{
      '$route': 'changeUrlUser'
    },
    beforeMount(){
      this.changeUrlUser()
    }
  }
</script>
