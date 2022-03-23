<template>
    <div class="formproducto">

      <div  v-for="(prod, index) in value.$each.$iter" :key="index">
        <div v-if="index == keying ">
          <v-progress-linear
            :active="loadingform"
            :indeterminate="loadingform"
            absolute
            bottom
            color="deep-purple accent-4"
          ></v-progress-linear>
          <div class="columns is-multiline">
            <div class="column">
              <div @contextmenu.prevent="openContextMenuInDescription(prod.isTextAreaDescription.$model, index)" class="column pd-per is-12">
                <b-field v-if="!prod.isTextAreaDescription.$model" label="Producto:"
                         :type="toShowType(prod.descripcion)"
                         :message="toShowMessage(prod.descripcion)">
                  <b-autocomplete
                    size="is-small"
                    v-model="prod.descripcion.$model"
                    :data="productosAutocomplete"
                    placeholder="Ingrese producto"
                    :keep-first="true"
                    @input="buscarProducto(prod.descripcion.$model)"
                    @select="option => selectedProducto(index, option)"
                    field="descripcion">
                    <template slot-scope="props">
                      <div class="media">
                        <div class="media-left">
                          {{ props.option.codigo }}
                        </div>
                        <div class="media-content">
                          {{ props.option.descripcion}}
                        </div>
                      </div>
                    </template>
                  </b-autocomplete>
                </b-field>

                <b-field v-else  label="Producto:"
                         :type="toShowType(prod.descripcion)"
                         :message="toShowMessage(prod.descripcion)">
                  <b-input size="is-small" required
                           v-model="prod.descripcion.$model" maxlength="250" type="textarea"></b-input>
                </b-field>
              </div>
            </div>
            <b-field label="Igv. Inc:" class="incigvcss">
              <b-checkbox v-model="prod.inc_igv.$model" ></b-checkbox>
            </b-field>
          </div>

        <div class="columns">
          <div class="column pd-per" style="padding: 15px">
            <b-field label="Cantidad:"
                     :type="toShowType(prod.cantidad)"
                     :message="toShowMessage(prod.cantidad)">
              <b-input size="is-small" v-model="prod.cantidad.$model"
              ></b-input>
            </b-field>
          </div>
          <div class="column pd-per">
            <b-field label="Unidad:"
                     :type="toShowType(prod.unidad_medida)"
                     :message="toShowMessage(prod.unidad_medida)">
              <b-select v-if="existenUnidades" size="is-small" expanded v-model="prod.unidad_medida.$model">
                <option
                  v-for="option in unidades"
                  :value="option.code"
                  :key="option.code">
                  {{ option.description}}
                </option>
              </b-select>
              <b-input disabled v-if="!existenUnidades" size="is-small" v-model="prod.unidad_medida.$model"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Precio Unitario:"
                     :type="toShowType(prod.precio_venta_unitario)"
                     :message="toShowMessage(prod.precio_venta_unitario)">
              <b-input :disabled="!prod.inc_igv.$model" size="is-small" v-model="prod.precio_venta_unitario.$model"
              ></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <b-field label="Tipo IGV:"
                     :type="toShowType(prod.tipo_afectacion_igv)"
                     :message="toShowMessage(prod.tipo_afectacion_igv)">
              <b-select ref="selecttipo" size="is-small" expanded v-model="prod.tipo_afectacion_igv.$model" @change.native="changeTipo">
                <option
                  v-for="option in tipoIgvList"
                  :value="option.value"
                  :key="option.value">
                  {{ option.text}}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column" v-if="prod.tipo_afectacion_igv.$model == 21">
            <b-field label="Valor Referencial Unitario:"
                     :type="toShowType(prod.valor_referencial_unitario)"
                     :message="toShowMessage(prod.valor_referencial_unitario)">
              <b-input :disabled="prod.inc_igv.$model" size="is-small" @change="cambioAfectacionValorUnitario" v-model="prod.valor_unitario.$model"
              ></b-input>
            </b-field>
          </div>
          <div class="column" v-else>
            <b-field label="Valor Unitario:"
                     :type="toShowType(prod.valor_unitario)"
                     :message="toShowMessage(prod.valor_unitario)">
              <b-input :disabled="prod.inc_igv.$model" size="is-small" @change="cambioAfectacionValorUnitario" v-model="prod.valor_unitario.$model"
              ></b-input>
            </b-field>
          </div>
        <div class="column pd-per">
          <b-field label="ICBPER:" v-if="prod.monto_base_icbper.$model!=null"
                  :type="toShowType(prod.monto_icbper)"
                  :message="toShowMessage(prod.monto_icbper)">
          <b-input :disabled="!prod.inc_igv.$model" size="is-small" v-model="prod.monto_icbper.$model"
          ></b-input>
        </b-field>
            <b-field label="Codigo Sunat:" v-else
                  :type="toShowType(prod.codigo_producto_sunat)"
                  :message="toShowMessage(prod.codigo_producto_sunat)">
            <b-input type="number" size="is-small" v-model="prod.codigo_producto_sunat.$model"></b-input>
          </b-field>
        </div>
        </div>


        
          <div v-if="prod.$model.mostrarTransporte=='1001' && prod.$model.codigoBienDetraccion=='004'">
            <div class="columns">
              <b-field class="column" label="Lugar de descarga"
                       :type="toShowType(prod.hidro_lugar_descarga)"
                       :message="toShowMessage(prod.hidro_lugar_descarga)">
                <b-input icon="map-marker" size="is-small"
                         v-model="prod.hidro_lugar_descarga.$model"></b-input>
              </b-field>
              <b-field class="column" label="Fecha de descarga:" :type="toShowType(prod.hidro_fecha_descarga)"
                       :message="toShowMessage(prod.hidro_fecha_descarga)">
                <b-datepicker size="is-small" v-model="prod.hidro_fecha_descarga.$model" :date-formatter="formatDate"
                              placeholder="Click para seleccionar fecha" icon="calendar-today">
                </b-datepicker>
              </b-field>
              <b-field class="column" label="Cantidad"
                       :type="toShowType(prod.hidro_cantidad)"
                       :message="toShowMessage(prod.hidro_cantidad)">
                <b-input icon="drag" size="is-small"
                         v-model="prod.hidro_cantidad.$model"></b-input>
              </b-field>
            </div>
            <div class="columns" style="margin-bottom: 30px">
              <b-field class="column" label="Matricula"
                       :type="toShowType(prod.hidro_matricula)"
                       :message="toShowMessage(prod.hidro_matricula)">
                <b-input icon="ferri" size="is-small"
                         v-model="prod.hidro_matricula.$model"></b-input>
              </b-field>
              <b-field class="column" label="Embarcacion"
                       :type="toShowType(prod.hidro_embarcacion)"
                       :message="toShowMessage(prod.hidro_embarcacion)">
                <b-input icon="ship-wheel" size="is-small"
                         v-model="prod.hidro_embarcacion.$model"></b-input>
              </b-field>
              <b-field class="column" label="Tipo Descripcion"
                       :type="toShowType(prod.hidro_descripcion_tipo)"
                       :message="toShowMessage(prod.hidro_descripcion_tipo)">
                <b-input icon="pencil" size="is-small"
                         v-model="prod.hidro_descripcion_tipo.$model"></b-input>
              </b-field>
            </div>


          </div>
          <div class="columns" v-if="prod.$model.mostrarTransporte=='1004'">
            <div class="column">
              <!--<b-field label="Ubigeo de Origen:"
                       :type="toShowType(prod.ubigeo_origen_detraccion)"
                       :message="toShowMessage(prod.ubigeo_origen_detraccion)">
                <b-input size="is-small" v-model="prod.ubigeo_origen_detraccion.$model"
                ></b-input>
              </b-field>-->

              <b-field label="Ubigeo de Origen:"
                       :type="toShowType(prod.ubigeo_origen_detraccion)"
                       :message="toShowMessage(prod.ubigeo_origen_detraccion)">
                <b-select ref="selecttipo" size="is-small" expanded v-model="prod.ubigeo_origen_detraccion.$model">
                  <option
                    v-for="option in getUbigeoTot"
                    :value="option.value"
                    :key="option.value">
                    {{ option.text}}
                  </option>
                </b-select>

              </b-field>

            </div>
            <div class="column">
              <b-field label="Direccion de Origen:"
                       :type="toShowType(prod.direccion_origen_detraccion)"
                       :message="toShowMessage(prod.direccion_origen_detraccion)">
                <b-input size="is-small" v-model="prod.direccion_origen_detraccion.$model"
                ></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns" v-if="prod.$model.mostrarTransporte=='1004'">
            <div class="column">
              <!--<b-field label="Ubigeo de Destino:"
                       :type="toShowType(prod.ubigeo_destino_detraccion)"
                       :message="toShowMessage(prod.ubigeo_destino_detraccion)">
                <b-input size="is-small" v-model="prod.ubigeo_destino_detraccion.$model"
                ></b-input>
              </b-field>-->
              <b-field label="Ubigeo de Destino:"
                       :type="toShowType(prod.ubigeo_destino_detraccion)"
                       :message="toShowMessage(prod.ubigeo_destino_detraccion)">
                <b-select ref="selecttipo" size="is-small" expanded v-model="prod.ubigeo_destino_detraccion.$model">
                  <option
                    v-for="option in getUbigeoTot"
                    :value="option.value"
                    :key="option.value">
                    {{ option.text}}
                  </option>
                </b-select>

              </b-field>
            </div>
            <div class="column">
              <b-field label="Direccion de Destino:"
                       :type="toShowType(prod.direccion_destino_detraccion)"
                       :message="toShowMessage(prod.direccion_destino_detraccion)">
                <b-input size="is-small" expanded v-model="prod.direccion_destino_detraccion.$model"
                ></b-input>
              </b-field>
            </div>
          </div>
          <div class="columns" v-if="prod.$model.mostrarTransporte=='1004'">

            <div class="column">
              <b-field label="Detalle viaje:"
                       :type="toShowType(prod.detalle_viaje_detraccion)"
                       :message="toShowMessage(prod.detalle_viaje_detraccion)">
                <b-input size="is-small" v-model="prod.detalle_viaje_detraccion.$model"
                ></b-input>
              </b-field>
            </div>

          </div>
          <div class="columns" v-if="prod.$model.mostrarTransporte=='1004'">
            <div class="column">
              <b-field label="Valor del servicio:"
                       :type="toShowType(prod.valor_servicio_transporte)"
                       :message="toShowMessage(prod.valor_servicio_transporte)">
                <b-input size="is-small" v-model="prod.valor_servicio_transporte.$model"
                ></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Valor de carga efectiva:"
                       :type="toShowType(prod.valor_carga_efectiva)"
                       :message="toShowMessage(prod.valor_carga_efectiva)">
                <b-input size="is-small" v-model="prod.valor_carga_efectiva.$model"
                ></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Valor de carga util:"
                       :type="toShowType(prod.valor_carga_util)"
                       :message="toShowMessage(prod.valor_carga_util)">
                <b-input size="is-small" v-model="prod.valor_carga_util.$model"
                ></b-input>
              </b-field>
            </div>
          </div>


          <div class="columns" v-if="getCompany.bucket == '20501165141'">
            <div class="column">
              <b-field label="Unidad de Manejo:"
                       :type="toShowType(prod.unidad_manejo)"
                       :message="toShowMessage(prod.unidad_manejo)">
                <b-input size="is-small" v-model="prod.unidad_manejo.$model"
                ></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Instrucciones Especiales"
                       :type="toShowType(prod.instrucciones_especiales)"
                       :message="toShowMessage(prod.instrucciones_especiales)">
                <b-input size="is-small" v-model="prod.instrucciones_especiales.$model"
                ></b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Marca"
                       :type="toShowType(prod.marca)"
                       :message="toShowMessage(prod.marca)">
                <b-input size="is-small" v-model="prod.marca.$model"
                ></b-input>
              </b-field>
            </div>
          </div>


        <div class="columns" style="margin-bottom: 30px">
          <div v-if="mostraPorc==true" class="column">
            <b-field label="% Impuesto Venta Gratuita:"
                     :type="toShowType(prod.porcentaje_trib_vta_grat)"
                     :message="toShowMessage(prod.porcentaje_trib_vta_grat)">
              <b-input size="is-small" v-model="prod.porcentaje_trib_vta_grat.$model"
              ></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="SubTotal:"
                     :type="toShowType(prod.valor_venta)"
                     :message="toShowMessage(prod.valor_venta)">
              <b-input disabled size="is-small" :value="showWith4Decimal(prod.valor_venta.$model)"
              ></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Total:"
                     :type="toShowType(prod.precio_total)"
                     :message="toShowMessage(prod.precio_total)">
              <b-input disabled size="is-small" :value="showWith2Decimal(prod.precio_total.$model)"
              ></b-input>
            </b-field>
          </div>
        </div>

