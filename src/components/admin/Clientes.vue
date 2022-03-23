<template>
  <div class="default-container container-main">
    <h2 class="title is-4 is-spaced has-text-centered">Mantenimiento de clientes</h2>
    <b-tabs type="is-toggle-rounded" v-model="activeTab" @change="loadclient">
      <b-tab-item label="Listar" icon="receipt">
        <div class="columns">
          <div class="column">

            <b-tooltip type="is-dark" label="Agregar cliente" position="is-right">
              <button @click="mostrarCliente()" class="button is-small">
                <b-icon type="is-success" size="is-mediun" icon="plus"></b-icon>
              </button>
            </b-tooltip>

          </div>
          <div class="column">
            <b-select placeholder="Paginacion" v-model="perPagecli">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="40">75</option>
              <option value="50">100</option>
            </b-select>
          </div>
          <div class="column">
            <b-field v-if="clientes" class="rightAlig search-personal">
              <b-input placeholder="Buscador"
                       type="search"
                       v-model="searchproducto"
                       v-on:change="validateFilter"
                       icon="magnify">
              </b-input>
            </b-field>
          </div>
          <div class="column">

            <span class="button is-info is-medium is-pulled-left m-r-10">{{totalcli}}</span>
            <label class="label is-large is-pulled-left is-size-4 m-l-10"> <span> &nbsp;clientes</span></label>
          </div>
        </div>
          <b-table :data="clientes" :mobile-cards="true"
                   :loading="loading"
                   paginated
                   backend-pagination
                   :total="totalcli"
                   :per-page="perPagecli"
                   @page-change="onPageChangecli"

                   backend-sorting
                   :default-sort-direction="defaultSortOrder"
                   @sort="onSort"
          >
            <template slot-scope="props">
              <b-table-column label="Tipo de Documento">
                {{ props.row.tipoDocumento | FiltroNTipoDocumento }}
              </b-table-column>

              <b-table-column label="Numero de Documento">
                {{ props.row.numeroDocumento }}
              </b-table-column>

              <b-table-column label="Denominación">
                {{ props.row.razonSocial }}
              </b-table-column>

              <b-table-column label="Dirección">
                {{ props.row.direccionFiscal }}
              </b-table-column>

              <b-table-column label="Correo">
                {{ props.row.email }}
              </b-table-column>

              <b-table-column label="Acciones"  width="50" centered>
                <b-tooltip  type="is-dark" label="Editar"
                            position="is-left">
                  <button @click="editarCliente(props.row)" class="button is-small"><b-icon type="is-info" size="is-mediun" icon="pencil"></b-icon></button>
                </b-tooltip>
                <b-tooltip  type="is-dark" label="Eliminar"
                            position="is-left">
                  <button @click="eliminarCliente(props.row)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
                </b-tooltip>
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="emoticon-sad" size="is-large">
                    </b-icon>
                  </p>
                  <p>Ningún usuario.</p>
                </div>
              </section>
            </template>
          </b-table>
      </b-tab-item>
      <b-tab-item label="Descargar" icon="download">
        <download-excel class = "button is-success is-rounded is-small"
                        :fields = "json_fields"
                        :data="tblclients"
                        type    = "csv"
                        :name = "name_report">
          Exportar hoja de cálculo
        </download-excel>
      </b-tab-item>

      <b-tab-item label="Cargar clientes" icon="cloud">


        <div class="field">
          <div class="file is-centered is-boxed is-success has-name" v-if="estadoclientes">
            <label class="file-label">
              <a class="buttoncsv">
                <input type="file" id="file" name="resume" ref="fileinputref" accept=".csv" class="file-input" v-on:change="handleFileUpload($event.target.files)" />
                <span class="file-cta ">
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
            <label class="file-label">
              <a class="buttoncsv" href="https://certifakt.s3-us-west-2.amazonaws.com/public/Plantilla_Clientes.csv">
                <span class="file-cta buttoncsv">
                  <span>
                      <i class="fas fa-file-excel "></i>
                  </span>
                  <span class="file-label">
                      Descargar Plantilla
                  </span>
                </span>
              </a>
              <span class="file-name">

              </span>
            </label>
          </div>
          <div class="file is-centered is-boxed is-success has-name" v-if="estadoclientes">

          </div>


          <div is-centered  v-else style="text-align: center">
              <div>
                <a class="button " is-centered>
                  <span class="is-large">{{filename}}</span>
                </a>
              </div>
              <a class="button is-success" @click="sendfilecsv" is-centered>
              <span class="icon">
                <i class="fas fa-angle-double-up"></i>
              </span>
                <span>Enviar registros a la tabla clientes</span>
              </a>
              <a class="button is-danger" @click="resetfileshowfile" is-centered>
                  <span class="icon">
                    <i class="fas fa-angle-double-up"></i>
                  </span>
                <span>Cancelar carga masiva de clientes</span>
              </a>

          </div>

          <b-select v-if="!estadoclientes" placeholder="Paginacion" v-model="perPageImportcli">
            <option value="10">10</option>
            <option value="25">20</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </b-select>
          <hr/>
          <b-table
            :data="listclientimport"
            :paginated="isPaginated"
            :per-page="perPageImportcli"
            :current-page.sync="currentPage"
            :pagination-simple="isPaginationSimple"
            :default-sort-direction="defaultSortDirection"
            default-sort="">
            <template slot-scope="props">
              <b-table-column field="numeroDocumento" label="Codigo" width="40" sortable numeric>
                {{ props.row.numeroDocumento }}
              </b-table-column>
              <b-table-column field="razonSocial" label="Razón Social" width="40" sortable numeric>
                {{ props.row.razonSocial }}
              </b-table-column>
              <b-table-column field="email" label="Email" width="40" sortable numeric>
                {{ props.row.email }}
              </b-table-column>
              <b-table-column field="direccionFiscal" label="Dirección Fiscal" width="40" sortable numeric>
                {{ props.row.direccionFiscal }}
              </b-table-column>

            </template>
          </b-table>
        </div>

      </b-tab-item>
    </b-tabs>

      <!--//MODAL NUEVO-->
      <b-modal :active.sync="isModalNuevoCliente" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
              <span><b-icon
                icon="plus"
                size="is-small">
              </b-icon></span> <span style="margin-left: 10px;">Registrar cliente</span>
            </p>
          </div>
          <div class="card-content">
            <form @submit.prevent="guardarCliente">
              <div class="columns is-multiline">
                <div class="column is-6">
                  <b-field label="Tipo Documento:">
                    <b-select :disabled="this.cliente.id" size="is-small" expanded v-model="cliente.tipoDocumento">
                      <option v-for="option in tipoNroDocumento" :value="option.value" :key="option.value">
                        {{ option.text}}
                      </option>
                    </b-select>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Numero Documento:" :type="getTypeFieldNumeroDocumento()" :message="getMensajeFieldNumeroDocumento()">
                    <b-input :disabled="this.cliente.id" size="is-small" v-model="$v.cliente.numeroDocumento.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Denominación:" :type="getTypeFieldDenominacion()" :message="getMensajeFieldDenominacion()">
                    <b-input size="is-small" v-model="$v.cliente.razonSocial.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Nombre Comercial:" :type="getTypeFieldNombreComercial()" :message="getMensajeFieldNombreComercial()">
                    <b-input size="is-small" v-model="$v.cliente.nombreComercial.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Telefono Fijo:" :type="getTypeFieldTelefonoFijo()" :message="getMensajeFieldTelefonoFijo()">
                    <b-input size="is-small" v-model="$v.cliente.telefonoFijo.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Telefono Movil:" :type="getTypeFieldTelefonoMovil()" :message="getMensajeFieldTelefonoMovil()">
                    <b-input size="is-small" v-model="$v.cliente.telefonoMovil.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Dirección:" :type="getTypeFieldDireccionFiscal()" :message="getMensajeFieldDireccionFiscal()">
                    <b-input size="is-small" v-model="$v.cliente.direccionFiscal.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Correo:" :type="getTypeFieldCorreo()" :message="getMensajeFieldCorreo()">
                    <b-input size="is-small" v-model="$v.cliente.email.$model">
                    </b-input>
                  </b-field>
                </div>
                <div class="column is-6">
                  <b-field label="Condición de Pago:">
                    <b-input size="is-small" v-model="cliente.condicionPago">
                    </b-input>
                  </b-field>
                </div>
              </div>
              <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar cliente</button>
            </form>
          </div>
        </div>
      </b-modal>
      </div>
