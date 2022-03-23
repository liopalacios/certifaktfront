<template>
    <div>
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            <span><b-icon
              icon="plus"
              size="is-small">
            </b-icon></span> <span style="margin-left: 10px;">Agregar Traslado</span>
          </p>
        </div>
        <div class="card-content">
          <div class="columns is-multiline">
            <div class="column pd-per is-12">
              <b-field label="Transportista:">
                <div class="box" style="padding: 1rem;">
                  <div class="columns is-multiline">
                    <div class="column pd-per is-3">
                      <b-field label="Tipo Documento:" :type="toShowType($v.formulario.tipoDocumentoIdentidadTransportista)" :message="toShowMessage($v.formulario.tipoDocumentoIdentidadTransportista)">
                        <b-select size="is-small" v-model="$v.formulario.tipoDocumentoIdentidadTransportista.$model" expanded>
                          <option v-for="(option, i) in tipoDocumento" :value="option.value" :key="i">
                            {{ option.text }}
                          </option>
                        </b-select>
                      </b-field>
                    </div>
                    <div class="column pd-per is-3">
                      <b-field label="Número Documento:" :type="toShowType($v.formulario.numeroDocumentoIdentidadTransportista)" :message="toShowMessage($v.formulario.numeroDocumentoIdentidadTransportista)">
                        <b-input size="is-small" v-model="$v.formulario.numeroDocumentoIdentidadTransportista.$model"></b-input>
                      </b-field>
                    </div>
                    <div class="column pd-per is-6">
                      <b-field label="Denominación:" :type="toShowType($v.formulario.denominacionTransportista)" :message="toShowMessage($v.formulario.denominacionTransportista)">
                        <b-input size="is-small" v-model="$v.formulario.denominacionTransportista.$model"></b-input>
                      </b-field>
                    </div>
                  </div>
                </div>
              </b-field>
            </div>
            <div class="column pd-per is-12">
              <b-field label="Conductor:">
                <div class="box" style="padding: 1rem;">
                  <div class="columns is-multiline">
                    <div class="column pd-per is-3">
                      <b-field label="Tipo Documento:" :type="toShowType($v.formulario.tipoDocumentoIdentidadConductor)" :message="toShowMessage($v.formulario.tipoDocumentoIdentidadConductor)">
                        <b-select size="is-small" v-model="$v.formulario.tipoDocumentoIdentidadConductor.$model" expanded>
                          <option v-for="(option, i) in tipoDocumento" :value="option.value" :key="i">
                            {{ option.text }}
                          </option>
                        </b-select>
                      </b-field>
                    </div>
                    <div class="column pd-per is-9">
                      <b-field label="Número Documento:" :type="toShowType($v.formulario.numeroDocumentoIdentidadConductor)" :message="toShowMessage($v.formulario.numeroDocumentoIdentidadConductor)">
                        <b-input size="is-small" v-model="$v.formulario.numeroDocumentoIdentidadConductor.$model"></b-input>
                      </b-field>
                    </div>
                  </div>
                </div>
              </b-field>
            </div>
            <div class="column pd-per is-4">
              <b-field label="modalidad de Traslado" :type="toShowType($v.formulario.modalidadTraslado)" :message="toShowMessage($v.formulario.modalidadTraslado)">
                <b-select size="is-small" v-model="$v.formulario.modalidadTraslado.$model" expanded>
                  <option v-for="(option, i) in modalidadTrasladoTraslado" :value="option.value" :key="i">
                  {{ option.text }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="column pd-per is-6">
              <b-field label="Fecha inicio" :type="toShowType($v.fechaInicioTraslado)" :message="toShowMessage($v.fechaInicioTraslado)">
                <b-datepicker size="is-small" v-model="$v.fechaInicioTraslado.$model" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                </b-datepicker>
              </b-field>
            </div>
            <div class="column pd-per is-2">
              <b-field label="Placa 2" :type="toShowType($v.formulario.numeroPlacaVehiculo)" :message="toShowMessage($v.formulario.numeroPlacaVehiculo)">
                <b-input size="is-small" v-model="$v.formulario.numeroPlacaVehiculo.$model" expanded>
                </b-input>
              </b-field>
            </div>
            <div class="column pd-per is-12 has-text-centered">
              <a class="button is-primary is-rounded" @click="agregar()">Agregar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import validationsMixin from '../../../validations/index';
  import Methods from '../../../api/methods';
  import qs from "qs"
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
  import {
    mapGetters
  } from 'vuex';
  import dateformat from 'dateformat'

  export default {
    mixins: [validationsMixin],
    data() {
      return {
        formulario:{
          modalidadTraslado: '01',
          fechaInicioTraslado: null,
          numeroDocumentoIdentidadTransportista: null,
          tipoDocumentoIdentidadTransportista: null, //'1',
          denominacionTransportista: null,
          numeroPlacaVehiculo: null,
          numeroDocumentoIdentidadConductor: null,
          tipoDocumentoIdentidadConductor: null, //'1'
        },
        fechaInicioTraslado: null
      }
    },
    validations() {
      const result = {
        formulario: {
          modalidadTraslado: {
            required
          },
          fechaInicioTraslado: {
            required
          },
          numeroDocumentoIdentidadTransportista: {},
          tipoDocumentoIdentidadTransportista: {
            //required
          },
          denominacionTransportista: {
            //required
          },
          numeroPlacaVehiculo: {            
            alphaNum,
            minLength: minLength(6),
            maxLength: maxLength(6)
          },
          numeroDocumentoIdentidadConductor: {},
          tipoDocumentoIdentidadConductor: {
            //required
          }
        },
        fechaInicioTraslado: {
          required
        }
      }
      if(this.formulario.modalidadTraslado == '02'){
        result.formulario.numeroPlacaVehiculo = {
          required,
          alphaNum,
          minLength: minLength(6),
          maxLength: maxLength(6)
        }
      }
      if (this.formulario.tipoDocumentoIdentidadTransportista == '1') {
        result.formulario.numeroDocumentoIdentidadTransportista = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(8),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadTransportista == '4') {
        result.formulario.numeroDocumentoIdentidadTransportista = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else if (this.formulario.tipoDocumentoIdentidadTransportista == '6') {
        result.formulario.numeroDocumentoIdentidadTransportista = {
          //required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadTransportista == '7') {
        result.formulario.numeroDocumentoIdentidadTransportista = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else {
        result.formulario.numeroDocumentoIdentidadTransportista = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(15),
          alphaNum
        };
      }

      if (this.formulario.tipoDocumentoIdentidadConductor == '1') {
        result.formulario.numeroDocumentoIdentidadConductor = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(8),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadConductor == '4') {
        result.formulario.numeroDocumentoIdentidadConductor = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else if (this.formulario.tipoDocumentoIdentidadConductor == '6') {
        result.formulario.numeroDocumentoIdentidadConductor = {
          //required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadConductor == '7') {
        result.formulario.numeroDocumentoIdentidadConductor = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else {
        result.formulario.numeroDocumentoIdentidadConductor = {
          //required,
          minLength: minLength(8),
          maxLength: maxLength(15),
          alphaNum
        };
      }

      return result;
    },
    methods: {
      agregar(){
        this.$v.formulario.$touch();
        if(!this.$v.formulario.$error){
          this.$emit('addTraslado', this.formulario)
          this.formulario = {
            modalidadTraslado: '01',
            fechaInicioTraslado: null,
            numeroDocumentoIdentidadTransportista: null,
            tipoDocumentoIdentidadTransportista: '1',
            denominacionTransportista: null,
            numeroPlacaVehiculo: null,
            numeroDocumentoIdentidadConductor: null,
            tipoDocumentoIdentidadConductor: '1'
          };
        }
      },
      watchNumeroTransportista(){
        if(!this.$v.formulario.numeroDocumentoIdentidadTransportista.$error){
          if(this.formulario.tipoDocumentoIdentidadTransportista=='6'){
            const params = qs.stringify({
              ruc: this.formulario.numeroDocumentoIdentidadTransportista
            })
            const url = `api/sunat-buscar-ruc?${params}`
            Methods.doGet(this, url)
              .then(response => {
                this.formulario.denominacionTransportista = response.nombre_o_razon_social;
              })
          }else if(this.formulario.tipoDocumentoIdentidadTransportista == '1'){
            const params = qs.stringify({
              dni: this.formulario.numeroDocumentoIdentidadTransportista
            })
            const url = `api/reniec-buscar-dni?${params}`
            Methods.doGet(this, url)
              .then(data => {
                if(data){
                  this.formulario.denominacionTransportista = data.nombre;
                }
              })
          }else{
            this.formulario.denominacionTransportista = null;
          }
        }
      }
    },
    watch:{
      'formulario.numeroDocumentoIdentidadTransportista':'watchNumeroTransportista',
      'fechaInicioTraslado':{
        handler: function () {
          this.formulario.fechaInicioTraslado = dateformat(this.fechaInicioTraslado, "yyyy-mm-dd");
        }
      }
    },
    computed: {
      ...mapGetters({
        'getCatalogo06': 'catalogos/getCatalogo06'
      }),
      ...mapGetters({
        'getCatalogo18': 'catalogos/getCatalogo18'
      }),
      tipoDocumento() {
        const listado = [];
        this.getCatalogo06.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      },
      modalidadTrasladoTraslado() {
        const listado = [];
        this.getCatalogo18.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      }
    }
  }
</script>