<div class="columns">

  <div class="column">

  </div>
</div>
        <div class="column is-1" v-if="prod.mostraPorc.$model">

        </div>
            <div class="columns">

            </div>
        </div>
        </div>



      <context-menu id="context-menu" ref="ctxMenu">
        <li @click="changeTypeFieldDescription">{{messageContextMenuOption}}</li>
      </context-menu>

    </div>
</template>
<style scoped>
  .incigvcss{
    padding: 1rem;
  }
</style>
<script>
  const monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Setiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];
  import validationsMixin from '../../../validations/index'
  import Methods from '../../../api/methods';
  import debounce from 'lodash/debounce'
  import {
    mapGetters
  } from 'vuex';

  import contextMenu from 'vue-context-menu'

  import Util from '../../../util'
  const unidades = Util.getUnidades().unitCodes

  export default {
    mixins: [validationsMixin],
    props: ['value','keying'],
    components: { contextMenu },
    data() {
      return {
        mostraPorc:false,
        mostrarTransporte:false,
        unidades,
        productosAutocomplete: [],
        ubigeoAutocomplete: [],
        productos:[],
        ubigeos:[],
        isFetchingProducto:false,
        loadingform:false,
        isFetchingUbigeo:false,
        isTextAreaDescription: false,
        isTextAreaUbigeoDescription: false,
        indexContextMenu: null
      }
    },
    mounted(){
      console.log(this.value)
      let ite = this.$refs.selecttipo[0].selected
      if(ite == 11 || ite == 12 || ite == 13 || ite == 14 ||
        ite == 15 || ite == 16 || ite == 17){
        //this.formulario.items[index].imp_vta_grat = parseFloat(parseFloat(element.porcentaje_trib_vta_grat?element.porcentaje_trib_vta_grat:0)/100)*parseFloat(element.valor_venta)
        this.$emit('validatePorcentaje',true)
        this.mostraPorc = true
      }else{
        this.mostraPorc = false
        this.$emit('validatePorcentaje',false)
      }


    },
    methods: {

      cambioAfectacionValorUnitario(){
          if(this.formulario.items[index].valor_unitario == 0){
            this.formulario.items[index].tipo_afectacion_igv = 20;
          } else{
            this.formulario.items[index].tipo_afectacion_igv = 10;
          }
      },
      formatDate(date) {
        console.log(date)
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `${day} de ${monthNames[monthIndex]} de ${year}`
      },
      changeTipo:function({type,target}){
        var id = target.value;
        if(id == 11 || id == 12 || id == 13 || id == 14 ||
          id == 15 || id == 16 || id == 17){
          //this.formulario.items[index].imp_vta_grat = parseFloat(parseFloat(element.porcentaje_trib_vta_grat?element.porcentaje_trib_vta_grat:0)/100)*parseFloat(element.valor_venta)
          this.$emit('validatePorcentaje',true)
          this.mostraPorc = true
        }else  if(id == 10 ){
         // this.formulario.items[index].inc_igv = true
        }else  if(id == 21 ){
          this.inc_igv = false
          this.value.inc_igv = false
        }else{
          this.mostraPorc = false
          this.$emit('validatePorcentaje',false)
        }
      },
      buscarProducto(descProducto){
        this.productosAutocomplete = []
        this.isFetchingProducto = true
        this.loadingform = true
        const url = `api/search-productos?producto=${descProducto}`
        Methods.doGet(this, url)
          .then((response) => {
            response.forEach((item) => this.productosAutocomplete.push(item))
            this.isFetchingProducto = false
            this.loadingform = false
          })
          .catch((error) => {
            this.isFetchingProducto = false
            this.loadingform = false
            throw error
          })
      },
      
      buscarUbigeo(descUbigeo){
        this.ubigeoAutocomplete = []
        this.isFetchingUbigeo = true

      },
      selectedProducto(index, option){
        this.$emit('selectedProducto', index, option)
      },
      selectedUbigeo(index, option){
        this.$emit('selectedUbigeo', index, option)
      },
      borrar(index){
        this.$emit('borrarProducto', index)
      },
      showWith2Decimal(number){
       // return number
        if(parseFloat(number)<0.01 && parseFloat(number)>-0.01)
          return (0).toFixed(2)
        return ((Math.round(parseFloat(number) *100 ))/100).toFixed(2)
      },
      showWith4Decimal(number){
       // return number
        if(parseFloat(number)<0.01 && parseFloat(number)>-0.01)
          return (0).toFixed(2)
        return ((Math.round(parseFloat(number) *100 ))/100).toFixed(4)
      },
      openContextMenuInDescription(prod, index){
        this.isTextAreaDescription = prod
        this.indexContextMenu= index
        this.$refs.ctxMenu.open()
      },
      changeTypeFieldDescription(){
        this.$emit('changeFieldDescription', this.indexContextMenu)
      },
      medir(mostrar){
        if(mostrar)
          return "column"
        else
        return "column"
      }
    },
    computed: {
      ...mapGetters({'getCompany': 'auth/getCompany'}),
      ...mapGetters({'getCatalogo07': 'catalogos/getCatalogo07'}),
      ...mapGetters({
        'getUbigeoTotal': 'catalogos/getUbigeoTotal'
      }),
      getUbigeoTot(){
        const listado = [];        
        this.getUbigeoTotal.forEach(v => {
          listado.push({
            value: v.codigoUbigeo.toUpperCase().toUpperCase(),
            text: v.descripcion.toUpperCase().toUpperCase()
          })
        })
        return listado;
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
      esgratuita(){
        return this.tipo_afectacion_igv!=21
      },
      messageContextMenuOption(){
        return this.isTextAreaDescription?"Descripción normal":"Descripción larga"
      }
    },
    
  }
</script>
