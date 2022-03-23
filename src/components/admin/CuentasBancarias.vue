<template>
    <div class="default-container">
              <h1 class="title is-spaced">Mis cuentas bancarias <b-tooltip  type="is-dark" label="Agregar cuenta"
                                                        position="is-right">
        <button @click="addCuenta()" class="button is-small"><b-icon type="is-success" size="is-mediun" icon="plus"></b-icon></button>
      </b-tooltip></h1>
        <hr>

      <b-table
        :data="cuentas"
        :mobile-cards="true">

        <template slot-scope="props">

          <b-table-column label="Banco">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column label="Número">
            {{ props.row.number }}
          </b-table-column>

          <b-table-column label="CCI">
            {{ props.row.cci }}
          </b-table-column>

          <b-table-column label="Detracción">
            <b-switch disabled="true" :value="props.row.detraccion"/>
          </b-table-column>


          <b-table-column label="Acciones"  width="50" centered>

            <b-tooltip  type="is-dark" label="Eliminar"
                        position="is-left">
              <button @click="eliminarCuenta(props.row)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
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
              <p>Ningúna cuenta.</p>
            </div>
          </section>
        </template>
      </b-table>



      <!--//MODAL NUEVO-->
      <b-modal :active.sync="isModalNuevaCuenta" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Registrar cuenta</span>
            </p>
          </div>
          <div class="card-content">

            <form @submit.prevent="guardarCuenta">
              <div class="columns is-multiline">

                <div class="column is-4">
                  <b-field label="Banco">
                    <b-select required size="is-small" expanded v-model="cuenta.banco">
                      <option
                        v-for="option in bancos"
                        :value="option.code"
                        :key="option.code">
                        {{ option.name}}
                      </option>
                    </b-select>
                  </b-field>
                </div>

                <div class="column is-4">
                  <b-field label="Nombre cuenta">
                    <b-input ref="nombreCuenta" required size="is-small" type="text" v-model="cuenta.name"></b-input>
                  </b-field>
                </div>

                <div class="column is-4">
                  <b-field label="Número">
                    <b-input required size="is-small" type="text" v-model="cuenta.number"></b-input>
                  </b-field>
                </div>
                <div class="column is-4">
                  <b-field label="CCI">
                    <b-input size="is-small" type="text" v-model="cuenta.cci"></b-input>
                  </b-field>
                </div>
                <div class="column is-4">
                  <b-field label="Detracción">
                    <b-switch v-model="cuenta.detraccion">
                     </b-switch>
                  </b-field>
                </div>

              </div>

              <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar cuenta</button>

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
        bancos: [],
       cuentas : [],
        isModalNuevaCuenta: false,
        cuenta: {}
      }
    },
    methods:{
      eliminarCuenta(cuenta){


        this.$buefy.dialog.confirm({
          message: `¿Seguro que desea eliminar la cuenta ${cuenta.banco}-${cuenta.number}?`,
          onConfirm: () => {
            Methods.doPatch(this, 'api/cuentas', cuenta).then(data=>{
              this.cuentas=data
            })
          }
        })
      },
      addCuenta(){
        this.isModalNuevaCuenta = true
      },

      loadCuentas(){
        Methods.doGet(this, 'api/cuentas').then(data=>{
          this.cuentas=data
        })
      },

      loadBancos(){
        Methods.doGet(this, 'api/bancos').then(data=>{
          this.bancos=data
        })
      },

      guardarCuenta(){
        Methods.doPost(this, 'api/cuentas', this.cuenta).then(data=>{
          this.cuentas=data
          this.isModalNuevaCuenta = false
          this.cuenta = {}
        })
      }
    },

    computed:{

    },

    watch:{
      'cuenta.banco': function (value) {
        this.cuenta.name = `${value} `
        this.$refs.nombreCuenta.focus()
      }
    },

    beforeMount(){
this.loadCuentas()
      this.loadBancos()

    }
  }
</script>
