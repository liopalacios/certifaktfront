<template>
  <div>
    <div class="columns is-multiline">

      <div class="column is-4">
        <b-field>
          <b-datepicker size="is-small"
                        :date-formatter="formatDateFrom"
                        v-model="filtroDesde"
                        placeholder="Click para seleccionar fecha"
                        icon="calendar-today">
          </b-datepicker>
        </b-field>
      </div>

      <div class="column is-4">
        <b-field>
          <b-datepicker size="is-small"
                        :date-formatter="formatDateTo"
                        v-model="filtroHasta"
                        placeholder="Click para seleccionar fecha"
                        icon="calendar-today">
          </b-datepicker>
        </b-field>
      </div>

      <div class="column is-4">
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

      <div class="column is-4">
        <b-field>
          <b-input size="is-small" v-model="filtroRuc" placeholder="Filtrar por documento cliente" type="number"></b-input>
        </b-field>
      </div>

      <div class="column is-4">
        <b-field>
          <b-input size="is-small" v-model="filtroSerie" placeholder="Filtrar por serie" type="text"></b-input>
        </b-field>
      </div>

      <div class="column is-4">
        <b-field>
          <b-input size="is-small" v-model="filtroNumero" placeholder="Filtrar por número" type="number"></b-input>
        </b-field>
      </div>

      <div class="column is-3">
        <b-field label="Comprobantes por página">
          <b-select size="is-small" expanded v-model="searchOptions.perPage">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </b-select>
        </b-field>


      </div>

    </div>

    <a @click="cargarComprobantes" class="button is-primary is-rounded is-small">Actualizar lista</a>

    <b-table
      :data="comprobantesList"
      :mobile-cards="true"
      paginated
      backend-pagination
      :total="total"
      :per-page="searchOptions.perPage"
      @page-change="onPageChange"
      :current-page="searchOptions.pageNumber">

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
          {{ props.row.numeroDocumentoIdentidadReceptor }} - {{ props.row.denominacionReceptor }}
        </b-table-column>

        <b-table-column  label="Importe retenido"  class="is-size-7">
          {{ props.row.codigoMoneda }} <span class="has-text-weight-bold">{{ showWith2Decimal(props.row.importeTotalRetenidoPercibido) }}</span>
        </b-table-column>

        <b-table-column  label="Importe pagado"  class="is-size-7">
          {{ props.row.codigoMoneda }} <span class="has-text-weight-bold">{{ showWith2Decimal(props.row.importeTotalPagadoCobrado) }}</span>
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
              <b-tag :type="getTipoClaseEstadoSunat(props.row.estadoEnSunat)"> {{ props.row.estadoEnSunat | FiltroEstSunat }}</b-tag>
            </b-tooltip>
              <span v-else>
                <b-tag :type="getTipoClaseEstadoSunat(props.row.estadoEnSunat)"> {{ props.row.estadoEnSunat | FiltroEstSunat }}</b-tag>
              </span>
                </span>


        </b-table-column>
        <b-table-column  label="Opciones" >
          <b-dropdown>
            <button class="button is-small is-dark is-outlined" slot="trigger">
              <span>Opciónes</span>
              <b-icon icon="menu-down"></b-icon>
            </button>
            <b-dropdown-item @click="descargarXML(props.row)">XML</b-dropdown-item>
            <b-dropdown-item :disabled="props.row.estadoEnSunat!='ACEPT' && props.row.estadoEnSunat!='ANULA'" @click="descargarCDR(props.row)">CDR</b-dropdown-item>
            <b-dropdown-item @click="descargarPDF(props.row.tipoComprobante, props.row.serie, props.row.numero)">PDF</b-dropdown-item>
            <b-dropdown-item :disabled="props.row.estadoEnSunat=='ANULA'" @click="prepararEnvioCorreo(props.row.idOtroCPE,props.row.emailReceptor)">Enviar por correo</b-dropdown-item>
            <b-dropdown-item :disabled="disabledEditar(props.row)" @click="editVoucher(props.row)">Editar</b-dropdown-item>
          </b-dropdown>
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
              <b-input v-model="mailSender.emailToSend" required type="email"></b-input>
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
          <embed type="application/pdf" :src="urlPDF" width="100%" height="500px" alt="pdf"
                 pluginspage="http://www.adobe.com/products/acrobat/readstep2.html">
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>

  const monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Setiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];


  import { mapGetters } from "vuex";
  import dateformat from "dateformat";
  import ApiMixin from "./Mixins/ApiMixin";
  import { required } from "vuelidate/lib/validators";


  import Methods from "../../../api/methods";

  const endPoint = __API__;
  import axiosInterval from 'axios'
  //axiosInterval.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('token')}`;
  axiosInterval.defaults.baseURL=endPoint

  const fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  import Util from  '../../../util'

  export default {
    mixins: [ApiMixin],
    data() {
      return {
        filtroDesde: fromDate,
        filtroHasta: toDate,
        filtroTipoComprobante: null,
        filtroRuc: null,
        filtroSerie: null,
        filtroNumero: null,

        typeOptions: [
          { value: null, text: 'Filtrar por tipo' },
          { value: '20', text: 'Retención' },
          { value: '40', text: 'Percepción' },
        ],

        defaultOpenedDetails: [],
        isModalAnular: false,
        isModalEnvioCorreo: false,

        //MODAL VER PDF
        isModalPdf: false,
        urlPDF: null,

        //DATA
        comprobantesList: [],
        motivo: null,
        title: null,
        dataModal: {},

        //ENVIO DE CORREO
        mailSender: {},

        //PAGINACION
        searchOptions: {perPage: 10, pageNumber: 1},
        total: 0,
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

      formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `${day} de ${monthNames[monthIndex]} de ${year}`
      },
      formatDateFrom(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `Desde ${day} de ${monthNames[monthIndex]} de ${year}`
      },
      formatDateTo(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `Hasta ${day} de ${monthNames[monthIndex]} de ${year}`
      },

      getNombreDocumento(value){
        return Util.getNombreDocumentoByTipo(value)
      },

      formatFechaRegistro(fecha){
        return `Este comprobantgite se registró el día ${this.formatDate(new Date(fecha))}`
      },

      showTooltipEstadoSunat(comp){
        if (comp.tipoComprobante == '01' || ((comp.tipoComprobante == '07' || comp.tipoComprobante == '08') && comp.tipoComprobanteAfectado == '01' ))
          return comp.mensajeRespuesta && ( comp.estadoEnSunat == 'ACEPT' || comp.estado=='06')
        else return false
      },

      disabledEditar(comprobante){
        if (comprobante.estadoEnSunat == 'ANULA') return true
        if (comprobante.tipoComprobante == '20' && comprobante.estadoEnSunat == 'ACEPT') return true

        if (comprobante.tipoComprobante == '40' && comprobante.estadoEnSunat == 'ACEPT') return true

        return false
      },

      editVoucher(voucher){

      if (voucher.tipoComprobante == '20')
        this.$router.push({name: 'admin.otros-comprobantes.editar-retencion', params: {idEdit: voucher.idOtroCPE}})
      if (voucher.tipoComprobante == '40')
        this.$router.push({name: 'admin.otros-comprobantes.editar-percepcion', params: {idEdit: voucher.idOtroCPE}})
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

        if (comprobante.tipoComprobante == '20' || comprobante.tipoComprobante == '40' ) {
          if (this.envioAutomaticoSunat)
          {
            this.$buefy.toast.open({
              message: "Este comprobante ya se encuentra en proceso de envío a Sunat."
            });

            return
          }
        }

          //if (comprobante.estado == '01'){
            this.enviarComprobanteASunat(comprobante)
         // }

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
            const url = `api/othercpes/enviar-sunat`
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
          this.$dialog.alert({
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

      prepararEnvioCorreo(idOtroCPE, email) {
        this.mailSender.idOtroCPE = idOtroCPE;
        if (email) this.mailSender.emailToSend = email;
        this.isModalEnvioCorreo = true;
      },

      enviarCorreo() {
        const correo = this.mailSender.emailToSend;
        const url = `api/enviarCorreoOtherCpe/${
          this.mailSender.idOtroCPE
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

        this.intervalId =  setInterval(()=>{
          if(this.comprobantesList.length>0){
            const listIdsComprobantes = []
            this.comprobantesList.forEach(com => {
              if(com.estado == '01' || com.estado == '07' || com.estado == '09'){
                listIdsComprobantes.push(com.idOtroCPE)
              }
            })
            if(listIdsComprobantes.length>0){
              /*axiosInterval.post("api/othercpes/getEstadosSunat",listIdsComprobantes).then(res=>{
                console.log(res);
                res.data.forEach(infoEstado => {
                  this.comprobantesList.forEach( com => {
                    if(com.idOtroCPE == infoEstado.id){
                      com.estado = infoEstado.estado
                      com.estadoEnSunat = infoEstado.estadoSunat
                    }
                  })
                })
              })*/
            }
            else clearInterval(this.intervalId)
          }
        },5000)
      },

      cambioFiltro(){
        this.searchOptions.pageNumber=1
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

      }

    },

    watch: {
      filtroDesde: "cambioFiltro",
      filtroHasta: "cambioFiltro",
      filtroTipoComprobante: "cambioFiltro",
      filtroRuc: "cambioRuc",
      filtroSerie: "cambioSerie",
      filtroNumero: "cambioNumero",
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
    },
    filters:{
      nombreDocumento(value){
        return Util.getNombreDocumentoByTipo(value)
      }
    }
  };
</script>
<style>
  .modalpdf > .modal-content{
    width: 940px !important;
  }
  .modalpdf .modal-content{
    width: 940px !important;
  }
</style>

