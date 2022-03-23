<template>

  <div class="consulta-page">
    <div class="consulta-form">

      <h1 class="is-size-3 has-text-centered"><img class="logo-filekom" src="/statics/img/logo_certifakt_text.png" alt=""></h1>
      <p style="margin-bottom: 0.5rem;" class="title is-5 has-text-centered">Consulta tus comprobantes de pago</p>

      <form @submit.prevent="buscar">

        <div class="columns is-multiline">

          <div class="column is-6">
            <b-field label="Ruc" :type="getTypeFieldRuc()" :message="getMensajeFieldRuc()">
              <b-input type="number" v-model="$v.ruc.$model"></b-input>
            </b-field>


            <b-field label="Serie" :type="getTypeFieldSerie()" :message="getMensajeFieldSerie()">
              <b-input type="text" v-model="$v.serieDocumento.$model"></b-input>
            </b-field>

            <b-field label="Fecha de emisión" :type="getTypeFieldFechaEmision()" :message="getMensajeFieldFechaEmision()">
              <b-datepicker v-model="$v.fechaEmision.$model"
                            placeholder="Click para seleccionar"
                            :date-formatter="formatDate"
                            icon="calendar-today">
              </b-datepicker>
            </b-field>

          </div>

          <div class="column is-6">
            <b-field label="Tipo de documento">
              <b-select style="padding-top: 5px; padding-bottom: 5px;" expanded placeholder="Seleccione tipo"
                         v-model="$v.tipoComprobante.$model">
                <option
                  v-for="(option,i) in typeOptions"
                  :value="option.value"
                  :key="i">
                  {{ option.text }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Número" :type="getTypeFieldNroDocumento()" :message="getMensajeFieldNroDocumento()">
              <b-input type="number" v-model="$v.nroDocumento.$model"></b-input>
            </b-field>

            <b-field label="Monto" :type="getTypeFieldMonto()" :message="getMensajeFieldMonto()">
              <b-input type="text" v-model="$v.monto.$model"></b-input>
            </b-field>

          </div>


        </div>

          <div class="control btnconsulta">
            <div class="column is-12">
              <button type="submit" class="button  is-info is-rounded ">Buscar</button>
              <a @click="limpiar()" class="button  is-dark is-rounded ">Limpiar</a>
            </div>
          </div>

      </form>
    </div>



    <!--//MODAL PDF-->
    <b-modal :active.sync="isModalPdf" class="modalpdf" width="940" >
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

  import Methods from '../api/methods';
  import dateformat from 'dateformat'
  import { required, minLength, maxLength, numeric, minValue } from 'vuelidate/lib/validators';
  const endPoint = __API__;
  export default {
   // components: { VueRecaptcha },
    data(){
      return{
        year: null,
        typeOptions: [
          { value: '01', text: 'Factura electrónica' },
          { value: '03', text: 'Boleta electrónica' },
          { value: '07', text: 'Nota de crédito electrónica' },
          { value: '08', text: 'Nota de dédito electrónica' }
        ],
        ruc: null,
        tipoComprobante: '01',
        serieDocumento:'',
        nroDocumento: '',
        monto: 0.00,
        fechaEmision: new Date(),
        urlPDF: null,
        isModalPdf: false
      }
    },
    validations: {
      ruc: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11),
        numeric
      },
      tipoComprobante: {
        required
      },
      serieDocumento:{
        required
      },
      nroDocumento: {
        required,
        numeric
      },
      fechaEmision: {
        required
      },
      monto:{
        required,
        minValue: minValue(0.01)
      }
    },
    methods:{
      buscar(){
       this.$v.$touch();
       if(!this.$v.$error){
          const fechaS = dateformat(this.fechaEmision,"yyyy-mm-dd");
          const url = `api/descargapdfpublico-A4/blob`
          const consultaComp = {
            ruc: this.ruc,
            tipo: this.tipoComprobante,
            serie: this.serieDocumento,
            numero: this.nroDocumento,
            fecha: fechaS,
            monto: this.monto
          }
          Methods.doPostGetBlob(this,url,consultaComp).then(data=>{
            this.urlPDF = data
            this.isModalPdf=true
          })
        }
      },
      validarDocumento(value){
        if (value.length <6) return true;
        const regDocumento = /^(([BF]|[bf])[A-Za-z0-9][A-Za-z0-9][A-Za-z0-9])-([0-9]+)?$/;
        return regDocumento.test(value);
      },
      setearRuc(){
        const ruc = this.$route.params.ruc
        if(ruc){
          this.ruc=ruc
        }
      },
      formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `${day} de ${monthNames[monthIndex]} de ${year}`
      },
      getTypeFieldRuc(){
        if(this.$v.ruc.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldRuc(){
        if(this.getTypeFieldRuc()){
          if(!this.$v.ruc.required) {return 'RUC requerida'}
          else return 'RUC invalida'
        }
        return ''
      },
      getTypeFieldSerie(){
        if(this.$v.serieDocumento.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldSerie(){
        if(this.getTypeFieldSerie()){
          if(!this.$v.serieDocumento.required) {return 'Serie requerida'}
          else return 'Serie invalida'
        }
        return ''
      },
      getTypeFieldNroDocumento(){
        if(this.$v.nroDocumento.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldNroDocumento(){
        if(this.getTypeFieldNroDocumento()){
          if(!this.$v.nroDocumento.required) {return 'Numero de Documento requerida'}
          else return 'Numero de Documento invalida'
        }
        return ''
      },
      getTypeFieldMonto(){
        if(this.$v.monto.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldMonto(){
        if(this.getTypeFieldMonto()){
          if(!this.$v.monto.required) {return 'Monto requerido'}
          else return 'Monto invalido'
        }
        return ''
      },
      getTypeFieldFechaEmision(){
        if(this.$v.fechaEmision.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldFechaEmision(){
        if(this.getTypeFieldFechaEmision()){
          if(!this.$v.fechaEmision.required) {return 'Fecha Emision requerida'}
          else return 'Fecha Emision invalida'
        }
        return ''
      },
      limpiar(){
        this.ruc =  null,
        this.tipoComprobante = '01'
        this.serieDocumento = ''
        this.nroDocumento = ''
        this.monto = 0.00
        this.fechaEmision = new Date();
        this.$v.$reset();
      }
    },

    watch:{
      '$route' : 'setearRuc'
    },

    beforeMount(){
      this.setearRuc()
      this.year=new Date().getFullYear()
    }
  }

</script>



<style  lang="scss">

  body, html {
    height: 100%;
  }

  .consulta-page {
    display: flex;
    flex-direction: row;
    height:100%;
    background-color: #eee;
  }

  .consulta-form {
    width: 480px;
    margin: auto;
  }

  form {
    width: 100%;
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    input, button, a {
      width: 100%;
      margin: 5px 0;
    }
  }


  .logo-filekom{
    width: 80%;
  }

  .btnconsulta{
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;

  }

  .label:not(:last-child) {
    margin-bottom: 0.1rem;
  }
</style>

