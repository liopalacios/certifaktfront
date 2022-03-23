<template>
  <div class="default-container">
    <p class="title is-3-desktop is-4-tablet is-5-mobile">Cambio de clave</p>

    <section>
      <b-field label="Contraseña actual">
        <b-input v-model="form.password" type="password"
                 placeholder="Ingrese contraseña actual" password-reveal>
        </b-input >
      </b-field>

      <b-field label="Nueva contraseña">
        <b-input  v-model="form.newPassword" type="password"
                  placeholder="Ingrese nueva contraseña"
                  password-reveal>
        </b-input>
      </b-field>

      <b-field label="Confirmar nueva contreña">
        <b-input v-model="form.confirmPassword" type="password"
                 placeholder="Confirme nueva contraseña"
                 password-reveal>
        </b-input>
      </b-field>


      <button @click="dochangePassword"  class="button is-primary ">
        Cambiar contraseña
      </button>

    </section>


  </div>
</template>



<script>
  import {mapActions,mapGetters} from 'vuex'
  import Methods from '../../api/methods';
  export default {
    data(){
      return {
        form: {}
      }
    },
    methods:{
      ...mapActions({'changePassword':'auth/changePassword'}),
      dochangePassword(){
        var request = {
            "password": this.form.password,
            "newPassword": this.form.newPassword,
            "confirmPassword": this.form.confirmPassword
        };
        var url = `api/usuarios`;

        Methods.doPatch(this, url, request).then(resp=>{
            if(resp){
                this.$buefy.dialog.alert('Contraseña actualizada correctamente')
                this.form={}
            }
        });
      }
    },
    computed:{
      ...mapGetters({'getUser': 'auth/getUser'}),
    }
  }
</script>
