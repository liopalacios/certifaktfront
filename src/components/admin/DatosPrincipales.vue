<template>
    <div class="default-container">
        <h1 class="title is-spaced">Datos principales</h1>
        <hr>

      <form @submit.prevent="onSubmit" >
        <div class="columns is-multiline">
          <div class="column is-8">

            <b-field label="Ruc"
                       :type="toShowType($v.empresa.ruc)"
                       :message="toShowMessage($v.empresa.ruc)">
              <b-input v-model="$v.empresa.ruc.$model"
                       disabled
                       placeholder="Ingresa RUC"></b-input>
            </b-field>

            <b-field label="Razón social"
                        :type="toShowType($v.empresa.razonSocial)"
                       :message="toShowMessage($v.empresa.razonSocial)">
              <b-input
                       v-model="$v.empresa.razonSocial.$model"
                       placeholder="Ingresa Razón social"></b-input>
            </b-field>

            <b-field label="Nombre Comercial"
                       :type="toShowType($v.empresa.nombreComercial)"
                       :message="toShowMessage($v.empresa.nombreComercial)">
              <b-input
                       v-model="$v.empresa.nombreComercial.$model"
                       placeholder="Ingresa Nombre Comercial"></b-input>
            </b-field>

            <b-field label="Dirección"
                       :type="toShowType($v.empresa.direccion)"
                       :message="toShowMessage($v.empresa.direccion)">
              <b-input
                       v-model="$v.empresa.direccion.$model"
                       placeholder="Ingresa Dirección"></b-input>
            </b-field>

            <b-field label="Email"
                       :type="toShowType($v.empresa.email)"
                       :message="toShowMessage($v.empresa.email)">
              <b-input
                v-model="$v.empresa.email.$model"
                placeholder="Ingresa Email"></b-input>
            </b-field>

            <b-field label="Teléfono"
                       :type="toShowType($v.empresa.telefono)"
                       :message="toShowMessage($v.empresa.telefono)">
              <b-input
                type="text"
                v-model="$v.empresa.telefono.$model"
                placeholder="Ingresa telefono"></b-input>
            </b-field>

            <hr/>

            <b-field label="Configuración de facturación">
              <div class="columns">
                <div class="column">
                  <b-checkbox v-model="$v.empresa.envioAutomaticoSunat.$model">Envío automático de comprobantes a Sunat</b-checkbox>
                </div>
                <div class="column">
                  <b-checkbox v-model="$v.empresa.preciosIncluidoIgv.$model">Precios incluyen IGV</b-checkbox>
                </div>
              </div>
            </b-field>


            <b-field label="Ubl Versión">
              <b-input disabled
                type="number"
                v-model="$v.empresa.ublVersion.$model"></b-input>
            </b-field>


            <b-field label="Dinamico" v-show="false">
              <b-input
                type="number"
                v-model="$v.empresa.cantComprobanteDinamico.$model"></b-input>
            </b-field>

            <b-field label="formato" v-show="false">
              <b-input
                type="number"
                v-model="$v.empresa.format.$model"></b-input>
            </b-field>

            <b-field label="Ver Codigo" v-show="false">
              <b-checkbox v-model="empresa.viewCode">
              </b-checkbox>
            </b-field>

          </div>
          <div class="column is-4">

            <h5 class="title is-6">Sube tu Logo</h5>

            <div style="text-align: center; padding-bottom: 0.5rem" v-if="urlImagenLogo">

              <img style=" max-height: 300px; width: auto; text-align: center"  :src="urlImagenLogo" fluid alt="Responsive image" />

            </div>

            <div>
              <file-pond
                labelFileProcessing="Subiendo tu logo"
                labelFileProcessingComplete="Tu logo se subió correctamente"
                labelFileProcessingAborted="Subida cancelada"
                labelFileProcessingError="Ocurrió un error al subir tu archivo"
                labelTapToCancel="Click para cancelar"
                :onprocessfile="onProcessFile"
                name="imagen"
                ref="pond"
                label-idle="Da click aqui o arrastra tu logo..."
                allow-multiple="false"
                accepted-file-types="image/jpeg, image/png"
                :server="urlUpload"
                v-bind:files="imagen"
                v-on:init="handleFilePondInit"/>
            </div>

          </div>

          <div class="column is-12">
            <button type="submit" class="button is-info is-rounded">Guardar cambios</button>
          </div>
        </div>
      </form>



    </div>