</template>

<script>
  import Methods from "../../api/methods";
  import {
    required,
    minLength,
    maxLength,
    numeric,
    alphaNum,
    decimal,
    email
  } from 'vuelidate/lib/validators'
  import {
    mapGetters
  } from 'vuex';
  import ClientesMixin from './Mixins/ClientesMixin';
  import qs from "qs";
  import JsonExcel from "vue-json-excel";

  export default {
    mixins: [ClientesMixin],
    components: { downloadExcel: JsonExcel },
    name: "clientes",
    data() {
      return {
        cliente: {
          tipoDocumento: '6',
          numeroDocumento: null,
          razonSocial: null,
          nombreComercial: null,
          telefonoFijo: null,
          telefonoMovil: null,
          direccionFiscal: null,
          email: null,
          condicionPago: null
        },
        tblclients:[],
        searchproducto:"",
        perPageImportcli:10,
        filename:'',
        file: [],
        vuelines:[],
        isPaginated: true,
        isPaginationSimple: false,
        currentPage: 1,
        defaultSortDirection: 'asc',
        listclientimport:[],
        defaultSortOrder:"nombreComercial",
        loading: false,
        totalcli: 0,
        activeTab: 0,
        estadoclientes:true,
        perPage: 5,
        perPagecli: 10,
        pagecli: 1,
        clientes: [],
        isModalNuevoCliente: false,
        //Construcción de excel
        json_fields: {
          'Codigo': 'id',
          'Documento': 'numeroDocumento',
          'Razon Social': 'razonSocial',
          'Nombre Comercial': 'nombreComercial',
          'Email': 'email',
          'Direccion Fiscal': 'direccionFiscal',
          'Telefono': 'telefonoFijo',
          'Celular': 'telefonoMovil',
        },
        json_data: [],
        name_report: 'reporte_clientes.xlsx'
      };
    },
    validations() {
      var vali = {
        cliente: {
          razonSocial: {
            required
          },
          nombreComercial: {
            required
          },
          telefonoFijo: {
            minLength: minLength(7),
            maxLength: maxLength(7),
            numeric
          },
          telefonoMovil: {
            minLength: minLength(9),
            maxLength: maxLength(9)
          },
          direccionFiscal: {
            required
          },
          email: {
            
          }
        }
      };

      if (this.cliente.tipoDocumento === '1') {
        vali.cliente.numeroDocumento = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(8),
          numeric
        };
      } else if (this.cliente.tipoDocumento === '4') {
        vali.cliente.numeroDocumento = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else if (this.cliente.tipoDocumento === '6') {
        vali.cliente.numeroDocumento = {
          required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          numeric
        };
      } else {
        vali.cliente.numeroDocumento = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(15),
          alphaNum
        };
      }

      return vali;
    },
    computed: {
      ...mapGetters({
        'getCatalogo06': 'catalogos/getCatalogo06'
      }),

      tipoNroDocumento() {
        const listado = [];
        this.getCatalogo06.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      }
    },
    watch:{
      vuelines: function(val){

        if(val.length>0){
          this.validar()
        }
      },
      searchproducto: 'validateFilter',
      perPagecli: function () {
        this.pagecli = 1

        this.loadAsyncData()
      }
    },
    methods: {
      validateFilter: function() {
        this.pagecli=1
        this.cargarClientesPromise()

      },
      cargarClientesPromise() {
        const params = [
          `pagenumber=${this.pagecli}`,
          `filter=${this.searchproducto}`,
          `perpage=${this.perPagecli}`
        ].join('&')
        return new Promise((resolve, reject) => {
          const url = 'api/clientespage?'+params;
          Methods.doGet(this, url).then(data => {

            this.clientes=[]
            let currentTotal = data.total_results
            if (data.total_results / this.perPagecli > 1000) {
              currentTotal = this.perPagecli * 1000
            }
            this.totalcli = currentTotal
            this.clientes=data.results.content
            resolve()
          });
        }).catch(error=>reject(error));
      },
      resetfileshowfile() {
        this.estadoclientes=true
        this.listclientimport=[]
        this.filename=''
      },
      async fetchData(){
        const url = 'api/clientes'
        Methods.doGet(this,url).then(data=>{
          this.tblclients = data
          return data;
        })

        return null

      },
      loadclient(){
        if(this.activeTab==0){
          this.loadAsyncData()
        }else if(this.activeTab==1){
          this.downloadAllClients()
        }
      },
      downloadAllClients(){
        const url = 'api/clientes'
        Methods.doGet(this,url).then(data=>{
          this.tblclients = data


        })
      },
      loadHandler(event) {
        var csv = event.target.result;
        this.processData(csv);
      },
      processData(csv) {
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
      errorHandler(evt) {
        if(evt.target.error.name == "NotReadableError") {
          alert("Canno't read file !");
        }
      },
      handleFileUpload(fileList){

        this.filename = fileList[0].name
        this.fileinput = fileList[0]

        var reader = new FileReader();
        reader.readAsText(fileList[0])
        reader.onload = this.loadHandler
        reader.onerror = this.errorHandler

      },
      sendfilecsv(){
        this.confirm()
      },
      confirm() {
        this.$buefy.dialog.confirm({
          message: '¿Desea realizar esta tarea?',
          onConfirm: () => this.sendfileconfirm()
        })
      },
      successSend() {
        this.$buefy.dialog.alert({
          title: 'Registro de clientes',
          message: 'Los cliente se registraron correctamente <b>Muy bien</b>!',
          confirmText: 'Ok !'
        })
      },
      errorSend(mnsag) {
        this.$buefy.dialog.alert({
          title: 'Error',
          message: mnsag,
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa'
        })
      },
      sendfileconfirm(){

        var formdata = new FormData();
        formdata.append("filecsv",this.fileinput)
        Methods.doPostJson(this,'api/arrayclientes',formdata)
          .then(response => {
            console.log(response);
            if(response.status==200){
              this.successSend()
              this.listclientimport=[]
              this.estadoclientes=true
              this.resetfile()
            }else{
              this.errorSend(response.Obs)
              this.resetfile()
            }
          })
      },
      resetfile() {
        this.filename=''
        const input = this.$refs.fileinputref
        input.type = 'text'
        input.type = 'file'
      },
      validar(){
        var resp = 0
        for(var i=1; i<this.vuelines.length; i++){
          if((this.vuelines[i][0])!=""){
            var row = (this.vuelines[i][0]).split(",")

            if(row.length>6){
              this.errorSend("Existen celdas que exceden a las columnas o revise los decimales deben ser en formato ##.## en la fila "+i)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[0]=="" ){
              this.errorSend("El campo tipo de documento no debe ser vacio en la fila "+i)
              resp = 1
              this.resetfile()
              return false
            }
            if(isNaN(parseFloat(row[0])) && row[0]!="" ){
              this.errorSend("El campo tipo de documento no es numerico en la fila "+i)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[1]=="" ){
              this.errorSend("El campo numero de documento no debe ser vacio en la fila "+i)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[2]=="" ){
              this.errorSend("El campo razon social no debe ser vacio en la fila "+i)
              resp = 1
              this.resetfile()
              return false
            }

          }
        }
        this.convertObjects()
      },
      convertObjects(){
        const tabproduct = this.vuelines
        for(var i = 1; i<tabproduct.length;i++){
          if((this.vuelines[i][0])!=""){
            var row = (this.vuelines[i][0]).split(",")
            var cliente = {}
            cliente.tipoDocumento=row[0]
            cliente.numeroDocumento=row[1]
            cliente.razonSocial=row[2]
            cliente.nombreComercial=row[3]
            cliente.direccionFiscal=row[4]
            cliente.email=row[5]
            cliente.email = cliente.email.replace("&",",")
            this.listclientimport.push(cliente)

          }
        }
        this.estadoclientes=false
        this.verificarduplicado()
      },
      verificarduplicado(){
        var listcode = {}
        var resp = true
        for(var i = 0; i<this.listclientimport.length;i++){
          console.log(this.listclientimport[i].numeroDocumento+"\n")
          if(listcode[this.listclientimport[i].numeroDocumento]){
            this.errorSend("El archivo contiene codigos repetidos en la fila "+(i+1))
            resp = 1
            this.resetfileshowfile()
            break
            return false
          }else{
            listcode[this.listclientimport[i].numeroDocumento]=true
          }

        }
      },
      changeCliPage(){

      },
      onSort(field, order) {

      },
      onPageChangecli(page) {
        this.clientes=[]
        this.pagecli = page
        this.loadAsyncData()
      },
      loadAsyncData() {
        this.loading = true
        this.cargarClientesPromise().then(() => {
          this.isModalNuevoProducto = false;
        });
        this.loading = false
      },
/*      cargarClientesPromise(){
        return new Promise((resolve, reject) => {
          const url = 'service/clientespage?'+params
          Methods.doGet(this,url).then(data=>{
            this.clientes=[]
            let currentTotal = data.total_results
            if (data.total_results / this.perPagecli > 1000) {
              currentTotal = this.perPagecli * 1000
            }
            this.totalcli = currentTotal

            this.productos=data.results.content

            resolve()
          })
        }).catch(error=>reject(error))
      },
      cargarClientesExcelPromise(){
        return new Promise((resolve, reject) => {
          const url = 'service/clientes'
          Methods.doGet(this,url).then(data=>{

            resolve()
          })
        }).catch(error=>reject(error))
      },*/
      guardarCliente() {
        this.$v.cliente.$touch();
        if (!this.$v.cliente.$error) {
          const url = `api/clientes`;
          if (this.cliente.id) {
            Methods.doPut(this, url, this.cliente).then(data => {
              this.cargarClientesPromise().then(() => {
                this.isModalNuevoCliente = false;
              });
            });
          } else {
            Methods.doPost(this, url, this.cliente).then(data => {
              this.cargarClientesPromise().then(() => {
                this.isModalNuevoCliente = false;
              });
            });
          }
        }
      },
      mostrarCliente() {
        this.isModalNuevoCliente = true;
        this.cliente = {
          tipoDocumento: '6',
          numeroDocumento: null,
          razonSocial: null,
          nombreComercial: null,
          telefonoFijo: null,
          telefonoMovil: null,
          direccionFiscal: null,
          email: null
        };
        this.$v.cliente.$reset();
      },
      editarCliente(selec) {
        this.isModalNuevoCliente = true;
        this.cliente = selec;
        this.$v.cliente.$reset();
      },
      eliminarCliente(val) {
        this.$buefy.dialog.confirm({
            message: '¿Seguro que desea deshabilitarlo?',
            onConfirm: () => {
              const url = `api/clientes/${val.id}`;
              Methods.doDelete(this, url).then(data => {
                this.cargarClientesPromise().then(() => {
                  this.isModalNuevoCliente = false;
                });
              });
            }
        })
      }
    },
    beforeMount() {
      this.cargarClientesPromise().then();
    }
  };
</script>
