<template>
    <div>
        <div class="columns is-multiline">
          <div class="column is-6">
            <b-field>
                <b-datepicker size="is-small"
                    :date-formatter="formatDateFrom"
                    v-model="filtroDesde"
                    placeholder="Click para seleccionar fecha"
                    icon="calendar-today">
                </b-datepicker>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field>
                <b-datepicker size="is-small"
                    :date-formatter="formatDateTo"
                    v-model="filtroHasta"
                    placeholder="Click para seleccionar fecha"
                    icon="calendar-today">
                </b-datepicker>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field>
                <b-input size="is-small"
                    v-model="filtroSerie"
                    placeholder="Filtrar por serie"
                    type="text">
                </b-input>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field>
                <b-input size="is-small"
                    v-model="filtroNumero"
                    placeholder="Filtrar por numero"
                    type="number">
                </b-input>
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
            <div class="column is-3">
              <div class="ceroauto" style="text-align:center; margin-top: 30px">
                <a @click="cargarGuias"  class="button is-primary is-rounded is-small ">Actualizar lista</a>
              </div>
            </div>
        <div class="column is-12">
          <b-table
            :data="guiasList"
            :mobile-cards="true"
            paginated
            :total="total"
            backend-pagination
            detail-key="idGuiaRemision"
            :per-page="searchOptions.perPage"
            @page-change="onPageChange"
            :current-page="searchOptions.pageNumber"
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
                    <b>{{ props.row.tipoComprobante | nombreDocumento }} </b>
                </b-table-column>

                <b-table-column  label="Número"  class="is-size-7">
                    <span>
                        {{props.row.serie}}-{{props.row.numero}}
                    </span>
                </b-table-column>

                <b-table-column  label="Remitente"  class="is-size-7">
                    {{ props.row.numeroDocumentoIdentidadRemitente }} - {{ props.row.denominacionRemitente }}
                </b-table-column>

                <b-table-column  label="Destinatario"  class="is-size-7">
                    {{ props.row.numeroDocumentoIdentidadDestinatario }} - {{ props.row.denominacionDestinatario }}
                </b-table-column>

                <b-table-column  label="Peso"  class="is-size-7">
                    {{ props.row.unidadMedidaPesoBruto }} <span class="has-text-weight-bold">{{ props.row.pesoTotalBrutoBienes }}</span>
                </b-table-column>

                <b-table-column  label="Estado PSE"  class="is-size-7">
                    {{ props.row.estado | FiltroEstComprobante }}
                </b-table-column>

                <b-table-column  label="Estado SUNAT"  class="is-size-7">

                    <button @click="accionEnviarGuiaSunat(props.row)" :disabled="isDisabledButtonPendiente(props.row)" v-if="props.row.estado == '01' || props.row.estado == '07' || props.row.estado == '09'" class="button is-default is-small">
                    <b-icon
                        size="is-small"
                        pack="fas"
                        icon="sync-alt"
                        custom-class="fa-spin">
                    </b-icon>
                    <span>Pendiente</span>
                    </button>

                    <span v-else>
                        <b-tooltip v-if="showTooltipEstadoSunat(props.row)" :label="props.row.mensajeRespuesta" multilined>
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
                        <b-dropdown-item @click="descargarPDFGUIA(props.row.rucEmisor , props.row.serie, props.row.numero)">PDF</b-dropdown-item>
                        <b-dropdown-item @click="descargarPDFGUIATicket(props.row.rucEmisor , props.row.serie, props.row.numero)">Ticket</b-dropdown-item>
                        <b-dropdown-item @click="descargarXMLGuia(props.row)">XML</b-dropdown-item>
                        <b-dropdown-item :disabled="disabledEditar(props.row)" @click="editGuia(props.row)">Editar</b-dropdown-item>
                        <b-dropdown-item :disabled="props.row.estadoEnSunat!='ACEPT' && props.row.estadoEnSunat!='ANULA'" @click="descargarCDRGuia(props.row)">CDR</b-dropdown-item>
                        <b-dropdown-item :disabled="disabledAnular(props.row)" @click="anularGuia(props.row)">Anular</b-dropdown-item>
                        <b-dropdown-item @click="generarFactura(props.row.idGuiaRemision)">Factura</b-dropdown-item>
                        <b-dropdown-item :disabled="props.row.estadoEnSunat!='ACEPT'" @click="generarBoleta(props.row.idGuiaRemision)">Boleta</b-dropdown-item>
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
        </div>
        </div>
        <!--//MODAL PDF-->
        <b-modal  :active.sync="isModalPdf" class="modalpdf" :width="960" >
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
    </div>
