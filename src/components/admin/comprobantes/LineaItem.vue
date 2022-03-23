<template>
    <div>

      <b-table :data="value.$model" >

        <template slot-scope="props">

            <b-table-column label="IGV">
              <b-checkbox disabled v-model="props.row.inc_igv"></b-checkbox>
            </b-table-column>
            <b-table-column label="Cod. Prod. Sunat.">
              {{props.row.codigo_producto_sunat}}
            </b-table-column>
            <b-table-column label="Producto">
              {{props.row.descripcion}}
            </b-table-column>
            <b-table-column label="Unidad">
              {{props.row.unidad_medida}}
            </b-table-column>
            <b-table-column label="Cant.">
              {{props.row.cantidad}}
            </b-table-column>
            <b-table-column label="Tipo Igv" centered>
              <b-select disabled size="is-small" expanded v-model="props.row.tipo_afectacion_igv" style="width: 150px">
                <option
                  v-for="option in tipoIgvList"
                  :value="option.value"
                  :key="option.value">
                  {{ option.text}}
                </option>
              </b-select>
            </b-table-column>

            <b-table-column label="% Venta Gratuita">
              {{props.row.porcentaje_trib_vta_grat}}
            </b-table-column>
            <b-table-column label="Valor Unit.">
              {{showWith4Decimal(props.row.valor_unitario)}}
            </b-table-column>
            <b-table-column label="Venta Unit.">
              {{showWith2Decimal(props.row.precio_venta_unitario)}}
            </b-table-column>
            <b-table-column label="Valor venta">
              {{showWith2Decimal(props.row.valor_venta)}}
            </b-table-column>
            <b-table-column label="Precio total">
              {{showWith2Decimal(props.row.precio_total)}}
            </b-table-column>

            <b-table-column class="celdadelete" v-if="tipoboleta">
              <a  @click="borrar(props.index)" class="button is-danger is-rounded is-small"><b-icon icon="delete"></b-icon></a>
            </b-table-column>

            <b-table-column >
              <a @click="editar(props.index)" class=" button is-danger is-rounded is-small"><b-icon icon="pencil"></b-icon></a>
            </b-table-column>

        <div class="columns is-multiline">
          <div class="column is-3">
            <div class="columns">



            </div>
          </div>

        </div>
        </template>
      </b-table>


      <context-menu id="context-menu" ref="ctxMenu">
        <li @click="changeTypeFieldDescription">{{messageContextMenuOption}}</li>
      </context-menu>




    </div>
</template>
<script>
  import validationsMixin from '../../../validations/index'
  import Methods from '../../../api/methods';
  import {
    mapGetters
  } from 'vuex';

  import contextMenu from 'vue-context-menu'

  import Util from '../../../util'

  const unidades = Util.getUnidades().unitCodes

  export default {
    mixins: [validationsMixin],
    props: ['value'],
    components: {contextMenu },
    data() {
      return {
        classObject: {
          active: true,
        },
        tipoboleta:true,
        unidades,
        celdadelete:[],
        isCardModalEditarProducto:false,
        productosAutocomplete: [],
        isFetchingProducto:false,
        isTextAreaDescription: false,
        indexContextMenu: null
      }
    },
    methods: {
      addProducto() {
        this.isCardModalProducto = true
      },
      buscarProducto(descProducto){
        this.productosAutocomplete = []
        this.isFetchingProducto = true
        const url = `api/search-productos?producto=${descProducto}`
        Methods.doGet(this, url)
          .then((response) => {
            response.forEach((item) => this.productosAutocomplete.push(item))
            this.isFetchingProducto = false
          })
          .catch((error) => {
            this.isFetchingProducto = false
            throw error
          })
      },
      selectedProducto(index, option){
        this.$emit('selectedProducto', index, option)
      },
      editar(indice){
        console.log("EDITAR")
        console.log(indice)
        this.$emit('editarProducto',indice)
      },
      borrar(index){
        console.log("borrar")
        console.log(index)
        this.$emit('borrarProducto',index)
      },
      showWith2Decimal(number){
       // return number
        if(parseFloat(number)<0.01 && parseFloat(number)>-0.01)
          return (0).toFixed(2)
        return ((Math.round(parseFloat(number) *100 ))/100).toFixed(2)
      },showWith4Decimal(number) {
        if (parseFloat(number) < 0.005 && parseFloat(number) > -0.005)
          return (0).toFixed(4)
        return (parseFloat(number)).toFixed(4)

      },
      openContextMenuInDescription(prod, index){
        this.isTextAreaDescription = prod
        this.indexContextMenu= index
        this.$refs.ctxMenu.open()
      },
      changeTypeFieldDescription(){
        this.$emit('changeFieldDescription', this.indexContextMenu)
      }
    },
    computed: {
      ...mapGetters({'getCatalogo07': 'catalogos/getCatalogo07'}),
      getdecrip(){
        var res = '';
        var lista = [];
        this.getCatalogo07.forEach(v=>{
          if(v.codigo==id){
            res = v.descripcion
          }
        })
        return res
      },
      tipoIgvList() {
        const listado = [];
        this.getCatalogo07.forEach(v=>{
          listado.push({value:v.codigo,
                        text: v.descripcion})
        })
        return listado;
      },
      existenUnidades(){
        return this.unidades.length>0
      },
      messageContextMenuOption(){
        return this.isTextAreaDescription?"Descripción normal":"Descripción larga"
      }
    }
  }
</script>
