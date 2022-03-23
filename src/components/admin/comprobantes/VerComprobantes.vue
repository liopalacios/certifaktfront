<template>
    <div>
      <div class="columns is-multiline">

        <div class="column is-3">
          <b-field>
            <b-datepicker size="is-small"
              :date-formatter="formatDateFrom"
              v-model="filtroDesde"
              placeholder="Click para seleccionar fecha"
              icon="calendar-today">
            </b-datepicker>
          </b-field>
        </div>

        <div class="column is-3">
          <b-field>
            <b-datepicker size="is-small"
              :date-formatter="formatDateTo"
              v-model="filtroHasta"
              placeholder="Click para seleccionar fecha"
              icon="calendar-today">
            </b-datepicker>
          </b-field>
        </div>

        <div class="column is-3">
          <b-field>
            <b-select size="is-small" expanded v-model="filtroTipoComprobante">
              <option v-for="option in typeOptions"
                :value="option.value"
                :key="option.value">
                {{ option.text}}
              </option>
            </b-select>
          </b-field>
        </div>

        <div class="column is-3">
          <b-field>
            <b-input size="is-small" v-model="filtroRuc" placeholder="Filtrar por documento cliente" type="number"></b-input>
          </b-field>
        </div>

        <div class="column is-3">
          <b-field>
            <b-input size="is-small" v-model="filtroSerie" placeholder="Filtrar por serie" type="text"></b-input>
          </b-field>
        </div>

        <div class="column is-3">
          <b-field>
            <b-input size="is-small" v-model="filtroNumero" placeholder="Filtrar por número" type="number"></b-input>
          </b-field>
        </div>

        <div class="column is-3">
          <b-select size="is-small" expanded v-model="searchOptions.perPage">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </b-select>
        </div>
        <div class="column is-3">          
          <b-select size="is-small" expanded v-model="estadoSunatSelect">
            <option :value="0">Estado Sunat</option>
            <option :value="2">Aceptado</option>
            <option :value="1">Pendiente</option>
            <option :value="8">Anulado</option>
            <option :value="6">No Enviado</option>
            <option :value="5">Rechazado</option>
          </b-select>          
        </div>
        <div class="column is-6">
          <div class="columns">
            <div class="column is-3">
              <div class="ceroauto" style="text-align:center">
                <a @click="cargarComprobantes"  class="button is-primary is-rounded is-small ">Actualizar lista</a>
              </div>
            </div>
            
            <div class="column is-3 has-text-centered-touch" style="text-align:center">
              <div class="ceroauto" style="display: block;" v-if="total > 0">
                <a @click="downloadAllComprobantes()" class="button is-primary is-rounded is-small">Descargar lista</a>
              </div>
              <div class="ceroauto textaligridht" >
                <a @click="descargarComprobantes" style="display: none;" class="button is-primary is-rounded is-small ">Descarga hoja</a>
              </div>
            </div>
            <div class="column  is-3" style="text-align:center">
              <download-excel v-if="json_data.length > 0" class = "button is-primary  is-rounded is-small"
                              ref="droute"
                              :fields = "json_fields"
                              :data = "json_data"
                              type    = "csv"
                              :name = "name_report">
                Descargar CSV
              </download-excel>
              <div v-else class="ceroauto" style="text-align:center">
                <a class = "button is-success is-rounded is-small" @click="cargarComprobantescsv()">Generar CSV</a>
              </div>
            </div>
            <div class="column  is-3" style="text-align:center">
              <download-excel v-if="json_data_contador.length > 0" class = "button is-primary  is-rounded is-small"
                              ref="droute"
                              :fields = "json_fields_contador"
                              :data = "json_data_contador"
                              type    = "csv"
                              :name = "name_report">
                Descagar Contador
              </download-excel>
              <div v-else class="ceroauto" style="text-align:center">
                <a class = "button is-success is-rounded is-small" @click="cargarComprobantescsvContador()">Contador CSV</a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="column is-2 has-text-centered-touch">
          <p class="title">{{total}}</p>
          <!--<p class="heading">Comprobantes</p>-->
        </div>   
        <div class="column is-3 has-text-centered-touch" v-if="userIsAdmin" >
          <div class="columns">
            <div class="column">
              <span class="tag is-info is-large">Ingresos</span>
            </div>
            <div class="column" style="padding-top: 20px">
              <div class="columns">
                <div class="column has-text-weight-bold" style="padding: 0"><p class="is-size-6">S/ {{totalsoles}}</p></div>
              </div>
              <div class="columns">
                <div class="column has-text-weight-bold" style="padding: 0"><p class="is-size-6">$ {{totaldolares}}</p></div>
              </div>
            </div>
          </div>          
          <!--<p class="heading">Comprobantes</p>-->
        </div>        
      </div>      
      <b-table
        :data="comprobantesList"
        :mobile-cards="true"
        paginated
        backend-pagination
        :total="total"
        :per-page="searchOptions.perPage"
        @page-change="onPageChange"
        :current-page="searchOptions.pageNumber"
        detailed
        detail-key="idPaymentVoucher"
        :opened-detailed="defaultOpenedDetails"
        @details-open="(row, index) => this.consultarProducto(`${row.idPaymentVoucher}`)"
        
        >
        
        <template slot-scope="props">
          <b-table-column  label="Fecha"  class="is-size-7">
            <b-tooltip :label="formatFechaRegistro(props.row.fechaRegistro)">
             <span>
              {{ props.row.fechaEmision }}  

            </span>
            </b-tooltip>

          </b-table-column>
          <b-table-column  label="Tipo"  class="is-size-7">
            <b>{{ props.row.tipoComprobante | nombreDocumento }} <span v-if="props.row.ublVersion">{{props.row.ublVersion}}</span> <span v-else>2.0</span></b>
          </b-table-column>
          <b-table-column  label="Número"  class="is-size-7">
           <span v-if="props.row.tipoComprobante=='07' || props.row.tipoComprobante=='08'">
              <b-tooltip :label="`Comprobante afectado: ${getNombreDocumento(props.row.tipoComprobanteAfectado)} ${props.row.serieAfectado}-${props.row.numeroAfectado}`">
              <span>
                 {{props.row.serie}}-{{props.row.numero}}
              </span>
            </b-tooltip>
           </span>
            <span v-else>
               {{props.row.serie}}-{{props.row.numero}}
            </span>
          </b-table-column>
          <b-table-column  label="Receptor"  class="is-size-7">
            {{ props.row.numDocIdentReceptor }} - {{ props.row.denominacionReceptor }}
          </b-table-column>
          <b-table-column  label="Monto total"  class="is-size-7">
            {{ props.row.codigoMoneda }} <span class="has-text-weight-bold">{{ showWith2Decimal(props.row.montoImporteTotalVenta) }}</span>
          </b-table-column>
          <b-table-column  label="Estado PSE"  class="is-size-7">
            {{ props.row.estado | FiltroEstComprobante }}
          </b-table-column>

          <b-table-column  label="Estado SUNAT"  class="is-size-7">

            <button @click="accionEnviarComprobanteSunat(props.row)" :disabled="isDisabledButtonPendiente(props.row)" v-if="props.row.estado == '01' || props.row.estado == '07' || props.row.estado == '09'" class="button is-default is-small">
              <b-icon
                size="is-small"
                pack="fas"
                icon="sync-alt"
                custom-class="fa-spin">
              </b-icon>
              <span>Pendiente</span>
            </button>

            <span v-else>
            <b-tooltip v-if="showTooltipEstadoSunat(props.row)"
              :label="props.row.mensajeRespuesta"
              multilined>
              <b-tag :type="getTipoClaseEstadoSunat(props.row.estadoSunat)"> {{ props.row.estadoSunat | FiltroEstSunat }}</b-tag>
            </b-tooltip>
              <span v-else>
                <b-tag :type="getTipoClaseEstadoSunat(props.row.estadoSunat)"> {{ props.row.estadoSunat | FiltroEstSunat }}</b-tag>
              </span>
                </span>
          </b-table-column>
          <b-table-column  label="Opciones" >
            <b-dropdown>
              <button class="button is-small is-dark is-outlined" slot="trigger">
                <span>Opciónes</span>
                <b-icon icon="menu-down"></b-icon>
              </button>
              <b-dropdown-item @click="descargarPDFA4(props.row.rucEmisor ,props.row.tipoComprobante , props.row.serie, props.row.numero)">PDF</b-dropdown-item>
              <b-dropdown-item @click="descargarXML(props.row)">XML</b-dropdown-item>
              <b-dropdown-item :disabled="props.row.estadoSunat!='ACEPT' && props.row.estadoSunat!='ANULA'" @click="descargarCDR(props.row)">CDR</b-dropdown-item>
              <b-dropdown-item v-if="props.row.estadoSunat=='ANULA' && props.row.tipoComprobante=='01'" @click="descargarCDRBaja(getUser.ruc, props.row.identificadorBaja)">CDR Baja</b-dropdown-item>
              <b-dropdown-item @click="descargarPDF(props.row.tipoComprobante, props.row.serie, props.row.numero)">Ticket</b-dropdown-item>
              <b-dropdown-item :disabled="props.row.estadoSunat=='ANULA'" @click="prepararEnvioCorreo(props.row.idPaymentVoucher,props.row.emailReceptor)">Enviar por correo</b-dropdown-item>
              <b-dropdown-item :disabled="props.row.tipoComprobante=='07' || props.row.tipoComprobante=='08' || props.row.estadoSunat!='ACEPT'" @click="generarNotaCredito(props.row.idPaymentVoucher)">Nota de crédito</b-dropdown-item>
              <b-dropdown-item :disabled="props.row.tipoComprobante=='07' || props.row.tipoComprobante=='08' || props.row.estadoSunat!='ACEPT'" @click="generarNotaDebito(props.row.idPaymentVoucher)">Nota de débito</b-dropdown-item>
              <b-dropdown-item :disabled="disabledEditar(props.row)" @click="editVoucher(props.row)">Editar</b-dropdown-item>
              <b-dropdown-item :disabled="disabledAnular(props.row)" @click="editAnular(props.row)">Anular</b-dropdown-item>
            </b-dropdown>
          </b-table-column>
        </template>
        <template slot="detail" slot-scope="props">
          <div>
            <div class="box">
              <h3 class="title is-5">Items</h3>
           
              <div class="box">
                <b-table
                  :data="detailsPaymentVouchersTable"
                  :bordered="false"
                  :striped="false"
                  :narrowed="true"
                  :hoverable="true"
                  :mobile-cards="false"
          
                  >
                  
                  <template slot-scope="propsDetails">
                    
                    <b-table-column label="Descripción">
                      {{ propsDetails.row.descripcion }}
                    </b-table-column>
                    <b-table-column label="Unidad">
                      {{propsDetails.row.codigoUnidadMedida}}
                    </b-table-column>
                    <b-table-column label="Cantidad">
                      {{ propsDetails.row.cantidad }}
                    </b-table-column>
                    <b-table-column label="Precio unitario">
                      {{ parseFloat(propsDetails.row.precioVentaUnitario).toFixed(2) }}
                    </b-table-column>
                           <b-table-column label="Descuento">
                      {{ parseFloat(propsDetails.row.descuento?propsDetails.row.descuento:0).toFixed(2) }}
                    </b-table-column>
                    <b-table-column label="Total">
                      {{ parseFloat(propsDetails.row.valorVenta + propsDetails.row.afectacionIGV).toFixed(2) }}
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
                        <p>Sin items.</p>
                      </div>
                    </section>
                  </template>
                </b-table>
              </div>
              <h3 class="title is-5">Totales <strong>{{props.row.codigoMoneda}}</strong></h3>
              <div class="box">
              <p><strong>ANTICIPOS:</strong> {{  props.row.totalMontoAnticipos  | TwoDecimals}}</p>
                <p><strong>OTROS CARGOS:</strong> {{props.row.montoSumatorioOtrosCargos | TwoDecimals}}</p>
                <p><strong>DESCUENTO TOTAL:</strong> {{props.row.totalDescuento | TwoDecimals}}</p>
                <p><strong>GRAVADA:</strong> {{props.row.totalValorVentaOperacionGravada | TwoDecimals}}</p>
                <p><strong>EXONERADA:</strong> {{props.row.totalValorVentaOperacionExonerada | TwoDecimals}}</p>
                <p><strong>INAFECTA:</strong> {{props.row.totalValorVentaOperacionInafecta | TwoDecimals}}</p>
                <p><strong>GRATUITA:</strong> {{props.row.totalValorVentaOperacionGratuita | TwoDecimals}}</p>
                <p><strong>IGV:</strong> {{props.row.sumatoriaIGV | TwoDecimals}}</p>
                 <p><strong>ISC:</strong> {{props.row.sumatoriaISC | TwoDecimals}}</p>
                <p><strong>TOTAL:</strong> {{props.row.montoImporteTotalVenta | TwoDecimals}}</p>
             </div>
            </div>
          </div>
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
              <p>Ningún comprobante.</p>
            </div>
          </section>
        </template>
      </b-table>
      <!--//MODAL ANULAR-->
      <b-modal :active.sync="isModalAnular" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="delete-sweep"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;"> {{title}}</span>
            </p>
          </div>
          <div class="card-content">
            <b-field  label="Motivo de anulación"
                      :type="$v.motivo.$error?'is-danger':'Motivo invalido'"
                      :message="$v.motivo.$error?(!$v.motivo.required?'Motivo requerido':''):''">
              <b-input v-model="$v.motivo.$model" type="textarea"></b-input>
            </b-field>
            <button  @click="anular()" block class="button is-danger is-rounded is-fullwidth">Anular</button>
          </div>
        </div>
      </b-modal>
      <b-modal :active.sync="isModalEnvioCorreo" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="delete-sweep"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;"> Enviar comprobante por correo</span>
            </p>
          </div>
          <div class="card-content">
            <form @submit.prevent="enviarCorreo">
              <b-field  label="Email">
                <b-input v-model="mailSender.emailToSend" required></b-input>
              </b-field>
              <button   type="submit" class="button is-info is-rounded is-fullwidth">Enviar</button>
            </form>
          </div>
        </div>
      </b-modal>
      <!--//MODAL PDF-->
      <b-modal  :active.sync="isModalPdf" class="modalpdf" width="960" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
              <span><b-icon
               icon="printer"
               size="is-small">
              </b-icon></span> <span style="margin-left: 10px;">Imprime o descarga tu comprobante</span>
            </p>
          </div>
          <div class="card-content">
            <embed type="application/pdf" :src="urlPDF" width="100%" height="68vh" alt="pdf"
                   pluginspage="http://www.adobe.com/products/acrobat/readstep2.html">
          </div>
        </div>
      </b-modal>
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
      totalsoles: 0,
      totaldolares: 0, 
      detailsPaymentVouchersTable: [],
      idPaymentDetail: null,
      isPaginated: true,      
      currentPage: 1,      
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPageImportprod:10,
      showAllData:0,
      defaultOpenedDetails: [],
      isModalAnular: false,
      isModalEnvioCorreo: false,

      //MODAL VER PDF
      isModalPdf: false,
      urlPDF: null,

      urlXLS: null,

      //DATA
      comprobantesList: [],
      motivo: null,
      title: null,
      dataModal: {},

      //ENVIO DE CORREO
      mailSender: {},

      //Construcción de excel
      json_fields: {
        'Complete name': 'name',
        'Date': 'date',
      },
      json_fields_contador: {
        'Complete name': 'name',
        'Date': 'date',
      },
      data:[],
      json_data: [],
      json_data_contador: [],
      name_report: '',
      estadoSunatSelect: 0,
    //PAGINACION
      searchOptions: {perPage: 10, pageNumber: 1},
      total: 0,
      totalDetalles: 0,
      defaultSortOrder: 'desc',


      //INTERVAL CONSULTA COMPROBANTES
      intervalId: null
    };
  },
  validations: {
    motivo: {
      required
    }
  },
  methods: {
    async fetchData(){

      this.downloadAllComprobantesTwo().then()
      return this.json_data;
    },    
    consultarProducto(value){
      this.idPaymentDetail = value
      this.detailsPaymentVouchersTable = []
      this.cargarComprobantesDetalle().then();
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

    disabledEditar(comprobante){
      if (comprobante.estadoSunat == 'ANULA') return true
      if (comprobante.tipoComprobante == '01' && comprobante.estadoSunat == 'ACEPT') return true
      if (comprobante.estado == '09' || comprobante.estado == '07' || comprobante.estado == '05' || comprobante.estado == '06') return true
      if (comprobante.tipoComprobante == '03' && comprobante.estadoSunat == 'ACEPT') return true


      if (comprobante.tipoComprobante == '07' && comprobante.estadoSunat == 'ACEPT' && comprobante.tipoComprobanteAfectado == '01') return true
      if (comprobante.tipoComprobante == '08' && comprobante.estadoSunat == 'ACEPT' && comprobante.tipoComprobanteAfectado == '01') return true

      if (comprobante.tipoComprobante == '07' && comprobante.estadoSunat == 'ACEPT' && comprobante.tipoComprobanteAfectado == '03') return true
      if (comprobante.tipoComprobante == '08' && comprobante.estadoSunat == 'ACEPT' && comprobante.tipoComprobanteAfectado == '03') return true

      if (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '03') return false
      if (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '03') return false

      return false
    },


    disabledAnular(comprobante){

      //BOLETA Y FACTU
      if (comprobante.estadoSunat == 'ANULA') return true

      //FAC
      if (comprobante.tipoComprobante == '01' && comprobante.estadoSunat != 'ACEPT') return true
      if (comprobante.tipoComprobante == '07' && comprobante.estadoSunat != 'ACEPT' && comprobante.tipoComprobanteAfectado == '01') return true
      if (comprobante.tipoComprobante == '08' && comprobante.estadoSunat != 'ACEPT' && comprobante.tipoComprobanteAfectado == '01') return true
      var hoy = new Date();
      var emi = new Date(dateformat(comprobante.fechaEmision,"yyyy-mm-dd"));
      let resta = hoy.getTime() - emi.getTime()

      if (comprobante.tipoComprobante == '01' || comprobante.tipoComprobante == '03'){
        if((resta/ (1000*60*60*24))>9 ) return true;
      }
      
      
      //BOL
      if (comprobante.tipoComprobante == '03' && comprobante.estadoSunat != 'ACEPT') return true
      if (comprobante.tipoComprobante == '03') return false
      if (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '03') return false
      if (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '03') return false
      
      return false
    },


    isDisabledButtonPendiente(comprobante){

      if (comprobante.tipoComprobante == '01' && comprobante.estado != '01') return true

      if (comprobante.tipoComprobante == '03' && comprobante.estado != '01' && comprobante.estado != '09') return true

      if (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '01' && comprobante.estado != '01') return true

      if (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '03' && comprobante.estado != '01' && comprobante.estado != '09') return true

      if (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '01' && comprobante.estado != '01') return true

      if (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '03' && comprobante.estado != '01' && comprobante.estado != '09') return true


    },

    accionEnviarComprobanteSunat(comprobante){
      var hoy = new Date();
      console.log(comprobante.fechaRegistro)
      var emi = new Date(comprobante.fechaRegistro);
      console.log(emi)
      let resta = hoy.getTime() - emi.getTime()
      console.log(hoy.getTime())
      console.log(emi.getTime())
      console.log(resta)
      console.log(resta/(100*60*60))
      if((resta/ (1000*60*60)) > 5 && comprobante.tipoComprobante=="01"){
          if (comprobante.estado == '01'){
              console.log('Entro aqui')
              this.enviarComprobanteASunat(comprobante)
              return;
          }
      }

      if (comprobante.tipoComprobante == '01' || (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '01') || (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '01')) {

        if (this.envioAutomaticoSunat)
        {
          this.$buefy.toast.open({
            message: "Este comprobante ya se encuentra en proceso de envío a Sunat."
          });

          return
        }
      }


      if (comprobante.tipoComprobante == '03' || (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '03') || (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '03')) {
        this.enviarResumenDemandaByFechaAndComprobante(comprobante)

      }

      if (comprobante.tipoComprobante == '01' || (comprobante.tipoComprobante == '07' && comprobante.tipoComprobanteAfectado == '01') || (comprobante.tipoComprobante == '08' && comprobante.tipoComprobanteAfectado == '01')) {

        if (comprobante.estado == '01'){
          this.enviarComprobanteASunat(comprobante)
        }
      }
    },

    enviarComprobanteASunat(comprobante){

      this.$buefy.dialog.confirm({
        title: "Enviar a Sunat",
        message: `¿Seguro que desea enviar a la sunat la <b>${Util.getNombreDocumentoByTipo(comprobante.tipoComprobante)}</b> ${comprobante.serie}-${comprobante.numero}?`,
        confirmText: "Enviar a Sunat",
        cancelText: "Cancelar",
        type: "is-warning",
        hasIcon: true,
        onConfirm: () => {
          const url = `api/comprobantes/enviar-sunat`
          const comprobanteRequest = {
            tipo: comprobante.tipoComprobante,
            serie: comprobante.serie,
            numero: comprobante.numero
          }
          Methods.doPost(this,url, comprobanteRequest).then(resp => {
            if (resp.estado){
              this.$buefy.toast.open({
                message: "Comprobante enviado correctamente."
              });
              this.cargarComprobantes().then();

            }
            else {
              this.$buefy.toast.open({
                message: resp.mensaje,
                type: 'is-danger'
              });
            }
          })
        }
      });

    },
    enviarResumenDemandaByFechaAndComprobante(comprobante){

      var hoy = new Date();
      var emi = new Date(dateformat(comprobante.fechaRegistro,"yyyy-mm-dd"));
      let resta = hoy.getTime() - emi.getTime()

      if((resta/ (1000*60*60*24))<1 && comprobante.tipoComprobante=="03"){
        this.$buefy.dialog.alert({
          title: 'Envio programado',
          message: 'El Comprobante se enviará por resumen diario',
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () => {
            return false
          }
        })
      }else{
        this.$buefy.dialog.confirm({
          title: "Enviar a Sunat",
          message: `¿Seguro que desea enviar a la sunat la <b>${Util.getNombreDocumentoByTipo(comprobante.tipoComprobante)}</b> ${comprobante.serie}-${comprobante.numero}, por resumen diario?`,
          confirmText: "Enviar a Sunat",
          cancelText: "Cancelar",
          type: "is-warning",
          hasIcon: true,
          onConfirm: () => {
            const url = `api/resumen-diario/${comprobante.fechaEmision}`
            const comprobanteForResumen = {
              tipo: comprobante.tipoComprobante,
              serie: comprobante.serie,
              numero: comprobante.numero
            }
            Methods.doPost(this,url, comprobanteForResumen).then(resp => {
              if (resp.estado){
                this.$buefy.toast.open({
                  message: "Comprobante enviado correctamente."
                });
                this.cargarComprobantes().then();

              }
              else{
                this.$buefy.toast.open({
                  message: resp.mensaje,
                  type: 'is-danger'
                });
              }
            })
          }
        });
      }


    },

    prepararEnvioCorreo(idPaymentVoucher, email) {
      this.mailSender.idPaymentVoucher = idPaymentVoucher;
      if (email) this.mailSender.emailToSend = email;
      this.isModalEnvioCorreo = true;
    },


    enviarCorreo() {
      const correo = this.mailSender.emailToSend;
      const url = `api/enviarCorreo/${
        this.mailSender.idPaymentVoucher
      }?email=${correo}`;
      Methods.doPost(this, url, {})
        .then(data => {
          this.$buefy.toast.open({
            message: "Correo enviado correctamente."
          });
          this.isModalEnvioCorreo = false;
          this.mailSender = {};
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: "Ocurrió un error al enviar el correo."
          });
        });
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
    },
    setIntervalUpdateEstados(){
      if (this.intervalId)
        clearInterval(this.intervalId)
      console.log(this.comprobantesList)
      console.log(this.comprobantesList.length)
      this.intervalId =  setInterval(()=>{
        if(this.comprobantesList.length>0){
          const listIdsComprobantes = []
          this.comprobantesList.forEach(com => {
            if(com.estado == '01' || com.estado == '07' || com.estado == '09'){
              listIdsComprobantes.push(com.idPaymentVoucher)
            }
          })
          if(listIdsComprobantes.length>0){
           const headers = Util.getAuthHeader();
              axiosInterval.post("api/getEstadosSunat",listIdsComprobantes, {headers}).then(res=>{
                res.data.forEach(infoEstado => {
                  this.comprobantesList.forEach( com => {
                    if(com.idPaymentVoucher == infoEstado.id){
                      com.estado = infoEstado.estado
                      com.estadoSunat = infoEstado.estadoSunat
                    }
                  })
                })
              })
          }
          else clearInterval(this.intervalId)
        }
      },5000)
    },

    cambioFiltro(){
      this.searchOptions.pageNumber=1
      this.json_data = []
      this.json_data_contador = []
      this.cargarComprobantes().then();
      
    },
    cambioRuc() {
      if (this.filtroRuc.length == 4 || this.filtroRuc.length == 0) {
        this.searchOptions.pageNumber=1
        this.cargarComprobantes().then();

      }
    },
    cambioSerie() {
      if (this.filtroSerie.length >= 4 || this.filtroSerie.length == 0){
        this.json_data = []
        this.json_data_contador = []
        this.searchOptions.pageNumber=1
        this.cargarComprobantes().then();

      }

    },

    cambioNumero() {
      this.searchOptions.pageNumber=1
      this.cargarComprobantes().then();

    },
    editAnular(valores) {
      this.isModalAnular = true;
      this.dataModal = {
        fecha: dateformat(new Date(), "yyyy-mm-dd"),
        ruc: this.getUser.ruc,
        numero: valores.numero,
        serie: valores.serie,
        tipoComprobante: valores.tipoComprobante
      };

      if (valores.tipoComprobante == '07' || valores.tipoComprobante == '08' )
        this.dataModal.tipoComprobanteRelacionado = valores.tipoComprobanteAfectado

      this.title = `Anulación Comprobante: ${this.dataModal.serie}-${this.dataModal.numero}`;
    },

    editVoucher(voucher){

      if (voucher.tipoComprobante == '01')
        this.$router.push({name: 'admin.comprobantes.editar-factura', params: {idEdit: voucher.idPaymentVoucher}})
      if (voucher.tipoComprobante == '03')
        this.$router.push({name: 'admin.comprobantes.editar-boleta', params: {idEdit: voucher.idPaymentVoucher}})
      if (voucher.tipoComprobante == '07')
        this.$router.push({name: 'admin.comprobantes.editar-nota-credito', params: {idEdit: voucher.idPaymentVoucher}})
      if (voucher.tipoComprobante == '08')
        this.$router.push({name: 'admin.comprobantes.editar-nota-debito', params: {idEdit: voucher.idPaymentVoucher}})

    },

    anular() {
      this.$v.$touch();
      if (!this.$v.$error) {
        this.isModalAnular = false;

        this.$buefy.dialog.confirm({
          title: "Confirmar anulación",
          message: "¿Seguro que desea anular este documento?",
          confirmText: "Confirmar",
          cancelText: "Cancelar",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.guardarAnulacion()
        });
      }
    },
    guardarAnulacion() {
      this.anularComprobante(
        this.dataModal.fecha,
        this.dataModal.ruc,
        this.dataModal.numero,
        this.dataModal.serie,
        this.dataModal.tipoComprobante,
        this.motivo,
        this.dataModal.tipoComprobanteRelacionado
      ).then(data => {
        this.$buefy.toast.open({
          message: data.mensaje
        })
        this.motivo = "";
        this.cargarComprobantes().then();
      });
    },
    generarNotaCredito(id) {
      this.$router.push({
        name: "admin.comprobantes.emitir-nota-credito",
        params: { id: id }
      });
    },
    generarNotaDebito(id) {
      this.$router.push({
        name: "admin.comprobantes.emitir-nota-debito",
        params: { id: id }
      });
    },


    onPageChange(page) {
      this.searchOptions.pageNumber = page
      this.cargarComprobantes().then();

    },

    onPerPageChange(){
      this.cargarComprobantes().then();

    },
    estadoSunatSelectMethod(){
      this.cargarComprobantes().then();
    }

  },

  watch: {    
    filtroDesde: "cambioFiltro",
    filtroHasta: "cambioFiltro",
    filtroTipoComprobante: "cambioFiltro",
    filtroRuc: "cambioRuc",
    filtroSerie: "cambioSerie",
    filtroNumero: "cambioNumero",
    estadoSunatSelect: "estadoSunatSelectMethod",
    'searchOptions.perPage': 'onPerPageChange'
  },

  mounted() {
    this.cargarComprobantes().then();

  },

  computed: {
    ...mapGetters({ getUser: "auth/getUser" }),
    ...mapGetters({'getCompany': 'auth/getCompany'}),

    envioAutomaticoSunat(){
      if(this.getCompany.envioAutomaticoSunat==null || this.getCompany.envioAutomaticoSunat==undefined) return true
      else return this.getCompany.envioAutomaticoSunat
    },
    userIsAdmin(){
          return this.getUser.typeUser == '01'
        }
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