</template>
<script>
import FiltrosMixin from "../comprobantes/Mixins/FiltrosMixin";
import ApiMixin from "../comprobantes/Mixins/ApiMixin";
import qs from "qs";
import { mapGetters } from "vuex";
import dateformat from "dateformat";
import validationsMixin from '../../../validations/index'
import Methods from "../../../api/methods";
import { required } from "vuelidate/lib/validators";
import Util from  '../../../util'
const endPoint = __API__;
import axiosInterval from 'axios'
axiosInterval.defaults.baseURL=endPoint

export default {
    mixins: [validationsMixin, FiltrosMixin, ApiMixin],
    data(){
        return {
            searchOptions: {perPage: 10, pageNumber: 1},
            total: 0,
            isModalPdf: false,
            isModalAnular: false,
            motivo: null,
            urlPDF: null,
            guiasList: [],
            intervalId: null
        }
    },
    validations: {
    motivo: {
      required
    }
    },
    methods: {
        formatFechaRegistro(fecha){
            return `La guía se registró el día ${this.formatDate(new Date(fecha))}`
        },
        isDisabledButtonPendiente(comprobante){

            if (comprobante.estado != '01' && comprobante.estado != '09') return true

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
        generarFactura(id) {
        this.$router.push({
            name: "admin.comprobantes.emitir-factura-guia",
            params: { idGuia: id }
        });
        },
        
        generarBoleta(id) {
        this.$router.push({
            name: "admin.comprobantes.emitir-boleta-guia",
            params: { idGuia: id }
        });
        },
        editGuia(voucher){
            this.$router.push({name: 'admin.guiaRemision.editar-guia', params: {idEdit: voucher.idGuiaRemision}})
        },
        anularGuia(voucher){
            this.$router.push({name: 'admin.guiaRemision.anular-guia', params: {idAnula: voucher.idGuiaRemision}})
        },
        showTooltipEstadoSunat(comp){
        if (comp.estado == '02' || comp.estado == '05' )
            return true
        else return false
        },
        accionEnviarGuiaSunat(comprobante){
            var hoy = new Date();
            console.log(comprobante.fechaRegistro)
            var emi = new Date(comprobante.fechaRegistro);
            console.log(emi)
            let resta = hoy.getTime() - emi.getTime()
            console.log(hoy.getTime())
            console.log(emi.getTime())
            console.log(resta)
            console.log(resta/(100*60*60))

            if((resta/ (1000*60*60)) > 5){
                if (comprobante.estado == '01'){
                    this.enviarGuiaASunat(comprobante)
                    return;
                }
            }

            if (this.envioAutomaticoSunat)
            {
                this.$buefy.toast.open({
                    message: "Este comprobante ya se encuentra en proceso de envío a Sunat."
                });
                return
            }

            if (comprobante.estado == '01'){
                this.enviarGuiaASunat(comprobante)
            }

        },
        enviarGuiaASunat(comprobante){

            this.$buefy.dialog.confirm({
                title: "Enviar a Sunat",
                message: `¿Seguro que desea enviar a la sunat la guía ${comprobante.serie}-${comprobante.numero}?`,
                confirmText: "Enviar a Sunat",
                cancelText: "Cancelar",
                type: "is-warning",
                hasIcon: true,
                onConfirm: () => {
                const url = `api/guia-remision/enviar-sunat`
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
                    this.cargarGuias().then();

                    }
                    else {
                    this.$buefy.toast.open({
                        message: resp.mensaje,
                        type: 'is-danger'
                    });
                    }
                })
                this.cargarGuias().then();
                }
                
            });

            },

            disabledEditar(comprobante){
                if (comprobante.estadoEnSunat == 'ANULA') return true
                if (comprobante.estadoEnSunat == 'ACEPT') return true
                if (comprobante.estado == '09' || comprobante.estado == '07' || comprobante.estado == '05' || comprobante.estado == '06') return true

                return false
            },
        cargarGuias() {

            if (!this.searchOptions.perPage){
                this.$buefy.toast.open({
                    duration: 5000,
                    message: `Ingrese el número de comprobantes por página.`,
                    position: 'is-bottom',
                    type: 'is-danger'
                })
                return false;
            }

            return new Promise((resolve, reject) => {
                console.log(this.searchOptions.pageNumber)
                console.log(this.searchOptions.perPage)
                const params = qs.stringify({
                    filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
                    filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
                    filtroSerie: this.filtroSerie,
                    filtroNumero: this.filtroNumero,
                    pageNumber: this.searchOptions.pageNumber,
                    perPage: this.searchOptions.perPage
                })

                const url = `api/guia-remision?${params}`
                Methods.doGet(this, url).then(data => {
                    console.log(data);
                    this.guiasList = data.guiasList.content
                    this.total = data.total
                    resolve(data)
                    this.setIntervalUpdateEstados()
                }).catch(error=>{
                    this.guiasList=[]
                    this.total = 0
                    reject(error)
                })
            })
        },

        setIntervalUpdateEstados(){
            if (this.intervalId)
                clearInterval(this.intervalId)

            this.intervalId =  setInterval(()=>{
                if(this.guiasList.length>0){
                const listIdsGuias = []
                this.guiasList.forEach(guia => {
                    if(guia.estado == '01' || guia.estado == '07' || guia.estado == '09'){
                    listIdsGuias.push(guia.idGuiaRemision)
                    }
                })
                if(listIdsGuias.length>0){
                const headers = Util.getAuthHeader();
                   /* axiosInterval.post("api/getEstadosSunatGuias",listIdsGuias, {headers}).then(res=>{
                        console.log(res);
                        res.data.forEach(infoEstado => {
                        this.guiasList.forEach( guia => {
                            if(guia.idGuiaRemision == infoEstado.id){
                            guia.estado = infoEstado.estado
                            guia.estadoEnSunat = infoEstado.estadoSunat
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
            this.json_data = []
            this.cargarGuias().then();
        },

        onPageChange(page) {
            this.searchOptions.pageNumber = page
            this.cargarGuias().then();
        },

        onPerPageChange(){
            this.cargarGuias().then();
        },
        descargarPDFGUIA(rucEmisor, serie, numero) {
            const nameFile = `${rucEmisor}-${serie}-${numero}.pdf`;
            const url = `api/descargapdf-Guia/${serie}/${numero}`
            Methods.doGetGetBlob(this, url).then(data=>{
                this.isModalPdf = true
                this.urlPDF = data
            })
        },
        descargarPDFGUIATicket(rucEmisor, serie, numero) {
            const nameFile = `${rucEmisor}-${serie}-${numero}.pdf`;
            const url = `api/descargapdf-Guia-Ticket/${serie}/${numero}`
            Methods.doGetGetBlob(this, url).then(data=>{
                this.isModalPdf = true
                this.urlPDF = data
            })
        },
        descargarXMLGuia(invoice) {
          const url = `api/descargaxmluuidguia/${invoice.idGuiaRemision}/${invoice.uuid}/${invoice.identificadorDocumento}`
          Methods.doGetDonwload(this, url, `${invoice.identificadorDocumento}.zip`).then()
        },
        descargarCDRGuia(invoice) {
          const url = `api/descargacdruuidguia/${invoice.idGuiaRemision}/${invoice.uuid}/${invoice.identificadorDocumento}`
          Methods.doGetDonwload(this, url, `${invoice.identificadorDocumento}.zip`).then()
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

        this.title = `Anulación Comprobante: ${this.dataModal.serie}-${this.dataModal.numero}`;
        },
        disabledAnular(guia){
            if (guia.estadoEnSunat == 'ANULA') return true

            if (guia.tipoComprobante == '09' && guia.estadoEnSunat != 'ACEPT') return true

            return false
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
            this.dataModal.tipoComprobanteRelacionado,
            console.log(this.dataModal.fecha,this.dataModal.ruc,this.dataModal.numero,this.dataModal.serie,this.dataModal.tipoComprobante,this.dataModal.tipoComprobanteRelacionado)
        ).then(data => {
            this.$buefy.toast.open({
            message: data.mensaje
            })
            this.motivo = "";
            this.cargarGuias().then();
        });
        },

    },
    mounted() {
        this.cargarGuias().then();
    },
    computed: {
        ...mapGetters({ getUser: "auth/getUser" }),
        ...mapGetters({'getCompany': 'auth/getCompany'}),

        envioAutomaticoSunat(){
        if(this.getCompany.envioAutomaticoSunat==null || this.getCompany.envioAutomaticoSunat==undefined) return true
        else return this.getCompany.envioAutomaticoSunat
        },
    },
    watch:{
        filtroDesde: "cambioFiltro",
        filtroHasta: "cambioFiltro",
        'searchOptions.perPage': 'onPerPageChange'
    },
    filters:{
        nombreDocumento(value){
        return Util.getNombreDocumentoByTipo(value)
        }
    }
}
</script>