</template>

<script>
  import {mapMutations} from 'vuex'

  import Methods from '../../api/methods'

  // Import Vue FilePond
  import vueFilePond from 'vue-filepond';

  // Import FilePond styles
  import 'filepond/dist/filepond.min.css';

  // Import image preview plugin styles
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

  // Import image preview and file type validation plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

  import {
    required,
    minLength,
    maxLength,
    numeric,
    alphaNum,
    decimal,
    email,
    helpers,
    minValue,
    maxValue
  } from 'vuelidate/lib/validators'
  import validationsMixin from '../../validations/index'

  // Create component
  const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

  import util from '../../util'

  export default {
    mixins: [validationsMixin],
    components: {
      FilePond
    },
    data () {
      return {
        empresa: {
          ruc: null,
          razonSocial: null,
          nombreComercial: null,
          direccion: null,
          email: null,
          telefono: null,
          cantComprobanteDinamico: null,
          format: null,
          envioAutomaticoSunat: false,
          preciosIncluidoIgv: false,
          ublVersion: null
        },
        imagen: [],
        urlUpload : `${__API__}api/imagenes/subirimagen`,
        urlImagenLogo : null

      }
    },
    validations: {
      empresa: {
        ruc: {
          required,
          numeric,
          minLength: minLength(11),
          minLength: maxLength(11)
        },
        razonSocial: {
          required
        },
        nombreComercial: {
          required
        },
        direccion: {
          required
        },
        email: {
          email
        },
        telefono: {
        },
        cantComprobanteDinamico: {},
        envioAutomaticoSunat: {},
        preciosIncluidoIgv: {},
        format: {},
        ublVersion: {}

      }
    },
    methods: {
      ...mapMutations({'setCompany': 'auth/setCompany'}),
      handleFilePondInit: function() {
      },
      onSubmit () {
        this.$v.empresa.$touch();
        if(!this.$v.empresa.$error){
          const url = `api/miempresa`
          Methods.doPost(this,url,this.empresa).then(data=>{
            this.setStorageCompany(data)
            this.empresa=data
            if(this.empresa.archivoLogo){
              this.cambiarImagenLogo(this.empresa.archivoLogo.idRegisterFileSend)
            }
            util.showNotification(this,"Datos actualizados correctamente",'success')
          })
        }
        else console.log("Error en la empresa")
      },

      cargarDatosEmpresa(){
        const url = `api/miempresa`
        Methods.doGet(this,url).then(data=>{
          if(data.envioAutomaticoSunat==null | data.envioAutomaticoSunat==undefined)  data.envioAutomaticoSunat = false
          if(data.preciosIncluidoIgv==null | data.preciosIncluidoIgv==undefined)  data.preciosIncluidoIgv = false
          this.empresa=data
          if(this.empresa.archivoLogo){
            this.cambiarImagenLogo(this.empresa.archivoLogo.idRegisterFileSend)
          }

        })
      },

      setStorageCompany(company){
        this.setCompany(company)
        localStorage.setItem('company', JSON.stringify(company))
      },

      onProcessFile(error, file){
        this.empresa.archivoLogo = {idRegisterFileSend: file.serverId }
        this.cambiarImagenLogo(file.serverId)
        this.imagen= []
      },
      cambiarImagenLogo(idImagen){
        this.urlImagenLogo=`${__API__}api/imagenes/${idImagen}`
      }
    },
    created(){
      this.cargarDatosEmpresa()
    }
  }
</script>
