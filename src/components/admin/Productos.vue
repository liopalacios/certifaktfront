<template>
    <div class="default-container container-main">
      <h2 class="title is-4 is-spaced has-text-centered">Mantenimiento de productos</h2>
      <b-tabs type="is-toggle-rounded" v-model="activeTab" @change="loadproduct">
        <b-tab-item label="Listar" icon="receipt" >
          <div class="columns">
            <div class="column">
              <b-tooltip  type="is-dark" label="Agregar producto" position="is-right">
                <button @click="mostrarProducto()" class="button is-small">
                  <b-icon type="is-success" size="is-mediun" icon="plus"></b-icon>
                </button>
              </b-tooltip>
            </div>
            <div class="column">

              <b-select placeholder="Paginacion" v-model="perPageprod" v-on:change="changePerPage">
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="40">40</option>
              </b-select>
            </div>
            <div class="column">
              <b-field v-if="productos" class="rightAlig search-personal">
                <b-input placeholder="Buscador"
                         type="search"
                         v-model="searchproducto"
                         v-on:change="validateFilter"
                         icon="magnify">
                </b-input>
              </b-field>
            </div>
            <div class="column">

              <span class="button is-info is-medium is-pulled-left m-r-10">{{totalprod}}</span>
              <label class="label is-large is-pulled-left is-size-4 m-l-10"> <span> &nbsp;productos</span></label>
            </div>
          </div>

          <b-table
            :data="productos"
            :loading="loading"

            paginated
            backend-pagination
            :total="totalprod"
            :per-page="perPageprod"
            @page-change="onPageChangeprod"

            backend-sorting
            :default-sort-direction="defaultSortOrder"
            @sort="onSort"

            :mobile-cards="true">

            <template slot-scope="props">

              <b-table-column label="Código">
                {{ props.row.codigo }}
              </b-table-column>

              <b-table-column label="Descripción">
                {{ props.row.descripcion }}
              </b-table-column>

              <b-table-column label="Moneda">
                {{ props.row.moneda }}
              </b-table-column>

              <b-table-column label="Unidad de medida">
                {{ props.row.unidadMedida }}
              </b-table-column>

              <b-table-column label="Tipo de afectación">
                {{ props.row.tipoAfectacion | FiltroTipoAfectacion }}
              </b-table-column>


              <b-table-column label="Valor venta sin IGV">
                {{ props.row.valorVentaSinIgv }}
              </b-table-column>

              <b-table-column label="Valor venta con IGV">
                {{ props.row.valorVentaConIgv }}
              </b-table-column>

              <b-table-column label="Acciones"  width="50" centered>
                <b-tooltip  type="is-dark" label="Editar"
                            position="is-left">
                  <button @click="editarProducto(props.row)" class="button is-small"><b-icon type="is-info" size="is-mediun" icon="pencil"></b-icon></button>
                </b-tooltip>
                <b-tooltip  type="is-dark" label="Eliminar"
                            position="is-left">
                  <button @click="eliminarProducto(props.row)" class="button is-small"><b-icon type="is-danger" size="is-mediun" icon="delete"></b-icon></button>
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
                  <p>Ningún producto.</p>
                </div>
              </section>
            </template>
          </b-table>

        </b-tab-item>
        <b-tab-item label="Descargar" icon="download">

          <download-excel class = "button is-success is-rounded is-small"
                          :fields = "json_fields"
                          :data = "json_data"
                          type    = "csv"
                          :name = "name_report">
            Exportar hoja de cálculo
          </download-excel>
        </b-tab-item>

        <b-tab-item label="Cargar productos" icon="cloud">


          <div class="field">
            <div class="file is-centered is-boxed is-success has-name" v-if="estadoproductos">
              <label class="file-label">
                <a class="buttoncsv">
                  <input type="file" id="file" name="resume" ref="fileinputref" accept=".csv" class="file-input" v-on:change="handleFileUpload($event.target.files)" />
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
              <label class="file-label">
                <a class="buttoncsv" href="https://certifakt.s3-us-west-2.amazonaws.com/public/Plantilla_Productos.csv">
                <span class="file-cta buttoncsv">
                  <span>
                      <i class="fas fa-file-excel "></i>
                  </span>
                  <span class="file-label">
                      Descargar Plantilla
                  </span>
                </span>
                </a>
                <span class="file-name"> </span>
              </label>


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
                <span>Enviar registros a la tabla productos</span>
              </a>
              <a class="button is-danger" @click="resetfileshowfile" is-centered>
                <span class="icon">
                  <i class="fas fa-angle-double-up"></i>
                </span>
                <span>Cancelar carga masiva de productos</span>
              </a>
            </div>
            <b-select v-if="!estadoproductos" placeholder="Paginacion" v-model="perPageImportprod">
              <option value="10">10</option>
              <option value="25">20</option>
              <option value="50">50</option>
              <option value="40">75</option>
              <option value="50">100</option>
            </b-select>
            <hr/>
            <b-table
              :data="listproductimport"
              :paginated="isPaginated"
              :per-page="perPageImportprod"
              :current-page.sync="currentPage"
              :pagination-simple="isPaginationSimple"
              :default-sort-direction="defaultSortDirection"
              default-sort="">
              <template slot-scope="props">
                <b-table-column field="codigo" label="Codigo" width="40" sortable numeric>
                  {{ props.row.codigo }}
                </b-table-column>
                <b-table-column field="Descripcion" label="Descripcion" width="40" sortable numeric>
                  {{ props.row.descripcion }}
                </b-table-column>
                <b-table-column field="MONEDA" label="Moneda" width="40" sortable numeric>
                  {{ props.row.moneda }}
                </b-table-column>
                <b-table-column field="unidadMedida" label="Medida" width="40" sortable numeric>
                  {{ props.row.unidadMedida }}
                </b-table-column>
                <b-table-column field="tipoAfectacion" label="Afectacion" width="40" sortable numeric>
                  {{ props.row.tipoAfectacion }}
                </b-table-column>
                <b-table-column field="valorVentaConIgv" label="Venta con IGV" width="40" sortable numeric>
                  {{ props.row.valorVentaConIgv }}
                </b-table-column>
                <b-table-column field="valorVentaSinIgv" label="Vent sin IGV" width="40" sortable numeric>
                  {{ props.row.valorVentaSinIgv }}
                </b-table-column>
              </template>
            </b-table>
          </div>
        </b-tab-item>
      </b-tabs>

      <!--//MODAL NUEVO-->
      <b-modal :active.sync="isModalNuevoProducto" :width="640" >
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">
         <span><b-icon
           icon="plus"
           size="is-small">
        </b-icon></span> <span style="margin-left: 10px;">Registrar producto</span>
            </p>
          </div>
          <div class="card-content">

            <form @submit.prevent="guardarProducto">
              <div class="columns is-multiline">

                <div class="column is-6">
                  <b-field label="Código" :type="getTypeFieldCodigo()" :message="getMensajeFieldCodigo()">
                    <b-input size="is-small" type="text" v-model="$v.producto.codigo.$model"></b-input>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Descripción" :type="getTypeFieldDescripcion()" :message="getMensajeFieldDescripcion()">
                    <b-input size="is-small" type="textarea" v-model="$v.producto.descripcion.$model"></b-input>
                  </b-field>
                </div>

                <div class="column is-6">

                  <b-field label="Unidad de medida" :type="getTypeFieldUnidadMedida()" :message="getMensajeFieldUnidadMedida()">
                    <b-select size="is-small" expanded v-model="$v.producto.unidadMedida.$model">
                      <option
                        v-for="option in unidades"
                        :value="option.code"
                        :key="option.code">
                        {{ option.description}} ({{option.code}})
                      </option>
                    </b-select>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Moneda">
                    <b-select size="is-small" expanded v-model="producto.moneda">
                      <option v-for="option in tiposMonedas" :value="option.value" :key="option.value">
                        {{ option.text}}
                      </option>
                    </b-select>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Valor de venta sin IGV" :type="getTypeFieldVVentaSinIGV()" :message="getMensajeFieldVVentaSinIGV()">
                    <b-input size="is-small" type="text" v-model="$v.producto.valorVentaSinIgv.$model"></b-input>
                  </b-field>
                </div>

                <div class="column is-6">
                  <b-field label="Valor de venta con IGV" :type="getTypeFieldVVentaConIGV()" :message="getMensajeFieldVVentaConIGV()">
                    <b-input size="is-small" type="text" v-model="$v.producto.valorVentaConIgv.$model"></b-input>
                  </b-field>
                </div>



                <div class="column is-6">
                  <b-field label="Tipo de afectación">
                    <b-select size="is-small" placeholder="Seleccione tipo de afectacion"
                              expanded v-model="producto.tipoAfectacion">
                      <option
                        v-for="option in tipoIgvList"
                        :value="option.value"
                        :key="option.value">
                        {{ option.text}}
                      </option>
                    </b-select>
                  </b-field>
                </div>

              </div>

              <button type="submit" class="button is-info is-rounded is-fullwidth">Registrar producto</button>

            </form>

          </div>
        </div>
      </b-modal>


    </div>
