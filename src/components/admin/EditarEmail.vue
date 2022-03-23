<template>
    <div class="default-container">
        <h1 class="title is-spaced">Editar email</h1>
        <hr>


      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
         <span><b-icon
           icon="pencil"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Editar email</span>
          </p>
        </div>
        <div class="card-content">

          <form @submit.prevent="guardarCambios">
            <div class="columns is-multiline">

              <div class="column is-12">
                <b-field label="Email">
                  <b-input type="email" required v-model="email.email"></b-input>
                </b-field>
              </div>


            </div>

            <button @click="cancelar" type="button" class="button is-black is-rounded ">Cancelar</button>
            <button type="submit" class="button is-info is-rounded ">Guardar cambios</button>

          </form>

        </div>
      </div>

    </div>
</template>

<script>
  import Methods from '../../api/methods'
  export default {
    name: "editar-email",
    data(){
      return{
        email:{}
      }
    },
    methods:{
      loadEmailById(id){
        const url = `api/emails/${id}`
        Methods.doGet(this,url).then(data=>{this.email=data})
      },
      changeUrlEmail(){
        this.loadEmailById(this.$route.params.id)
      },
      guardarCambios(){
        const url = `api/emails`
        Methods.doPut(this,url,this.email).then(data=>{
          this.email=data
          this.$router.push({name: 'admin.mis-emails'})
        })
      },
      cancelar(){
        this.$router.push({name: 'admin.mis-emails'})
      }
    },
    watch:{
      '$route': 'changeUrlEmail'
    },
    beforeMount(){
      this.changeUrlEmail()
    }
  }
</script>
