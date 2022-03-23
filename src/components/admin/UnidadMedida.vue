<template>
    <div class="default-container">
        <h1 class="title is-spaced">Unidades de medida</h1>
        <hr>

      <b-field label="MIS UNIDADES">

       <div>
         <b-field>
           <b-autocomplete
             v-model="unidadMedidaText"
             :data="unidadesMedidaAutocomplete"
             :loading="isFetchingUnidad"
             placeholder="Buscar unidades"
             @input="buscarUnidad"
             @select="option => selectedUnidad = option"
             field="description">
             <template slot-scope="props">
               <div class="media">
                 <div class="media-left">
                   {{ props.option.code }}
                 </div>
                 <div class="media-content">
                   {{ props.option.description}}
                 </div>
               </div>
             </template>
           </b-autocomplete>

         </b-field>
         <button @click="agregarUnidad" class="button is-info is-rounded">Agregar unidad</button>

         <b-table
           :data="unidades"
           :mobile-cards="true">

           <template slot-scope="props">

             <b-table-column label="Código">
               {{ props.row.code }}
             </b-table-column>

             <b-table-column label="Descripción">
               {{ props.row.description }}
             </b-table-column>


             <b-table-column label="Acciones"  width="50" centered>

               <b-tooltip  type="is-dark" label="Seleccionar por defecto"
                           position="is-left">
                 <button @click="seleccionarUnidadPorDefecto(props.row)" class="button is-small"><b-icon type="is-info" size="is-mediun" icon="plus"></b-icon></button>
               </b-tooltip>

               <b-tooltip  type="is-dark" label="Eliminar"
                           position="is-left">
                 <button @click="eliminarUnidad(props.row)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
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
                 <p>Ningúna unidad.</p>
               </div>
             </section>
           </template>
         </b-table>

       </div>
      </b-field>

      <hr/>

      <b-field label="UNIDAD POR DEFECTO">

        <div class="field">
          <b-tag v-if="defaultUnit"
                 type="is-primary"
                 closable
                 @close="eliminarPorDefecto">
            {{defaultUnit.code}} - {{defaultUnit.description}}
          </b-tag>
        </div>

      </b-field>



    </div>
</template>

<script>

  import Methods from '../../api/methods'
  import axios from 'axios'
  import util from '../../util'

  const endPoint = __API__;
  export default {
    data () {
      return {
        unidadMedidaText: null,
        unidadesMedidaAutocomplete: [],
        isFetchingUnidad: false,
        selectedUnidad: null,

        unidades: [],
        defaultUnit: null


      }
    },
    methods:{
      buscarUnidad(){
        this.unidadesMedidaAutocomplete = []
        this.isFetchingUnidad = true
        const headers = util.getAuthHeader()
        axios.get(`${endPoint}api/search-unitcode?unidad=${this.unidadMedidaText}`, {headers})
          .then((response) => {
            response.data.forEach((item) => this.unidadesMedidaAutocomplete.push(item))
            this.isFetchingUnidad = false
          })
          .catch((error) => {
            this.isFetchingUnidad = false
            throw error
          })
      },

     agregarUnidad(){

        if (this.selectedUnidad){

          Methods.doPost(this, 'api/company/myunitcodes', this.selectedUnidad).then(data=>{
            this.unidades=data.unitCodes
            if(data.default) this.defaultUnit=data.default
          })
        }

      },

      seleccionarUnidadPorDefecto(unidad){
          Methods.doPost(this, 'api/company/myunitcodes/default', unidad).then(data=>{
            this.unidades=data.unitCodes
            if(data.default) this.defaultUnit=data.default
          })
      },

      eliminarPorDefecto(){
        Methods.doDelete(this, `api/company/myunitcodes/default/remove`).then(data=>{
          this.unidades=data.unitCodes
          this.defaultUnit=data.default
        })
      },

      eliminarUnidad(unidad){
        Methods.doDelete(this, `api/company/myunitcodes/${unidad.id}`).then(data=>{
          this.unidades=data.unitCodes
          if(data.default) this.defaultUnit=data.default
        })
      },

      loadUnidades(){
        Methods.doGet(this, 'api/company/myunitcodes').then(data=>{
          this.unidades=data.unitCodes
          if(data.default) this.defaultUnit=data.default
        })
      }

    },

    computed:{

    },

    beforeMount(){
      this.loadUnidades()
    }
  }
</script>
