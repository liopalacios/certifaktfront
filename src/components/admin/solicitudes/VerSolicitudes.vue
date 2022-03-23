<template>
    <section>

        <div class="column is-3">
          <b-field label="Solicitudes por página">
            <b-select size="is-small" expanded v-model="searchOptions.perPage">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </b-select>
          </b-field>
        </div>
        <div class="level-item has-text-centered">
        <div >

          <p class="title">{{total}}</p>
          <p class="heading">Solicitudes</p>

        </div>
      </div>

        <b-table
            :data="excelsList"
            :mobile-cards="true"
            paginated
            backend-pagination
            :total="total"
            :per-page="searchOptions.perPage"
            @page-change="onPageChange"
            :current-page="searchOptions.pageNumber">

            <template slot-scope="props">
          <b-table-column  label="Fecha de generación"  class="is-size-7">
            {{ props.row.fechaSolicitud }}
          </b-table-column>

          <b-table-column  label="Fecha inicio"  class="is-size-7">
            {{ props.row.identificador.substr(12,10) }}
          </b-table-column>

          <b-table-column  label="Fecha fin"  class="is-size-7">
            {{ props.row.identificador.substr(23,21) }}
          </b-table-column>

          <b-table-column  label="Tipo de Documento"  class="is-size-7">
            <span v-if="props.row.tipoDocumento == '01'"><b>Facturas</b></span><span v-else-if="props.row.tipoDocumento == '03'"><b>Boleta</b></span>
            <span v-else-if="props.row.tipoDocumento == '07'">Nota de Crédito</span><span v-else-if="props.row.tipoDocumento == '08'">Nota de Débito</span>
            <span v-else>No especifica</span>
          </b-table-column>

          <b-table-column  label="Serie"  class="is-size-7">
            <span v-if="props.row.serie == ''">No especifica</span><span v-else>{{ props.row.serie }}</span>
          </b-table-column>

          <b-table-column  label="Estado de descarga"  class="is-size-7">

              <span>
                <b-tag :type="getEstadoDescarga(props.row.estadoDescarga)" v-if="props.row.estadoDescarga == 'D'" > Descargado </b-tag>
                <b-tag :type="getEstadoDescarga(props.row.estadoDescarga)" v-else-if="props.row.estadoDescarga == 'E'" > Error </b-tag>
                <b-tag :type="getEstadoDescarga(props.row.estadoDescarga)" v-else-if="props.row.estadoDescarga == 'P'" > Pendiente </b-tag>
              </span>

          </b-table-column>

          <b-table-column  label="Opciones" >
            <b-dropdown>
              <button class="button is-small is-dark is-outlined" slot="trigger">
                <span>Opciones</span>
                <b-icon icon="menu-down"></b-icon>
              </button>
              <b-dropdown-item @click="descargarExcel(props.row)">Descargar Excel</b-dropdown-item>
              <b-dropdown-item @click="prepararEnvioCorreoExcel(props.row.idExcelDocument,'')">Enviar por correo</b-dropdown-item>
            </b-dropdown>
          </b-table-column>

        </template>
        </b-table>

        <b-modal :active.sync="isModalEnvioCorreo" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="delete-sweep"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;"> Enviar excel por correo</span>
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
    </section>
</template>

<script>

    import { mapGetters } from "vuex";
    import dateformat from "dateformat";
    import ApiMixin from "./Mixins/ApiMixin";
    import { required } from "vuelidate/lib/validators";
    import JsonExcel from "vue-json-excel";

    const endPoint = __API__;
    import axiosInterval from 'axios'

    import Methods from "../../../api/methods";

    axiosInterval.defaults.baseURL=endPoint

    import Util from  '../../../util'

    export default {
        mixins: [ApiMixin],
        data() {
            return {
                data:[],
                json_data: [],
                showAllData:0,
                excelsList: [],
                isModalEnvioCorreo: false,
                isPaginated: true,
                isPaginationSimple: false,
                mailSender: {},
                paginationPosition: 'bottom',
                defaultSortDirection: 'asc',
                sortIcon: 'arrow-up',
                sortIconSize: 'is-small',
                currentPage: 1,
                perPage: 5,
                searchOptions: {perPage: 10, pageNumber: 1},
                total: 0,
                totalDetalles: 0,
                defaultSortOrder: 'desc',
            }
        },
        methods:{
            onPageChange(page) {
                this.searchOptions.pageNumber = page
                this.cargarExcels().then();
            },
            cambioFiltro(){
            this.searchOptions.pageNumber=1
            this.cargarExcels().then();
            },
            onPerPageChange(){
            this.cargarExcels().then();
            },
            getEstadoDescarga(es){
            if(es == 'D')
                return 'is-success'
            if(es == 'P')
                return 'is-dark'
            if(es == 'E')
                return 'is-danger'


            return 'is-info'
            },
            prepararEnvioCorreoExcel(idDowloadExcel, email) {
              this.mailSender.idDowloadExcel = idDowloadExcel;
              if (email) this.mailSender.emailToSend = email;
              this.isModalEnvioCorreo = true;
            },
            enviarCorreo() {
              const correo = this.mailSender.emailToSend;
              const url = `api/enviarCorreoExcel/${
                this.mailSender.idDowloadExcel
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
        },
        watch: {
            'searchOptions.perPage': 'onPerPageChange'
        },
        mounted() {
            this.cargarExcels().then();
        },
    }
</script>
