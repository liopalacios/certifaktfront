<template>
    <div>
      <div class="columns is-multiline">
              
        <div class="column is-3 has-text-centered-touch">
          <label class="file-label">
                <a class="buttoncsv">
                  <input type="file" id="file" name="resume" ref="fileinputref" accept=".csv" 
                  class="file-input" v-on:change="handleFileUpload($event.target.files)" />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                      Carga archivo CSV
                    </span>
                  </span>
                </a>
                  <span class="file-name">
                    {{filename}}
                  </span>

              </label>
        </div>
        <div class="column is-3 has-text-centered-touch">
          <span class="tag is-warning is-medium">Próximo numero : {{cargamasiva_numero}}</span>
        </div>
        <div class="column is-2 has-text-centered-touch">
          <div class="ceroauto" style="text-align:center">
            <a @click="enviarLoteVentas()"  class="button is-primary is-rounded is-small ">Enviar a generar</a>
          </div>
        </div>
        <div class="column is-2 has-text-centered-touch">
          <div class="ceroauto" style="text-align:center">
            <router-link to="/" class="button is-primary is-rounded is-small">
              Cancelar
            </router-link>
          </div>
        </div>
      </div>
      
      <b-table
        :data="listproductimport"
        :paginated="isPaginated"
        :per-page="perPageImportprod"
        :current-page.sync="currentPage"
        :pagination-simple="isPaginationSimple"
        :default-sort-direction="defaultSortDirection"
        :sticky-header="isPaginated"
        default-sort="">
        <template slot-scope="props">
          <b-table-column field="codigo" label="Codigo" width="40" sortable numeric>
            <span class="tag is-small">
              {{ props.row.numero }}
            </span>
            
          </b-table-column>
          <b-table-column field="Descripcion" label="FECHA" width="40" sortable >
            <span  class="tag is-success is-small">
              {{ props.row.fecha }}
            </span>
            
          </b-table-column>
          <b-table-column field="MONEDA" label="NOMBRE" width="40" sortable >
            <h6 class="subtitle is-7">
              {{ props.row.nombre }}
            </h6>
            
          </b-table-column>
          <b-table-column field="unidadMedida" label="DIRECCION" width="40" sortable >
            <h6 class="subtitle is-7">
              {{ props.row.direccion }}
            </h6>           
          </b-table-column>
          <b-table-column field="tipoAfectacion" label="EMAIL" width="40" sortable is-small>
            {{ props.row.email }}
          </b-table-column>
          <b-table-column field="valorVentaConIgv" centered label="MONEDA" width="40" sortable numeric>
            <h6 class="subtitle is-7">
              {{ props.row.moneda }}
            </h6>            
          </b-table-column>
          <b-table-column field="valorVentaSinIgv" label="MONTO" width="40" sortable numeric>
            {{ props.row.monto }}
          </b-table-column>
          <b-table-column field="valorVentaSinIgv" label="IGV" width="40" sortable numeric>
            {{ props.row.igv }}
          </b-table-column>
          <b-table-column field="valorVentaSinIgv" label="GRAVADA" width="40" sortable numeric>
            {{ props.row.gravada }}
          </b-table-column>
          <b-table-column field="valorVentaSinIgv" label="EXONERADA" width="40" sortable numeric>
            {{ props.row.exonerada }}
          </b-table-column>
          <b-table-column field="valorVentaSinIgv" label="DESCRIPCION" width="40" sortable >
            <h6 class="subtitle is-7">
              {{ props.row.descripcion }}
            </h6>
            
          </b-table-column>
          <b-table-column field="valorVentaSinIgv" label="ESTADO" centered width="40" sortable :class="[{'is-success': props.row.estado === 'GENERADO' },
                                                                                              {'is-primary': props.row.estado === 'EXISTE' },
                                                                                              {'is-danger': props.row.estado === 'ERROR' } ]" >
            {{ props.row.estado }}
          </b-table-column>
        </template>
      </b-table>
      
      <!--//MODAL ANULAR-->
      
            <!--//MODAL PDF-->
      
    </div>
</template>


<script>

