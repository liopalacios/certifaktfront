<template>
    <div class="default-container">
        <h1 class="title is-spaced">Mis Emails <b-tooltip  type="is-dark" label="Agregar Email"
                                                                position="is-right">
          <button @click="isModalNuevoEmail=true" class="button is-small"><b-icon type="is-success" size="is-mediun" icon="plus"></b-icon></button>
        </b-tooltip></h1>
        <hr>

      <b-table :data="emails" :mobile-cards="true">
        <template slot-scope="props">
          <b-table-column label="Email">
            {{ props.row.email }}
          </b-table-column>

          <b-table-column label="Acciones"  width="50" centered>
            <b-tooltip  type="is-dark" label="Editar"
                        position="is-left">
              <button @click="editarEmail(props.row.id)" class="button is-small"><b-icon type="is-info" size="is-mediun" icon="pencil"></b-icon></button>
            </b-tooltip>
            <b-tooltip  type="is-dark" label="Eliminar"
                        position="is-left">
              <button @click="eliminarEmail(props.row.id)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
            </b-tooltip>
          </b-table-column>
        </template>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="emoticon-sad" size="is-large">
                </b-icon>
              </p>
              <p>Ningún email registrado.</p>
            </div>
          </section>
        </template>
      </b-table>


      <!--//MODAL NUEVO-->
      <b-modal :active.sync="isModalNuevoEmail" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Registrar Email para notificar</span>
            </p>
          </div>
          <div class="card-content">

            <form @submit.prevent="guardarEmail">
              <div class="columns is-multiline">

                <div class="column is-12">
                  <b-field label="Email">
                    <b-input v-model="email.email"
                             type="email"
                             required
                             placeholder="Ingrese email"></b-input>
                  </b-field>
                </div>

              </div>

              <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar email</button>

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
        emails :[],
        email: {},
        isModalNuevoEmail: false,
      }
    },
    methods:{
      cargarEmails(){
        return new Promise((resolve, reject) => {
          const url = `api/emails`
          Methods.doGet(this,url).then(data=>{
            this.emails=data
            resolve()
          }).catch(error=>reject(error))
        })
      },
      guardarEmail(event){
        event.preventDefault()
        const url = `api/emails`
        Methods.doPost(this, url, this.email).then(data=>{
          this.cargarEmails().then(()=>{
            this.isModalNuevoEmail=false
            this.email={}
          })
        })
      },
      editarEmail(id){
        this.$router.push({ name: 'admin.mis-emails.editar', params: { id }})
      },
      eliminarEmail(id){
        const url = `api/emails/${id}`
        Methods.doDelete(this,url).then(()=>{
          this.cargarEmails().then()
        })
      }
    },

    computed:{
      isValidForm(){
        return this.email.email
      }
    },

    beforeMount(){
      this.cargarEmails().then()
    }
  }
</script>