</template>
<style scoped>

</style>
<script>
  import Methods from '../../api/methods'

  import {
    mapGetters
  } from 'vuex';
  import {
    required,
    minValue,
    numeric,
    alphaNum,
    decimal,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'
  import ProductosMixin from './Mixins/ProductosMixin';
  import JsonExcel from "vue-json-excel";
  import debounce from 'lodash/debounce'

  import util from "../../util";
  const headers = util.getAuthHeader()
  export default {
    mixins: [ProductosMixin],
    components: { downloadExcel: JsonExcel },
    name: "productos",
    data(){
      return {
        activeTab: 0,
        searchproducto:"",
        estadoproductos:true,
        showBooks: false,
        fileinput:null,
        defaultSortOrder:"id",
        unidades: [],
        totalprod: 0,
        codigosSunatAutocomplete: [],
        perPageprod: 6,
        pageprod:1,
        loading: false,
        vm : [],
        file: [],
        vuelines:[],
        listproductimport:[],
        perPageImportprod:10,
        productsimport:{
          codigo:null,
          descripcion:null,
          moneda:null,
          unidadMedida:null,
          tipoAfectacion:null,
          valorVentaConIgv:0,
          valorVentaSinIgv:0,
        },
        vuelineslength:this.vuelines,
        perPage: 5,
        currentPage: 1,
        defaultSortDirection: 'asc',
        isPaginated: true,
        isPaginationSimple: false,
        filename:'',
        isActive:false,
        producto:{
          codigo: null,
          descripcion: null,
          moneda: 'PEN',
          unidadMedida: null,
          tipoAfectacion: '10',
          valorVentaConIgv: null,
          valorVentaSinIgv: null,
        },
        productos: [],
        isModalNuevoProducto: false,
        tiposMonedas: [{
            value: 'PEN',
            text: 'S/'
          },
          {
            value: 'USD',
            text: 'US$'
          }
        ],
        //Construcción de excel
        json_fields: {
          'Codigo': 'codigo',
          'Nombre': 'descripcion',
          'Moneda': 'moneda',
          'UNidad de medida': 'unidadMedida',
          'Valor con IGV': 'valorVentaConIgv',
          'Valor sin IGV': 'valorVentaSinIgv'
        },
        json_data: [],
        name_report: 'REPORTE_PRODUCTOS.xlsx'
      }
    },
    validations: {
      producto: {
        codigo: {

        },
        descripcion: {
          required
        },
        unidadMedida: {
          required
        },
        valorVentaConIgv: {
          decimal,
          minValue: minValue(0.01)
        },
        valorVentaSinIgv: {
          decimal,
          minValue: minValue(0.01)

        },
        codigoSunat: {

          minLength: minLength(8),
          maxLength: maxLength(8),
        }
      }
    },
    computed:{
      ...mapGetters({'getCatalogo07': 'catalogos/getCatalogo07'}),
      tipoIgvList() {
        const listado = [];
        this.getCatalogo07.forEach(v=>{
          listado.push({value:v.codigo,
                        text: v.descripcion,
                        rel: v.codigoRelacionado})
        })
        return listado;
      },
      unidadesMedida(){
        const listado = [];
        this.getCatalogo07.forEach(v=>{
          listado.push({value:v.codigo,
            text: v.descripcion,
            rel: v.codigoRelacionado})
        })
        return listado;
      },
      isActiveCompute(){
        return this.isActive
      }
    },
    watch:{
      vuelines: function(val){
        if(val.length>0){
          this.validar()
        }
      },
      searchproducto: 'validateFilter',
      perPageprod: function () {
        this.pageprod = 1

        this.loadAsyncData()
      }
    },
    methods:{
      validateFilter: function() {
        console.log("embalaje")
        this.pageprod=1
        this.cargarProductosPromise()

      },
      loadproduct(){
        if(this.activeTab==0){
          this.loadAsyncData()
        }else if(this.activeTab==1){
          this.downloadAllProducts()
        }
      },
      downloadAllProducts(){
        const url = 'api/productos'
        Methods.doGet(this,url).then(data=>{
          this.json_data = data

        })
      },
      changePerPage(){

      },
      onSort(field, order) {

      },
      onPageChangeprod(page) {
        this.productos=[]
        this.pageprod = page
        this.loadAsyncData()
      },
      loadAsyncData() {
        this.loading = true
        this.cargarProductosPromise().then(() => {
          this.isModalNuevoProducto = false;
        });
        this.loading = false
      },
      sendfilecsv(){
        this.confirm()

      },
      confirm() {
        this.$buefy.dialog.confirm({
          message: 'Desea continuar con la carga?',
          onConfirm: () => this.sendfileconfirm()
        })
      },
      successSend(response) {
        console.log(response["Obs"])
        var msg = ""
        if((response.Obs).length>0){
          if((response.Obs).length==1){
            msg = "El siguiente codigo ya existe en la base de datos : ("+response.Obs+") \n"
          }else{
            msg = "Los siguientes codigos ya existen en la base de datos : ("+response.Obs+") \n"
          }

        }
        this.$buefy.dialog.alert({
          title: 'Registro de productos',
          message: msg+'</br> Carga terminada <b>Registro corrrecto de productos</b>!',
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
        Methods.doPostJson(this,'api/arrayproductos',formdata)
          .then(response => {
            if(response.status==200){

              this.successSend(response)
              this.listproductimport=[]
              this.estadoproductos=true
              this.resetfileshowfile()

            }else{
              this.errorSend(response.Obs)
              this.resetfileshowfile()
            }
          })
      },
      resetfile() {
        this.filename=''
        const input = this.$refs.fileinputref
        input.type = 'text'
        input.type = 'file'

      },
      resetfileshowfile() {
        this.estadoproductos=true
        this.listproductimport=[]
        this.filename=''
      },
      validar(){
        var resp = 0
        for(var i=1; i<this.vuelines.length; i++){
          var j = i+1
          if((this.vuelines[i][0])!=""){
            (this.vuelines[i][0]).toUpperCase()
            var row = (this.vuelines[i][0]).split(",")

            if(row.length>8){
              this.errorSend("Existen celdas que exceden a las columnas o revise los decimales deben ser en formato ##.## en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[3].toUpperCase()=="NIU" || row[3].toUpperCase()=="BX" || row[3].toUpperCase()=="KGM" || row[3].toUpperCase()=="BO" || row[3].toUpperCase()=="BG"
              || row[3].toUpperCase()=="ZZ" || row[3].toUpperCase()=="PK" || row[3].toUpperCase()=="MTR" || row[3].toUpperCase()=="CJ"){}else{
              this.errorSend("La unidad de medida no corresponde o debe estar en mayuscula en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[2].toUpperCase()=="PEN" || row[2].toUpperCase()=="USD" || row[2].toUpperCase()=="EUR"){}else{
              this.errorSend("No corresponde el simbolo de moneda en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(isNaN(parseFloat(row[5])) && row[5]!="" ){
              this.errorSend("El campo venta sin igv no es numerico en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(isNaN(parseFloat(row[6])) && row[6]!="" ){
              this.errorSend("El campo venta con igv no es numerico en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(isNaN(parseFloat(row[4])) && row[4]!="" ){
              this.errorSend("El campo tipo de afectacion no es numerico en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[4]!="" ){
              if(parseFloat(row[4])>=10 && parseFloat(row[4])<=40 ){
                if((parseFloat(row[4])>21 && parseFloat(row[4])<30) || (parseFloat(row[4])> 17 && parseFloat(row[4])<20) || (parseFloat(row[4])> 37 && parseFloat(row[4])<40)){
                  this.errorSend("El campo tipo de afectacion no corresponde a los codigos permitidos en la fila "+j)
                  resp = 1
                  this.resetfile()
                  return false
                }
              }else{
                this.errorSend("El campo tipo de afectacion no corresponde a los codigos permitidos en la fila "+j)
                resp = 1
                this.resetfile()
                return false
              }

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
            var producto = {}
            producto.codigo=row[0]
            producto.descripcion=row[1]
            producto.moneda=row[2].toUpperCase()
            producto.unidadMedida=row[3].toUpperCase()
            producto.tipoAfectacion=row[4]
            producto.valorVentaConIgv=row[5]
            producto.valorVentaSinIgv=row[6]
            this.listproductimport.push(producto)
          }
        }
        this.estadoproductos=false
        this.verificarduplicado()
      },
      verificarduplicado(){
        var listcode = {}
        var resp = true
        for(var i = 0; i<this.listproductimport.length;i++){

          if(this.listproductimport[i].codigo != ""){

            if(listcode[this.listproductimport[i].codigo]){
              this.errorSend("El archivo contiene codigos repetidos en la fila "+(i+1))
              resp = 1
              this.resetfileshowfile()
              break
              return false
            }else{
              listcode[this.listproductimport[i].codigo]=true
            }
          }


        }
      },
      toast() {
        this.$buefy.toast.open('Something happened')
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
        var listobj = []
        var newobj = {}
        this.filename = fileList[0].name
        this.fileinput = fileList[0]

        var reader = new FileReader();
        reader.readAsText(fileList[0])
        reader.onload = this.loadHandler
        reader.onerror = this.errorHandler

      },
      returnreader(file){
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },
      submitFile() {
        var object = {};
        this.file.forEach(function(value, key){
          object[key] = value;
        });
        var json = JSON.stringify(object);


      },
      guardarProducto(){
        this.$v.producto.$touch();
        if(!this.$v.producto.$error){
          const url = `api/productos`
          if (this.producto.id) {
            Methods.doPut(this, url, this.producto).then(data => {
              this.cargarProductosPromise().then(() => {
                this.isModalNuevoProducto = false;
              });
            });
          } else {
            Methods.doPost(this,url,this.producto).then(data=>{
              this.cargarProductosPromise().then(()=>{
                this.isModalNuevoProducto=false
              })
            })
          }
        }
      },
      cargarProductosPromise(){
        const params = [
          `pagenumber=${this.pageprod}`,
          `filter=${this.searchproducto}`,
          `perpage=${this.perPageprod}`
        ].join('&')
        return new Promise((resolve, reject) => {
          const url = 'api/productospage?'+params
          Methods.doGet(this, url).then(data=>{
            console.log("DATA FILTRO")
            this.productos=[]
            let currentTotal = data.total_results
            if (data.total_results / this.perPage > 1000) {
              currentTotal = this.perPage * 1000
            }
            this.totalprod = currentTotal
            this.productos=data.results.content
            resolve()
          });
        }).catch(error=>reject(error));
      },
      editarProducto(selec) {
        this.isModalNuevoProducto = true;
        this.producto = selec;
        this.$v.producto.$reset();
      },
      eliminarProducto(val) {
        this.$buefy.dialog.confirm({
            message: '¿Seguro que desea deshabilitarlo?',
            onConfirm: () => {
              const url = `api/productos/${val.id}`;
              Methods.doDelete(this, url).then(data => {
                this.cargarProductosPromise().then(() => {
                  this.isModalNuevoProducto = false;
                });
              });
            }
        })
      },
      mostrarProducto() {
        this.isModalNuevoProducto = true;
        this.producto = {
          codigo: null,
          descripcion: null,
          unidadMedida: null,
          moneda: 'PEN',
          valorVentaConIgv: null,
          valorVentaSinIgv: null,
          tipoAfectacion: '10'
        };
        this.$v.producto.$reset();
      },
      loadUnidades(){
        Methods.doGet(this, 'api/company/myunitcodes').then(data=>{
          this.unidades=data.unitCodes
          if(data.default) this.defaultUnit=data.default
        })
      }
    },
    beforeMount(){
      this.cargarProductosPromise().then()
      this.loadUnidades()
    }


  }
</script>