import FiltrosMixin from "./Mixins/FiltrosMixin";
import { mapGetters } from "vuex";
import dateformat from "dateformat";
import ApiMixin from "./Mixins/ApiMixin";
import { required } from "vuelidate/lib/validators";
import JsonExcel from "vue-json-excel";

import Methods from "../../../api/methods";

const endPoint = __API__;
import axiosInterval from 'axios'

axiosInterval.defaults.baseURL=endPoint

import Util from  '../../../util'

export default {
  mixins: [FiltrosMixin, ApiMixin],
  components: { downloadExcel: JsonExcel },
  data() {
    return {
      filename:'',
      fileinput:null,
      listproductimport:[],
      isPaginated: true,
      estadoproductos:true,
      estadomasivo:'PENDIENT',
      currentPage: 1,
      cargamasiva_numero: 0,
      vuelines:[],
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPageImportprod:10,
      showAllData:0,
      defaultOpenedDetails: [],
      isModalAnular: false,
      isModalEnvioCorreo: false,

    //PAGINACION
      searchOptions: {perPage: 10, pageNumber: 1},
      total: 0,
      totalDetalles: 0,
      defaultSortOrder: 'desc',

    };
  },
  validations: {
    
  },
  methods: {
    
    obtenerSiguienteNumero() {     
        const url = `api/siguienteNumero/03/B001`
        Methods.doGet(this, url).then(numero => {
          console.log(numero)
          this.cargamasiva_numero = numero
        })         
      },
    async enviarLoteVentas() {
      var comp = {}
      for(var i=0; i< this.listproductimport.length; i++){
        comp = {}
        var bol = this.listproductimport[i]
        if(parseInt(bol.numero)<parseInt(this.cargamasiva_numero)){

          this.listproductimport[i].estado = 'EXISTE'
          continue
        }
        
        comp = {
          'numero_i': i,
          'cliente_denominacion': bol.nombre,
          'cliente_direccion': bol.direccion,
          'cliente_email': bol.email,
          'cliente_tipo_documento': '0',
          'cliente_numero_documento': '0',
          'detraccion':'N',
          'documento_tipo_comprobante': '03',
          'documento_fecha_emision': (bol.fecha).substring(0,10),
          'documento_hora_emision': (bol.fecha).substring(11,19),
          'documento_numero':parseInt(bol.numero),
          'documento_serie': 'B001',
          'documento_tipo_moneda': bol.moneda,
          'importe_total': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.monto) : parseFloat(bol.exonerada), 
          'items': [{
            'cantidad': 1,
            'descripcion': bol.descripcion,
            'igv': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.igv) : null,
            'inc_igv': false,
            'monto_base_igv': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.gravada) : null,
            'porcentaje_igv': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.igv) : null,
            'precio_total': parseFloat(bol.monto),
            'precio_venta_unitario': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.monto) : parseFloat(bol.exonerada), 
            'tipo_afectacion_igv': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? '10' : '20',
            'unidad_medida': 'NIU',
            'valor_unitario': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.gravada) : 0,
            'valor_venta': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.gravada) : parseFloat(bol.exonerada),
            'monto_base_exonerado': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? null : parseFloat(bol.exonerada),
          }],
          'tipo_operacion': '01',
          'total_igv': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.igv) : null,
          'total_venta_exoneradas': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ?  null: parseFloat(bol.exonerada),
          'total_venta_gravadas': parseFloat(bol.exonerada) == 0 || parseFloat(bol.exonerada) == null ? parseFloat(bol.gravada) : null,
        }
        const url = `api/comprobantes-pago`
        await Methods.doPost(this, url, comp).then(data => {
          console.log(data)
          console.log(comp.numero_i)
          if(data.estado){
            this.cargamasiva_numero=bol.numero
            
            this.listproductimport[comp.numero_i].estado='GENERADO'
            console.log(this.listproductimport[comp.numero_i])
          }else{
            this.listproductimport[comp.numero_i].estado='ERROR'
            console.log(this.listproductimport[comp.numero_i])
          }
          
        })
        console.log(comp)
        
        console.log(this.listproductimport[i].estado)
        setTimeout(() => console.log(bol.estado),2000);
      }
      
    },
    handleFileUpload(fileList){
        var listobj = []
        var newobj = {}
        this.filename = fileList[0].name
        this.fileinput = fileList[0]
        console.log("handle xlsx");
        var reader = new FileReader();
        reader.readAsText(fileList[0])
        reader.onload = this.loadHandler
        reader.onerror = this.errorHandler

      },
    loadHandler(event) {
      console.log("load load");
      var csv = event.target.result;
      this.processData(csv);
    },
    processData(csv) {
      console.log("proces data");
      var allTextLines = csv.split(/\r\n|\n/);
      this.vuelines = [];
      for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        var tarr = [];
        for (var j=0; j<data.length; j++) {
          tarr.push(data[j]);
        }
        this.vuelines.push(tarr);
      }
    },
    validar(){
      
      this.convertObjects()
    },
    convertObjects(){
      const tabproduct = this.vuelines
      this.obtenerSiguienteNumero()
      for(var i = 1; i<tabproduct.length;i++){
        if((this.vuelines[i][0])!=""){
          var row = (this.vuelines[i][0]).split(",")
          var producto = {}
          producto.numero=row[0]
          producto.fecha=row[1]
          producto.nombre=row[2].toUpperCase() + " " + row[3].toUpperCase()
          producto.direccion=row[4].toUpperCase()
          producto.email=row[5]
          producto.moneda=row[6]
          producto.monto=row[7]
          producto.igv=row[8]
          producto.gravada=row[9]
          producto.exonerada=row[10]
          producto.descripcion=row[11]
          producto.estado='PENDIENTE'
          this.listproductimport.push(producto)
        }
      }
      this.estadoproductos=false
      
    },
    
    finishDownload(){

    },
    startDownload(){

      this.downloadAllComprobantesTwo().then()
    },
    getNombreDocumento(value){
      return Util.getNombreDocumentoByTipo(value)
    },

    formatFechaRegistro(fecha){
      return `Este comprobante se registró el día ${this.formatDate(new Date(fecha))}`
    },

    showTooltipEstadoSunat(comp){
      if (comp.tipoComprobante == '01' || ((comp.tipoComprobante == '07' || comp.tipoComprobante == '08') && comp.tipoComprobanteAfectado == '01' ))
        return comp.mensajeRespuesta && ( comp.estadoSunat == 'ACEPT' || comp.estado=='06' || comp.estado=='05')
      else return false
    },

    
    getTipoClaseEstadoSunat(es){
      if(es == 'ACEPT')
        return 'is-success'
      if(es == 'RECHA')
        return 'is-dark'
      if(es == 'ANULA')
        return 'is-danger'
      if(es == 'N_ENV')
        return 'is-danger'

      return 'is-info'
    },

    showWith2Decimal(number){
      return parseFloat(number).toFixed(2)
    }
    

  },

  watch: {
    vuelines: function(val){
        if(val.length>0){
          this.validar()
        }
      }
    
  },

  mounted() {
    

  },

  computed: {
    ...mapGetters({ getUser: "auth/getUser" }),
    ...mapGetters({'getCompany': 'auth/getCompany'}),

    
  },
  filters:{
    nombreDocumento(value){
      return Util.getNombreDocumentoByTipo(value)
    }
  }
};
</script>
<style>
  .modalpdf > .modal-content > .card > .card-content{
    width: 940px !important;
    height: 75vh;
    overflow: hidden !important;
  }

  .modalpdf > .modal-content > .card{
    overflow: hidden !important;
    height: 81vh;
    background-color: #35363a !important;
  }
  .modalpdf > .modal-content > .card > .card-header > .card-header-title{
    color: white !important;
  }
  .modalpdf > .modal-content > .card > .card-content > embed{
    height: 68vh;
  }
  .margintop-40{
    margin-top: -40px;
  }
  .modalpdf .modal-content{
    width: 940px !important;
  }
  .ceroauto{
    margin: 0 auto;
    margin-top: 4px;
  }
  .textaligridht{
    text-align: right !important;
  }
</style>

