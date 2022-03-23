<template>
  <div>
    <div v-if="getCompany.viewGuia">
      <form>
        <div class="columns is-multiline">
          <div class="column pd-per is-12" v-show="formulario.tipoDocumentoIdentidadTercero<0">
            <b-field label="Destinatario:">
              <div style="padding: 1rem;">
                <div class="columns is-multiline">
                  <div class="column pd-per is-3">
                    <b-field label="Tipo Documento:" :type="toShowType($v.formulario.tipoDocumentoIdentidadDestinatario)" :message="toShowMessage($v.formulario.tipoDocumentoIdentidadDestinatario)">
                      <b-select size="is-small" v-model="$v.formulario.tipoDocumentoIdentidadDestinatario.$model" expanded>
                        <option value="-1">Tipo documento</option>
                        <option v-for="(option, i) in tipoDocumento" :value="option.value" :key="i">
                          {{ option.text }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-3">
                    <b-field label="Número Documento:" :type="toShowType($v.formulario.numeroDocumentoIdentidadDestinatario)" :message="toShowMessage($v.formulario.numeroDocumentoIdentidadDestinatario)">
                      <b-input size="is-small" v-model="$v.formulario.numeroDocumentoIdentidadDestinatario.$model"></b-input>
                    </b-field>
                  </div>
                  <div class="column pd-per is-6">
                    <b-field label="Denominación:" :type="toShowType($v.formulario.denominacionDestinatario)" :message="toShowMessage($v.formulario.denominacionDestinatario)">
                      <b-input size="is-small" v-model="$v.formulario.denominacionDestinatario.$model"></b-input>
                    </b-field>
                  </div>
                </div>
              </div>
            </b-field>
          </div>
          <div class="column pd-per is-12"  v-show="formulario.tipoDocumentoIdentidadDestinatario<0">
            <b-field label="Proveedor:">
              <div style="padding: 1rem;">
                <div class="columns is-multiline">
                  <div class="column pd-per is-3">
                    <b-field label="Tipo Documento:">
                      <b-select size="is-small" v-model="$v.formulario.tipoDocumentoIdentidadTercero.$model" expanded>
                        <option value="-1">Tipo documento</option>
                        <option v-for="(option, i) in tipoDocumento" :value="option.value" :key="i">
                          {{ option.text }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-3">
                    <b-field label="Número Documento:" :type="toShowType($v.formulario.numeroDocumentoIdentidadTercero)" :message="toShowMessage($v.formulario.numeroDocumentoIdentidadTercero)">
                      <b-input size="is-small" v-model="$v.formulario.numeroDocumentoIdentidadTercero.$model"></b-input>
                    </b-field>
                  </div>
                  <div class="column pd-per is-6">
                    <b-field label="Denominación:" :type="toShowType($v.formulario.denominacionTercero)" :message="toShowMessage($v.formulario.denominacionTercero)">
                      <b-input size="is-small" v-model="$v.formulario.denominacionTercero.$model"></b-input>
                    </b-field>
                  </div>
                </div>
              </div>
            </b-field>
          </div>
          <div class="column pd-per is-12">
            <div class="columns is-multiline">
              <div class="column pd-per is-1" >
                <b-field v-if="!existenSeries" label="Serie:" :type="toShowType($v.formulario.serie)" :message="toShowMessage($v.formulario.serie)">
                  <b-input :disabled="isEdit" size="is-small" v-model="$v.formulario.serie.$model"></b-input>
                </b-field>
                <b-field v-if="existenSeries" label="Serie:" :type="toShowType($v.formulario.serie)" :message="toShowMessage($v.formulario.serie)">
                  <b-select :disabled="isEdit" size="is-small" expanded v-model="$v.formulario.serie.$model">
                    <option v-for="(option, i) in seriesDisponibles" :value="option.value" :key="i">
                      {{ option.text}}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column pd-per is-1">
                <b-field label="Número:" :type="toShowType($v.formulario.numero)" :message="toShowMessage($v.formulario.numero)">
                  <b-input :disabled="isEdit" size="is-small" type="number" v-model="$v.formulario.numero.$model"></b-input>
                </b-field>
              </div>
              <div class="column pd-per is-2">
                <b-field label="Fecha emisión:" :type="toShowType($v.fechaEmision)" :message="toShowMessage($v.fechaEmision)">
                  <b-datepicker size="is-small" v-model="$v.fechaEmision.$model" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                  </b-datepicker>
                </b-field>
              </div>
              <div class="column pd-per is-2">
                <b-field label="Unidad Medida"
                          :type="toShowType($v.formulario.unidadMedidaPesoBruto)"
                          :message="toShowMessage($v.formulario.unidadMedidaPesoBruto)">
                    <b-input disabled size="is-small" v-model="$v.formulario.unidadMedidaPesoBruto.$model"></b-input>
                  </b-field>
              </div>
              <div class="column pd-per is-1">
                <b-field label="Peso bruto"
                          :type="toShowType($v.formulario.pesoTotalBrutoBienes)"
                          :message="toShowMessage($v.formulario.pesoTotalBrutoBienes)">
                    <b-input size="is-small" v-model="$v.formulario.pesoTotalBrutoBienes.$model"></b-input>
                  </b-field>
              </div>
              <div class="column pd-per is-2">
                <b-field  label="Número contenedor"
                          :type="toShowType($v.formulario.numeroContenedor)"
                          :message="toShowMessage($v.formulario.numeroContenedor)">
                    <b-input size="is-small" v-model="$v.formulario.numeroContenedor.$model"></b-input>
                  </b-field>
              </div>
              <div class="column pd-per is-1">
                <b-field  label="Cód. puerto"
                          :type="toShowType($v.formulario.codigoPuerto)"
                          :message="toShowMessage($v.formulario.codigoPuerto)">
                    <b-input size="is-small" v-model="$v.formulario.codigoPuerto.$model" maxlength="3" class="my-input"></b-input>
                  </b-field>
              </div>
              <div class="column pd-per is-2">
                <b-field label="Indicador de Transbordo:">
                  <b-switch v-model="$v.formulario.indicadorTransbordoProgramado.$model">
                  </b-switch>
                </b-field>
              </div>
            </div>
            <div class="columns is-multiline">
              <div class="column pd-per is-3">
                <b-field label="Motivo:">
                  <b-select size="is-small"
                            v-model="$v.formulario.motivoTraslado.$model"
                            expanded>
                    <option v-for="(option, i) in motivosTraslado" :value="option.value" :key="i">
                      {{ option.text }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column pd-per is-7">
                <b-field label="Descripción de motivo de traslado:" :type="toShowType($v.formulario.descripcionMotivoTraslado)" :message="toShowMessage($v.formulario.descripcionMotivoTraslado)">
                  <b-input size="is-small" v-model="$v.formulario.descripcionMotivoTraslado.$model"></b-input>
                </b-field>
              </div>
              <div class="column pd-per is-1">
                <b-field label="N° bultos:" :type="toShowType($v.formulario.numeroBultos)" :message="toShowMessage($v.formulario.numeroBultos)">
                  <b-input size="is-small" type="number" v-model="$v.formulario.numeroBultos.$model"></b-input>
                </b-field>
              </div>
            </div>
            <!--<b-field label="Bienes:">
              <div class="box" style="padding: 1rem;">
                <bienes-item v-model="$v.formulario.detailsGuiaRemision" @borrarBien="borrarBien($event)">
                </bienes-item>
                <hr style="margin: 0.9rem 0;">
                <a @click="addBien" class="button is-primary is-rounded is-small">Agregar Bien</a>
              </div>
            </b-field>-->
          </div>
          <div class=" pd-per">
            <!--<b-field v-if="!existenSeries" label="Serie:" :type="toShowType($v.formulario.serie)" :message="toShowMessage($v.formulario.serie)">
              <b-input size="is-small" v-model="$v.formulario.serie.$model"></b-input>
            </b-field>
            <b-field v-if="existenSeries" label="Serie:" :type="toShowType($v.formulario.serie)" :message="toShowMessage($v.formulario.serie)">
              <b-select size="is-small" expanded v-model="$v.formulario.serie.$model">
                <option v-for="(option, i) in seriesDisponibles" :value="option.value" :key="i">
                  {{ option.text}}
                </option>
              </b-select>
            </b-field>-->
          </div>
          <div class=" pd-per ">
            <!--<b-field label="Número:" :type="toShowType($v.formulario.numero)" :message="toShowMessage($v.formulario.numero)">
              <b-input size="is-small" type="number" v-model="$v.formulario.numero.$model"></b-input>
            </b-field>-->
          </div>
          <div class=" pd-per ">
            <!--<b-field label="Fecha emisión:" :type="toShowType($v.fechaEmision)" :message="toShowMessage($v.fechaEmision)">
              <b-datepicker size="is-small" v-model="$v.fechaEmision.$model" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
              </b-datepicker>
            </b-field>-->
          </div>
          <div class="column pd-per is-12">
            <b-field label="Bienes:">
              <div class="box" style="padding: 1rem;">
                <bienes-item v-model="$v.formulario.detailsGuiaRemision" @selectedProducto="selectedProducto(...arguments)"
                            ref="lineaClass"
                            @borrarProducto="borrarProducto($event)" @editarProducto="editarProducto($event)"
                            @changeFieldDescription="changeFieldDescription($event)">
                </bienes-item>
                <hr style="margin: 0.9rem 0;">
                <a @click="addProducto" class="button is-primary is-rounded is-small">Agregar producto</a>
              </div>
            </b-field>
          </div>
          <div class="column pd-per is-12">
            <b-field label="Punto de Partida:">
              <div class="box" style="padding: 1rem;">
                <div class="columns is-multiline">
                  <div class="column pd-per is-4">
                    <b-field label="Departamento:"
                          :type="toShowType($v.departamentoPartida)"
                          :message="toShowMessage($v.departamentoPartida)">
                      <b-select size="is-small" expanded
                                v-model="$v.departamentoPartida.$model">
                        <option v-for="(option, i) in getDepartamentos" :value="option.value" :key="i">
                          {{ option.text}}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-4">
                    <b-field label="Provincia:"
                          :type="toShowType($v.provinciaPartida)"
                          :message="toShowMessage($v.provinciaPartida)">
                      <b-select size="is-small" expanded
                                v-model="$v.provinciaPartida.$model">
                        <option v-for="(option, i) in listProvinciaPartida" :value="option.value" :key="i">
                          {{ option.text}}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-4">
                    <b-field label="Distrito:"
                          :type="toShowType($v.formulario.ubigeoPuntoPartida)"
                          :message="toShowMessage($v.formulario.ubigeoPuntoPartida)">
                      <b-select size="is-small" expanded
                                v-model="$v.formulario.ubigeoPuntoPartida.$model">
                        <option v-for="(option, i) in listDistritoPartida" :value="option.value" :key="i">
                          {{ option.text}}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-12">
                    <b-field label="Direccion:"
                            :type="toShowType($v.formulario.direccionPuntoPartida)"
                            :message="toShowMessage($v.formulario.direccionPuntoPartida)">
                      <b-input size="is-small" v-model="$v.formulario.direccionPuntoPartida.$model" expanded>
                      </b-input>
                    </b-field>
                  </div>
                </div>
              </div>
            </b-field>
          </div>
          <div class="column pd-per is-12">
            <b-field label="Punto de Llegada:">
              <div class="box" style="padding: 1rem;">
                <div class="columns is-multiline">
                  <div class="column pd-per is-4">
                    <b-field label="Departamento:"
                          :type="toShowType($v.departamentoLlegada)"
                          :message="toShowMessage($v.departamentoLlegada)">
                      <b-select size="is-small" expanded
                                v-model="$v.departamentoLlegada.$model">
                        <option v-for="(option, i) in getDepartamentos" :value="option.value" :key="i">
                          {{ option.text}}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-4">
                    <b-field label="Provincia:"
                          :type="toShowType($v.provinciaLlegada)"
                          :message="toShowMessage($v.provinciaLlegada)">
                      <b-select size="is-small" expanded
                                v-model="$v.provinciaLlegada.$model">
                        <option v-for="(option, i) in listProvinciaLlegada" :value="option.value" :key="i">
                          {{ option.text}}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-4">
                    <b-field label="Distrito:"
                          :type="toShowType($v.formulario.ubigeoPuntoLlegada)"
                          :message="toShowMessage($v.formulario.ubigeoPuntoLlegada)">
                      <b-select size="is-small" expanded
                                v-model="$v.formulario.ubigeoPuntoLlegada.$model">
                          <option v-for="(option, i) in listDistritoLlegada" :value="option.value" :key="i">
                          {{ option.text}}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column pd-per is-12">
                    <b-field label="Direccion:"
                            :type="toShowType($v.formulario.direccionPuntoLlegada)"
                            :message="toShowMessage($v.formulario.direccionPuntoLlegada)">
                      <b-input size="is-small" v-model="$v.formulario.direccionPuntoLlegada.$model" expanded>
                      </b-input>
                    </b-field>
                  </div>
                </div>
              </div>
            </b-field>
          </div>
          <div class="column pd-per is-12">
            <b-field label="Transporte:">
              <div class="box" style="padding: 1rem;">
                <a @click="showTras" class="button is-primary is-rounded is-small">Agregar Traslado</a>
                <hr style="margin: 0.9rem 0;">
                <b-table
                  :data="formulario.tramos"
                  :mobile-cards="true">
                  <template slot-scope="props">
                    <b-table-column  label="Tip. Doc. Tans.">
                      {{ props.row.tipoDocumentoIdentidadTransportista | FiltroNTipoDocumento }}
                    </b-table-column>
                    <b-table-column  label="Doc. Tans.">
                      {{ props.row.numeroDocumentoIdentidadTransportista }}
                    </b-table-column>
                    <b-table-column  label="Deno. Tans.">
                      {{ props.row.denominacionTransportista }}
                    </b-table-column>
                    <b-table-column  label="Tip. Doc. Conductor">
                      {{ props.row.tipoDocumentoIdentidadConductor | FiltroNTipoDocumento }}
                    </b-table-column>
                    <b-table-column  label="Num. Doc. Conductor">
                      {{ props.row.numeroDocumentoIdentidadConductor }}
                    </b-table-column>
                    <b-table-column  label="Modalidad">
                      {{ props.row.modalidadTraslado | FiltroModalidadTraslado }}
                    </b-table-column>
                    <b-table-column  label="Fecha de Inicio">
                      {{ props.row.fechaInicioTraslado }}
                    </b-table-column>
                    <b-table-column  label="Placa 1">
                      {{ props.row.numeroPlacaVehiculo }}
                    </b-table-column>
                    <b-table-column label="Borrar">
                      <a class="button is-danger is-rounded is-small" @click="borrarTraslado(props.index)"><b-icon icon="delete"></b-icon></a>
                    </b-table-column>
                  </template>
                </b-table>
              </div>
            </b-field>
          </div>
          <div class="column pd-per is-12">
            <b-field label="Observación">
              <b-input size="is-small" v-model="datosExtras.observacion" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-4">
            <b-field label="Brevete">
              <b-input size="is-small" v-model="datosExtras.brevete" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-4">
            <b-field label="Modelo de Vehiculo">
              <b-input size="is-small" v-model="datosExtras.modeloVehiculo" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-4">
            <b-field label="Codigo MTC">
              <b-input size="is-small" v-model="datosExtras.codigoMTC" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-4">
            <b-field label="Vendedor">
              <b-input size="is-small" v-model="datosExtras.vendedor" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-4">
            <b-field label="Cod. cliente">
              <b-input size="is-small" v-model="datosExtras.codCliente" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-4">
            <b-field label="Orden de compra">
              <b-input size="is-small" v-model="datosExtras.ordenCompra" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-12">
            <b-field label="Condiciones">
              <b-input size="is-small" v-model="datosExtras.condicion" type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-12 has-text-centered">
            <button type="button" @click="generarGuia()" class="button is-success is-rounded is-large">Generar Comprobante</button>
          </div>
        </div>
      </form>
      <b-modal :active.sync="isModalTraslado">
        <traslado-item @addTraslado="addTraslado($event)">
        </traslado-item>
      </b-modal>
      <b-modal :active.sync="isCardModalEditarProducto" :width="680" custom-class="modal-content-two">
        <div class="card">
          <header class="modal-card-head">
            <p class="modal-card-title">{{product}}</p>
          </header>
          <section class="modal-card-body formproducto">
            <bienes-itemform v-model="$v.formulario.detailsGuiaRemision" v-bind:keying="idindice"
                            @selectedProducto="selectedProducto(...arguments)"
                            @borrarProducto="borrarProducto($event)" @validatePorcentaje="validatePorcentaje($event)"
                            @changeFieldDescription="changeFieldDescription($event)">
            </bienes-itemform>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="isCardModalEditarProducto=false">{{strSalir}}</button>
            <button class="button is-primary" @click="save(idindice)">{{strsave}}</button>
          </footer>
        </div>
      </b-modal>
      <b-modal :active.sync="isCardModalBien" :width="640">
        <div class="card">
          <header class="modal-card-head">
            <p class="modal-card-title">{{product}}</p>
          </header>
          <section class="modal-card-body ">
            <bienes-itemform v-model="$v.formulario.detailsGuiaRemision" v-bind:keying="idindice"
                            @selectedProducto="selectedProducto(...arguments)"
                            @borrarProducto="borrarProducto($event)" @validatePorcentaje="validatePorcentaje($event)"
                            @changeFieldDescription="changeFieldDescription($event)">
            </bienes-itemform>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="borrar(formulario.detailsGuiaRemision.length-1)">{{strSalir}}</button>
            <button class="button is-primary" @click="save(formulario.detailsGuiaRemision.length-1)">{{strsave}}</button>
            <span>{{validateform}}</span>
          </footer>
        </div>
      </b-modal>
    </div>
    <div v-else>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Guias de Remision CERTIFAKT
          </p>
          <span class="icon">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </header>
        <div class="card-content">
          <div class="content">
            El servicio de Guias de Remision para este usuario no se encuentra habilitado.
            <br/>
            Para informes comuniquese con su proveedor del servicio.
            <br/>
            Area comercial de CERTIFAKT : <a href="#">jruiz@certicom.com.pe</a>. <span>Telefono: </span> <a href="#"> 975 818 189</a>
            <br>
          </div>
        </div>
        <footer class="card-footer">
          <router-link to="/" class="card-footer-item"><b-icon icon="home" size="is-medium" type="is-success"></b-icon></router-link>
          <b-icon icon="car" class="card-footer-item" size="is-medium" type="is-primary"></b-icon>

        </footer>
      </div>
    </div>
  </div>
</template>

<script>

  import BienesItem from './BienesItem'
  import TrasladoItem from './TrasladoItem'
  import BienesItemform from './BienesItemform'
  import Methods from '../../../api/methods'
  import qs from "qs"
  import { mapGetters } from 'vuex'
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
  import validationsMixin from '../../../validations/index'
  import dateformat from 'dateformat'
  import Util from '../../../util'
  const unidadDefault = Util.getUnidades().default

  export default {
    mixins: [validationsMixin],
    components: {
      BienesItem,
      TrasladoItem,
      BienesItemform
    },
    props: [
      'id',
      'isEdit',
      'idEdit',
      'isAnula',
      'idAnula',
    ],
    data() {
      return {
        idGuia: null,
        idEdit: null,
        idAnula: null,
        btnsend: false,
        product: 'Producto',
        strSalir: 'Salir',
        validateform: '',
        strsave: 'Guardar',
        idindice: 0,
        estPorcentaje: false,
        formulario:{
          serie: null,
          numero: null,
          serieBaja: null,
          numeroBaja: null,
          fechaEmision: null,
          observaciones: null,
          numeroRelacionado: null,
          numeracionDAM: null,
          tipoDocumentoRelacionado: null,
          numeroDocumentoIdentidadDestinatario: null,
          tipoDocumentoIdentidadDestinatario: "-1",
          denominacionDestinatario: null,
          numeroDocumentoIdentidadTercero: null,
	        tipoDocumentoIdentidadTercero: "-1",
	        denominacionTercero: null,
          motivoTraslado: "01",
          descripcionMotivoTraslado: null,
          indicadorTransbordoProgramado: false,
          pesoTotalBrutoBienes: null,
          unidadMedidaPesoBruto: "KGM",
          numeroBultos: null,
          ubigeoPuntoLlegada: null,
          direccionPuntoLlegada: null,
          numeroContenedor: null,
          ubigeoPuntoPartida: null,
          direccionPuntoPartida: null,
          codigoPuerto: null,

          tramos: [],
          detailsGuiaRemision: []
        },
        isCardModalBien: false,
        seriesDisponibles: [],
        fechaEmision: null,
        departamentoPartida: '15',
        provinciaPartida: null,
        departamentoLlegada: '15',
        isCardModalEditarProducto: false,
        provinciaLlegada: null,
        listProvinciaPartida: [],
        listDistritoPartida: [],
        listProvinciaLlegada: [],
        listDistritoLlegada: [],
        isModalTraslado: false,
        datosExtras: {
          observacion: null,
          brevete: null,
          modeloVehiculo: null,
          codigoMTC: null,
          vendedor: null,
          codCliente: null,
          ordenCompra: null,
          condicion: null
        },
      }
    },
    validations() {
      const result = {
        formulario:{
          serie: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(4),
            alphaNum
          },
          numero: {
            required,
            numeric
          },
          fechaEmision: {
            required
          },
          observaciones: {},
          numeroRelacionado: {
            numeric
          },
          tipoDocumentoRelacionado: {},
          numeroDocumentoIdentidadDestinatario: {},
          tipoDocumentoIdentidadDestinatario: {

          },
          denominacionDestinatario: {

          },
          numeroDocumentoIdentidadTercero: {},
	        tipoDocumentoIdentidadTercero: {},
	        denominacionTercero: {

          },
          motivoTraslado: {},
          descripcionMotivoTraslado: {
            required
          },
          indicadorTransbordoProgramado: {},
          pesoTotalBrutoBienes: {
            required,
            decimal
          },
          unidadMedidaPesoBruto: {
            required
          },
          numeroBultos: {
            required,
            numeric
          },
          ubigeoPuntoLlegada: {
            required
          },
          direccionPuntoLlegada: {

          },

          numeroContenedor: {},
          ubigeoPuntoPartida: {
            required
          },
          direccionPuntoPartida: {

          },
          codigoPuerto: {

          },
          detailsGuiaRemision: {

            $each: {
              inc_igv: {
                required
              },
              isTextAreaDescription: {
                required
              },
              unidadMedida: {
                required
              },
              cantidad: {
                required,
                decimal
              },
              descripcion: {
                required
              },
              valor_unitario: {
                required,
                decimal
              },
              precio_total: {
                required,
                decimal
              },
              precioItem: {
                required,
                decimal
              },
              precio_venta_unitario: {
                minValue: minValue(0.0),
                decimal
              },
              instrucciones_especiales:{
              
              },
              peso_unitario: {
                //decimal
              },
              igv: {
                decimal
              },
              tipo_afectacion_igv: {
                required
              },
              porcentaje_trib_vta_grat: {
                decimal,
                minValue: minValue(0),
                maxValue: maxValue(100)
              },
              mostraPorc: {},
              codigo_producto_sunat: {},
              habilitarTipo: {},
            }
          },
          tramos:{
            $each: {
              denominacionTransportista: {
                required
              },
              fechaInicioTraslado: {
                required
              },
              modalidadTraslado: {
                required
              },
              numeroDocumentoIdentidadConductor: {
                required
              },
              numeroDocumentoIdentidadTransportista: {
                required
              },
              numeroPlacaVehiculo: {
                required
              },
              tipoDocumentoIdentidadConductor: {
                required
              },
              tipoDocumentoIdentidadTransportista: {
                required
              }
            }
          },
          itemsEditar: {
            $each: {
              inc_igv: {
                required
              },
              isTextAreaDescription: {
                required
              },
              unidadMedida: {
                required
              },
              cantidad: {
                required,
                decimal
              },
              descripcion: {
                required
              },
              valor_unitario: {
                required,
                decimal
              },
              precio_total: {
                required,
                decimal
              },
              precioItem: {
                required,
                decimal
              },
              precio_venta_unitario: {
                required,
                minValue: minValue(0.0),
                decimal
              },
              peso_unitario: {
                decimal
              },
              instrucciones_especiales: {

              },
              igv: {
                decimal
              },
              tipo_afectacion_igv: {
                required
              },
              porcentaje_trib_vta_grat: {
                decimal,
                minValue: minValue(0.0),
                maxValue: maxValue(100)
              },
              mostraPorc: {},
              codigo_producto_sunat: {},
              habilitarTipo: {},
            }
          },
          tramos: {}
        },
        fechaEmision: {},
        departamentoPartida: {
          required
        },
        provinciaPartida: {
          required
        },
        departamentoLlegada: {
          required
        },
        provinciaLlegada: {
          required
        }
      }

      if (this.formulario.tipoDocumentoIdentidadDestinatario == '1') {
        result.formulario.numeroDocumentoIdentidadDestinatario = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(8),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadDestinatario == '4') {
        result.formulario.numeroDocumentoIdentidadDestinatario = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else if (this.formulario.tipoDocumentoIdentidadDestinatario == '6') {
        result.formulario.numeroDocumentoIdentidadDestinatario = {
          required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadDestinatario == '7') {
        result.formulario.numeroDocumentoIdentidadDestinatario = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else {
        result.formulario.numeroDocumentoIdentidadDestinatario = {

        };
      }

      if (this.formulario.tipoDocumentoIdentidadTercero == '1') {
        result.formulario.numeroDocumentoIdentidadTercero = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(8),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadTercero == '4') {
        result.formulario.numeroDocumentoIdentidadTercero = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else if (this.formulario.tipoDocumentoIdentidadTercero == '6') {
        result.formulario.numeroDocumentoIdentidadTercero = {
          required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          numeric
        };
      } else if (this.formulario.tipoDocumentoIdentidadTercero == '7') {
        result.formulario.numeroDocumentoIdentidadTercero = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else {
        result.formulario.numeroDocumentoIdentidadTercero = {

        };
      }

      if(this.formulario.motivoTraslado == '08'){
        result.formulario.numeroContenedor = {
          required
        };
        this.formulario.numeracionDAM = "01"
      }

      if(this.formulario.detailsGuiaRemision != null){
        for (let index = 0; index < this.formulario.detailsGuiaRemision.length; index++) {
          this.formulario.detailsGuiaRemision[index].cantidad = parseFloat(this.formulario.detailsGuiaRemision[index].cantidad);
        }
      }

      if(this.formulario.pesoTotalBrutoBienes != null){
        this.formulario.pesoTotalBrutoBienes = parseFloat(this.formulario.pesoTotalBrutoBienes);
      }
      if(this.formulario.numeroBultos != null){
        this.formulario.numeroBultos = parseInt(this.formulario.numeroBultos);
      };
      if(this.formulario.numero != null){
        this.formulario.numero = parseInt(this.formulario.numero);
      }

      return result;
    },
    beforeMount() {
      const fechaActual = new Date();
      this.fechaEmision = fechaActual;
      this.formulario.fechaEmision = dateformat(this.fechaActual, "yyyy-mm-dd");
      this.obtenerProvinciaPartida();
      this.obtenerProvinciaLlegada();
      this.cambioRuta();
    },
    mounted() {

      if (this.getPuntoVenta) {
        this.getPuntoVenta.series.forEach((ser, i) => {
          if (ser.tipoDocumento == '09')
            this.seriesDisponibles.push({
              value: ser.serie,
              text: ser.serie
            })
        })
        if (this.seriesDisponibles[0])
          this.formulario.serie = this.seriesDisponibles[0].value
      }
      this.getDataFromGuia()
    },
    methods: {
      borrar(index) {
        this.isCardModalBien = false
      },
      addProducto(){
        this.isCardModalBien = true
        this.idindice = this.formulario.detailsGuiaRemision.length
        this.formulario.detailsGuiaRemision.push({
          isTextAreaDescription: false,
          inc_igv: this.preciosIncluidoIgv,
          unidadMedida: unidadDefault ? unidadDefault.code : 'NIU',
          cantidad: 1,
          descripcion: null,
          codigoItem: null,
          valor_unitario: 0.0000,
          precio_total: 0.00,
          peso_unitario: 0,
          precioItem: 0.00,
          precio_venta_unitario: 0.00,
          instrucciones_especiales: null,
          igv: 0.00,
          tipo_afectacion_igv: '10',
          porcentaje_trib_vta_grat: null,
          codigo_producto_sunat: null,
          habilitarTipo: true,
        });
      },
      changeFieldDescription(index) {
        this.formulario.detailsGuiaRemision[index].isTextAreaDescription = !this.formulario.detailsGuiaRemision[index].isTextAreaDescription
      },
      selectedProducto(index, option) {
        if (option != null) {
          this.formulario.detailsGuiaRemision[index].unidadMedida = option.unidadMedida
          this.formulario.detailsGuiaRemision[index].codigoItem = option.codigo
          this.formulario.detailsGuiaRemision[index].valor_unitario = (option.valorVentaSinIgv)
          this.formulario.detailsGuiaRemision[index].precio_venta_unitario = (option.valorVentaConIgv)
          this.formulario.detailsGuiaRemision[index].precioItem = ((option.valorVentaSinIgv * this.formulario.detailsGuiaRemision[index].cantidad))
          this.formulario.detailsGuiaRemision[index].precio_total = ((option.valorVentaConIgv * this.formulario.detailsGuiaRemision[index].cantidad))
          this.formulario.detailsGuiaRemision[index].igv = (this.formulario.detailsGuiaRemision[index].precio_total - this.formulario.detailsGuiaRemision[index].precioItem)

        }
      },
      borrarProducto(index) {
        this.formulario.detailsGuiaRemision.splice(index, 1);
      },
      editarProducto(indice) {
        this.idindice = indice
        this.isCardModalEditarProducto = true
      },
      validatePorcentaje(est) {
        this.estPorcentaje = est
      },
      save(index) {

        this.$v.formulario.detailsGuiaRemision.$touch()

        if (this.formulario.detailsGuiaRemision[index].codigo_producto_sunat == null) {
          this.formulario.detailsGuiaRemision[index].codigo_producto_sunat = ""
        }
        if (this.formulario.detailsGuiaRemision[index].codigo_producto_sunat == 0) {
          this.formulario.detailsGuiaRemision[index].codigo_producto_sunat = ""
        }
        if (this.formulario.detailsGuiaRemision[index].codigo_producto_sunat == "0") {
          this.formulario.detailsGuiaRemision[index].codigo_producto_sunat = ""
        }
        var codprodsunat = this.formulario.detailsGuiaRemision[index].codigo_producto_sunat;

        if (codprodsunat.length > 0) {
          var codprod = codprodsunat.split("")
          for (var i = 0; i < codprodsunat.length; i++) {
            if (codprod[i] < 0 || codprod[i] >= 10) {
              this.btnsend = false
              this.$buefy.dialog.alert("Verifique el campo Codigo producto Sunat")
              return false
            }

          }
        }
        if (this.estPorcentaje && this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat == null) {
          this.btnsend = false
          this.validateform = "Verificar porcentaje de impuesto"
          return false
        } else {
          this.validateform = ""
        }

        if (this.estPorcentaje && this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat <= 0) {
          this.btnsend = false
          this.validateform = "Verificar porcentaje de impuesto"
          return false
        } else {
          this.validateform = ""
        }

        if (this.$v.formulario.detailsGuiaRemision.$error) {
          console.log(this.formulario.detailsGuiaRemision)
          console.log("error: "+this.$v.formulario.detailsGuiaRemision.$error)
          return false
        }

        if (this.formulario.detailsGuiaRemision[index].descripcion == "" || this.formulario.detailsGuiaRemision[index].descripcion == null || this.formulario.detailsGuiaRemision[index].valor_unitario <= 0) {
            if (this.formulario.detailsGuiaRemision[index].valor_unitario <= 0 ) {
            this.formulario.detailsGuiaRemision[index].valor_unitario = ""
            }
            this.btnsend = false
            return false

        }else if(this.formulario.detailsGuiaRemision[index].valor_unitario == 0 && this.formulario.detailsGuiaRemision[index].tipo_afectacion_igv == 21){
        }else {
          this.btnsend = true
          this.isCardModalBien = false
          this.isCardModalEditarProducto = false
        }

        if (this.formulario.detailsGuiaRemision[index].descripcion == "" || this.formulario.detailsGuiaRemision[index].descripcion == null || this.formulario.detailsGuiaRemision[index].valor_unitario < 0) {

        } else if(this.formulario.detailsGuiaRemision[index].valor_unitario == 0){

        }
        else {
          this.btnsend = true
          this.isCardModalBien = false
          this.isCardModalEditarProducto = false
        }
      },
      validar() {
        var resp = 0
        for (var i = 1; i < this.vuelines.length; i++) {
          var j = i + 1
          if ((this.vuelines[i][0]) != "") {
            (this.vuelines[i][0]).toUpperCase()
            var row = (this.vuelines[i][0]).split(",")
          }
        }
        this.convertObjects()
      },
      convertObjects() {
        const tabproduct = this.vuelines

        for (var i = 1; i < tabproduct.length; i++) {
          if ((this.vuelines[i][0]) != "") {
            var row = (this.vuelines[i][0]).split(",")
            var producto = {}
            var vunit = 0;
            if (row[4] == 10) {
              vunit = row[3] - row[3] * 0.18
            } else {
              vunit = row[3]
            }

            this.formulario.detailsGuiaRemision.push({
              isTextAreaDescription: false,
              inc_igv: this.preciosIncluidoIgv,
              unidadMedida: row[5],
              cantidad: row[2],
              descripcion: row[0] + " " + row[1],
              codigoItem: row[0] ? row[0] : "",
              igv: row[4] != null ? 18.00 : 0.00,
              tipo_afectacion_igv: row[4],
              porcentaje_trib_vta_grat: null,
              codigo_producto_sunat: null,
              valor_unitario: row[3],
              precio_venta_unitario: (row[3]),
              precio_total: row[2] * row[3],
              precioItem: row[2] * row[3],
              habilitarTipo: true,
            })
          }
        }
        this.estadoproductos = false

      },
      showTras() {
        this.isModalTraslado=true;
      },
      addTraslado(traslado){
        this.formulario.tramos.push(traslado);
        this.isModalTraslado=false
      },
      borrarTras(index){
        this.formulario.tramos.splice(index, 1);
      },
      obtenerSiguienteNumero() {
        if (!this.isEdit) {
          if (this.formulario.serie) {
            const url = `api/siguienteNumero/09/${this.formulario.serie}`
            Methods.doGet(this, url).then(numero => {
              this.formulario.numero = numero
            })

          }
        }

      },
      getDatatoAnular(){
        let idFind;
        if(this.isAnula){
          idFind = this.idAnula
        }else{
          idFind = this.id
        }

        if (idFind) {

        const params = qs.stringify({
            id: idFind
          })
        const url = `api/guiaById?${params}`
        Methods.doGet(this, url).then(data => {
          this.formulario = {
            serieBaja: data.serie,
            numeroBaja: data.numero
          }
        })
        console.log(this.formulario);
        }
      },
      getDataFromGuia(){
        //const idFind = this.isEdit ? this.idEdit : this.id
        var idFind;
        if(this.isEdit){
          idFind = this.idEdit
        }else if(this.isAnula){
          idFind = this.idAnula
        }else{
          idFind = this.id
        }
        if (idFind) {
          const params = qs.stringify({
            id: idFind
          })
          const url = `api/guiaById?${params}`
          Methods.doGet(this, url).then(data => {
            console.log(data);
            const prods = [];
            const tramos = [];
            const camposAdicionales = [];

            data.detailsGuiaRemision.forEach(p => {

              var pr = {
                inc_igv: this.preciosIncluidoIgv,
                cantidad: p.cantidad,
                descripcion: p.descripcion,
                isTextAreaDescription: false,
                unidadMedida: p.unidadMedida,
                valor_unitario: p.valor_unitario,
                codigoItem: p.codigoItem,
                precioItem: parseFloat(p.precioItem * p.cantidad),
                codigo_producto_sunat: p.codigoProductoSunat,
                valor_unitario: (p.valorUnitario == 0 ? p.valorReferencialUnitario : p.valorUnitario),
                porcentaje_trib_vta_grat: p.porcentajeTributoVentaGratuita,
                precio_venta_unitario: p.precioVentaUnitario ? p.precioVentaUnitario : p.valorReferencialUnitario,
                valor_venta: parseFloat(p.valorVenta),
                precio_total: parseFloat(p.precioVentaUnitario * p.cantidad),
                tipo_afectacion_igv: p.codigoTipoAfectacionIGV,
              };
              prods.push(pr);
            });



            data.tramos.forEach(t => {
              var tr = {
                denominacionTransportista: t.denominacionTransportista,
                fechaInicioTraslado: t.fechaInicioTraslado,
                modalidadTraslado: t.modalidadTraslado,
                numeroDocumentoIdentidadConductor: t.numeroDocumentoIdentidadConductor,
                numeroDocumentoIdentidadTransportista: t.numeroDocumentoIdentidadTransportista,
                numeroPlacaVehiculo: t.numeroPlacaVehiculo,
                tipoDocumentoIdentidadConductor: t.tipoDocumentoIdentidadConductor,
                tipoDocumentoIdentidadTransportista: t.tipoDocumentoIdentidadTransportista
              };
              tramos.push(tr);
            })

            data.aditionalFields.forEach(c => {
              var campo = {
                nombre_campo: c.nombreCampo,
                valor_campo: c.valorCampo
              };
              camposAdicionales.push(campo);
              if(c.nombreCampo == 'VENDEDOR'){
                this.datosExtras.vendedor = c.valorCampo
              }
              if(c.nombreCampo == 'BREVETE'){
                this.datosExtras.brevete = c.valorCampo
              }
              if(c.nombreCampo == 'CONDICION'){
                this.datosExtras.condicion = c.valorCampo
              }
              if(c.nombreCampo == 'CODIGO CLIENTE'){
                this.datosExtras.codCliente = c.valorCampo
              }
              if(c.nombreCampo == 'ORDEN DE COMPRA'){
                this.datosExtras.ordenCompra = c.valorCampo
              }
              if(c.nombreCampo == 'MARCA/MODELO'){
                this.datosExtras.modeloVehiculo = c.valorCampo
              }              
              if(c.nombreCampo == 'FECHA INICIO DE TRASLADO'){
                this.datosExtras.modeloVehiculo = c.valorCampo
              }

              if(c.nombreCampo == 'OBSERVACION'){
                this.datosExtras.observacion = c.valorCampo
              }               
              if(c.nombreCampo == 'CODIGO MTC'){
                this.datosExtras.codigoMTC = c.valorCampo
              }
              
            })

            if(this.isEdit){
              this.formulario = {
                serie: data.serie,
                numero: data.numero,
                fechaEmision: data.fechaEmision,
                observaciones: data.observaciones,
                numeroRelacionado: data.numeroRelacionado,
                numeracionDAM: data.numeracionDAM,
                tipoDocumentoRelacionado: data.tipoDocumentoRelacionado,
                numeroDocumentoIdentidadDestinatario: data.numeroDocumentoIdentidadDestinatario,
                tipoDocumentoIdentidadDestinatario: data.tipoDocumentoIdentidadDestinatario,
                denominacionDestinatario: data.denominacionDestinatario,
                numeroDocumentoIdentidadTercero: data.numeroDocumentoIdentidadTercero,
                tipoDocumentoIdentidadTercero: data.tipoDocumentoIdentidadTercero,
                denominacionTercero: data.denominacionTercero,
                motivoTraslado: data.motivoTraslado,
                descripcionMotivoTraslado: data.descripcionMotivoTraslado,
                indicadorTransbordoProgramado: data.indicadorTransbordoProgramado,
                pesoTotalBrutoBienes: data.pesoTotalBrutoBienes,
                unidadMedidaPesoBruto: data.unidadMedidaPesoBruto,
                numeroBultos: data.numeroBultos,
                ubigeoPuntoLlegada: data.ubigeoPuntoLlegada,
                direccionPuntoLlegada: data.direccionPuntoLlegada,
                numeroContenedor: data.numeroContenedor,
                ubigeoPuntoPartida: data.ubigeoPuntoPartida,
                direccionPuntoPartida: data.direccionPuntoPartida,
                codigoPuerto: data.codigoPuerto,
                detailsGuiaRemision: prods,
                tramos: tramos,
                campos_adicionales: camposAdicionales
              }
            }else if(this.isAnula){

              this.formulario = {
              numero: this.formulario.numero,
              serie: this.formulario.serie,
              fechaEmision: data.fechaEmision,
              observaciones: data.observaciones,
              numeroRelacionado: data.numeroRelacionado,
              numeracionDAM: data.numeracionDAM,
              tipoDocumentoRelacionado: data.tipoDocumentoRelacionado,
              numeroDocumentoIdentidadDestinatario: data.numeroDocumentoIdentidadDestinatario,
              tipoDocumentoIdentidadDestinatario: data.tipoDocumentoIdentidadDestinatario,
              denominacionDestinatario: data.denominacionDestinatario,
              numeroDocumentoIdentidadTercero: data.numeroDocumentoIdentidadTercero,
              tipoDocumentoIdentidadTercero: data.tipoDocumentoIdentidadTercero,
              denominacionTercero: data.denominacionTercero,
              motivoTraslado: data.motivoTraslado,
              descripcionMotivoTraslado: data.descripcionMotivoTraslado,
              indicadorTransbordoProgramado: data.indicadorTransbordoProgramado,
              pesoTotalBrutoBienes: data.pesoTotalBrutoBienes,
              unidadMedidaPesoBruto: data.unidadMedidaPesoBruto,
              numeroBultos: data.numeroBultos,
              ubigeoPuntoLlegada: data.ubigeoPuntoLlegada,
              direccionPuntoLlegada: data.direccionPuntoLlegada,
              numeroContenedor: data.numeroContenedor,
              ubigeoPuntoPartida: data.ubigeoPuntoPartida,
              direccionPuntoPartida: data.direccionPuntoPartida,
              codigoPuerto: data.codigoPuerto,
              detailsGuiaRemision: prods,
              tramos: tramos,
              campos_adicionales: camposAdicionales
            };



            const params = qs.stringify({
                id: this.idAnula
              })
            const url = `api/guiaById?${params}`
            Methods.doGet(this, url).then(data => {
              this.formulario.serieBaja = data.serie,
              this.formulario.numeroBaja = data.numero
            })
            console.log(this.formulario);


            }



            if(this.formulario.tipoDocumentoIdentidadDestinatario == null){
              this.formulario.tipoDocumentoIdentidadDestinatario = -1;
            }
            if(this.formulario.tipoDocumentoIdentidadTercero == null){
              this.formulario.tipoDocumentoIdentidadTercero = -1;
            }
              console.log(this.formulario);
          })
        }
      },
      obtenerProvinciaPartida(){
        this.listProvinciaPartida = [];
        this.getUbigeo.find(depa=>{
          return depa.codigoDepartamento == this.departamentoPartida;
        }).provincia.forEach(v => {
          this.listProvinciaPartida.push({
            value: v.codigoProvincia,
            text: v.descripcion
          })
        })
        this.provinciaPartida =  this.listProvinciaPartida[0].value
      },
      obtenerDistritoPartida(){
        this.listDistritoPartida = [];
        this.getUbigeo.find(depa=>{
          return depa.codigoDepartamento == this.departamentoPartida;
        }).provincia.find(prov=>{
          return prov.codigoProvincia == this.provinciaPartida;
        }).distrito.forEach(v => {
          this.listDistritoPartida.push({
            value: v.codigoDistrito,
            text: v.descripcion
          })
        })
        this.formulario.ubigeoPuntoPartida =  this.listDistritoPartida[0].value
      },
      obtenerProvinciaLlegada(){
        this.listProvinciaLlegada = [];
        this.getUbigeo.find(depa=>{
          return depa.codigoDepartamento == this.departamentoLlegada;
        }).provincia.forEach(v => {
          this.listProvinciaLlegada.push({
            value: v.codigoProvincia,
            text: v.descripcion
          })
        })
        this.provinciaLlegada =  this.listProvinciaLlegada[0].value
      },
      obtenerDistritoLlegada(){
        this.listDistritoLlegada = [];
        this.getUbigeo.find(depa=>{
          return depa.codigoDepartamento == this.departamentoLlegada;
        }).provincia.find(prov=>{
          return prov.codigoProvincia == this.provinciaLlegada;
        }).distrito.forEach(v => {
          this.listDistritoLlegada.push({
            value: v.codigoDistrito,
            text: v.descripcion
          })
        })
        this.formulario.ubigeoPuntoLlegada =  this.listDistritoLlegada[0].value
      },
      generarGuia(){

        this.$v.formulario.$touch();
        this.formulario.campos_adicionales = [];
        console.log("Datos de la empresa")
        console.log(this.getCompany.bucket)
        console.log("observacion: "+this.datosExtras.observacion);
        console.log("brevete: "+this.datosExtras.brevete);
        console.log("modeloVehiculo: "+this.datosExtras.modeloVehiculo);
        console.log("codigoMTC: "+this.datosExtras.codigoMTC);

        if (this.datosExtras.observacion) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'OBSERVACION',
            valor_campo: this.datosExtras.observacion
          })
        }
        if (this.datosExtras.brevete) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'BREVETE',
            valor_campo: this.datosExtras.brevete
          })
        }
        if (this.datosExtras.modeloVehiculo) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'MODELO VEHICULO',
            valor_campo: this.datosExtras.modeloVehiculo
          })
        }
        if (this.datosExtras.codigoMTC) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'CODIGO MTC',
            valor_campo: this.datosExtras.codigoMTC
          })
        }

        if (this.datosExtras.vendedor) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'VENDEDOR',
            valor_campo: this.datosExtras.vendedor
          })
        }
        if (this.datosExtras.codCliente) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'CODIGO CLIENTE',
            valor_campo: this.datosExtras.codCliente
          })
        }
        if (this.datosExtras.ordenCompra) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'ORDEN DE COMPRA',
            valor_campo: this.datosExtras.ordenCompra
          })
        }
        if (this.datosExtras.condicion) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'CONDICION',
            valor_campo: this.datosExtras.condicion
          })
        }
        console.log(this.formulario);
        if(this.formulario.numeroDocumentoIdentidadTercero == this.formulario.numeroDocumentoIdentidadDestinatario){
          this.$buefy.dialog.alert({
          title: 'Error al ingresar datos',
          message: 'El proveedor no debe ser igual al remitente o destinatario',
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () => {
            return false;
          }
        })
        return false;
        }
        if(this.formulario.numeroDocumentoIdentidadDestinatario == this.getCompany.bucket){
          if(this.formulario.motivoTraslado !== '18' && this.formulario.motivoTraslado !== '04' && this.formulario.motivoTraslado !== '02'){
            this.$buefy.dialog.alert({
              title: 'Error al ingresar datos',
          message: 'El motivo de traslado debe ser traslado emisor itinerante',
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () => {
            return false;
          }
          })
          return false;
          }
        }

        if(this.formulario.numeroDocumentoIdentidadDestinatario !== this.getCompany.bucket){
          if(this.formulario.motivoTraslado == '18' || this.formulario.motivoTraslado == '04' || this.formulario.motivoTraslado == '02'){
            this.$buefy.dialog.alert({
              title: 'Error al ingresar datos',
          message: 'Para el motivo traslado emisor itinerante o entre establecimientos, el ruc destinatario debe ser igual al emisor',
          type: 'is-warning',
          hasIcon: true,
          onConfirm: () => {
            return false
          }
          })
          return false;
          }
        }

        console.log("hay error: " + this.$v.formulario.$error);
        if(!this.$v.formulario.$error){
          console.log("sin error");
        console.log("hay error: " + this.$v.formulario.$error);
          this.$buefy.dialog.confirm({
            title: 'Confirmar',
            message: '¿Seguro que desea generar este documento?',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            type: 'is-info',
            hasIcon: true,
            onConfirm: () => this.guardarGuia()
          })
        }
      },
      guardarGuia(){
        console.log(this.isEdit);
        const url = this.isEdit ? `api/editar-guia` : `api/guia-remision`
        if(!this.formulario.numeroDocumentoIdentidadTercero){
          this.formulario.tipoDocumentoIdentidadTercero = null;
        }
        this.formulario.detailsGuiaRemision.forEach(p =>{
          p.precio_venta_unitario = parseFloat(p.precio_venta_unitario)
        }
        );
        console.log(this.formulario);
        Methods.doPost(this, url, this.formulario).then(data => {

          this.$buefy.dialog.confirm({
            title: 'Mensaje',
            message: data.mensaje,
            confirmText: 'Aceptar',
            type: data.estado ? 'is-success' : 'is-danger',
            hasIcon: true,
            onConfirm: () => {
              if (data.estado) {
                this.$router.push('/admin/guiaRemision/ver-guias');
              }
            }
          })
        })
      },
      getParametro(key) {
        return this.getParametros.find(val => val.key == key)
      },

      calculoTotal() {

        this.formulario.detraccion = 'N'


        this.monto_anticipo = 0
        this.formulario.total_imp_ope_grat = null
        var subtotal = 0

        this.formulario.detailsGuiaRemision.forEach((element, index) => {
          var tipoIgv = this.tipoIgvList.find((param) => param.value == element.tipo_afectacion_igv)


          if (tipoIgv.rel == '1001') {
            //SI EL PRECIO INCLUYE IGV
            if (this.formulario.detailsGuiaRemision[index].inc_igv) {
              //valor del producto sin igv ni isc
              this.formulario.detailsGuiaRemision[index].valor_unitario =
                ((element.precio_venta_unitario / (parseFloat(this.getParametro("IGV").value) + 1)))
                //Valor del pago total del producto
              this.formulario.detailsGuiaRemision[index].precio_total = ((element.precio_venta_unitario * element.cantidad))
              //valor del pago total sin igv ni isc del producto
              this.formulario.detailsGuiaRemision[index].precioItem =
                (((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1)))
              //valor del igv
              this.formulario.detailsGuiaRemision[index].igv =
                (element.precio_total - element.precioItem)
            }
            //SI NO EL PRECIO NO INCLUYE IGV
            else {
              //valor del producto sin igv ni isc
              this.formulario.detailsGuiaRemision[index].precio_venta_unitario =
                ((element.valor_unitario * (parseFloat(this.getParametro("IGV").value) + 1)))

              //Valor del pago total del producto
              this.formulario.detailsGuiaRemision[index].valor_unitario = parseFloat(this.formulario.detailsGuiaRemision[index].valor_unitario);
              console.log("valorunitario2: "+this.formulario.detailsGuiaRemision[index].valor_unitario);
              this.formulario.detailsGuiaRemision[index].precio_total =
                ((element.precio_venta_unitario * element.cantidad))
              //valor del pago total sin igv ni isc del producto
              this.formulario.detailsGuiaRemision[index].precioItem =
                (((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1)))
              //valor del igv
              this.formulario.detailsGuiaRemision[index].igv =
                (element.precio_total - element.precioItem)
            }
          } else {
            //SI INCLUYE IGV
            console.log("no es gravado")
            if (this.formulario.detailsGuiaRemision[index].inc_igv) {
              //valor del producto sin igv ni isc
              this.formulario.detailsGuiaRemision[index].valor_unitario = parseFloat(element.precio_venta_unitario)
              console.log("valorunitario3: "+this.formulario.detailsGuiaRemision[index].valor_unitario);
              //Valor del pago total del producto
              this.formulario.detailsGuiaRemision[index].precio_total = ((element.precio_venta_unitario * element.cantidad) + element.monto_icbper)
              //valor del pago total sin igv ni isc del producto
              this.formulario.detailsGuiaRemision[index].precioItem = parseFloat(element.precio_total)
            }else {
              console.log("no incluye igv")
              //valor del producto sin igv ni isc
              if(this.formulario.detailsGuiaRemision[index].tipo_afectacion_igv == 21 || this.formulario.detailsGuiaRemision[index].tipo_afectacion_igv == 13 || this.formulario.detailsGuiaRemision[index].tipo_afectacion_igv == 31){
                this.formulario.detailsGuiaRemision[index].precio_venta_unitario = null
                this.formulario.detailsGuiaRemision[index].valor_referencial_unitario = element.valor_unitario
                this.formulario.detailsGuiaRemision[index].precio_total = ((this.formulario.detailsGuiaRemision[index].valor_referencial_unitario * element.cantidad))

                this.formulario.detailsGuiaRemision[index].precioItem = 0

              }else{
                this.formulario.detailsGuiaRemision[index].precio_venta_unitario = parseFloat(element.valor_unitario)
                console.log("valorunitario4: "+this.formulario.detailsGuiaRemision[index].valor_unitario);
                //Valor del pago total del producto
                this.formulario.detailsGuiaRemision[index].precio_total =
                  ((element.precio_venta_unitario * element.cantidad))
                //valor del pago total sin igv ni isc del producto

                this.formulario.detailsGuiaRemision[index].precioItem = parseFloat(element.precio_total)

              }
            }
            this.formulario.detailsGuiaRemision[index].igv = null;
          }
          this.formulario.detailsGuiaRemision[index].monto_base_igv = null
          this.formulario.detailsGuiaRemision[index].porcentaje_igv = null
          this.formulario.detailsGuiaRemision[index].monto_base_inafecto = null
          this.formulario.detailsGuiaRemision[index].monto_base_exonerado = null
          this.formulario.detailsGuiaRemision[index].monto_base_gratuito = null
          this.formulario.detailsGuiaRemision[index].mostraPorc = false
          if (tipoIgv.rel == '1001') {

            this.formulario.detailsGuiaRemision[index].monto_base_igv = ((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
            this.formulario.detailsGuiaRemision[index].porcentaje_igv = (parseFloat(this.getParametro("IGV").value) * 100)

            this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat = null
          } else if (tipoIgv.rel == '1002') {

            this.formulario.detailsGuiaRemision[index].monto_base_inafecto = ((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
            this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat = null
          } else if (tipoIgv.rel == '1003') {
            this.formulario.detailsGuiaRemision[index].monto_base_exonerado = ((element.precio_venta_unitario * element.cantidad) )
            this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat = null
          } else if (tipoIgv.rel == '1000') {
            this.formulario.detailsGuiaRemision[index].monto_base_exportacion = ((element.precio_venta_unitario * element.cantidad))
            this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat = null
            console.log("12")
          } else if (tipoIgv.rel == '1004') {
           if (element.tipo_afectacion_igv == '11' || element.tipo_afectacion_igv == '12' || element.tipo_afectacion_igv == '14' || element.tipo_afectacion_igv == '13' ||
              element.tipo_afectacion_igv == '15' || element.tipo_afectacion_igv == '16' || element.tipo_afectacion_igv == '17') {
              this.formulario.detailsGuiaRemision[index].imp_vta_grat = parseFloat(parseFloat(element.porcentaje_trib_vta_grat ? element.porcentaje_trib_vta_grat : 0) / 100) * parseFloat((element.valor_unitario * element.cantidad))
              console.log("imp_vta_grat: "+this.formulario.detailsGuiaRemision[index].imp_vta_grat)
              this.formulario.detailsGuiaRemision[index].mostraPorc = true
              console.log("13")
            } else {
              this.formulario.detailsGuiaRemision[index].imp_vta_grat = 0
              this.formulario.detailsGuiaRemision[index].porcentaje_trib_vta_grat = 0
              console.log("14")
            }

            this.formulario.total_venta_gratuitas = parseFloat(this.formulario.total_venta_gratuitas) + parseFloat(element.valor_unitario * element.cantidad)
            console.log("total_venta_gratuitas: " + this.formulario.total_venta_gratuitas)
            this.formulario.detailsGuiaRemision[index].valor_unitario = parseFloat(element.valor_unitario);
            this.formulario.detailsGuiaRemision[index].monto_base_gratuito = parseFloat(element.precio_total)
            this.formulario.detailsGuiaRemision[index].valor_referencial_unitario = element.valor_unitario

            this.formulario.total_imp_ope_grat = this.formulario.total_imp_ope_grat + element.imp_vta_grat


          }
          subtotal = parseFloat(subtotal) + parseFloat(((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1)))

          this.formulario.detailsGuiaRemision[index].peso_unitario = parseFloat(element.peso_unitario);
          this.formulario.detailsGuiaRemision[index].valor_unitario = parseFloat(element.valor_unitario);
          this.formulario.detailsGuiaRemision[index].precio_venta_unitario = parseFloat(element.precio_venta_unitario);

        });
        this.formulario.total_igv = this.checkIncludeIgv




        this.formulario.detailsGuiaRemision.forEach(it => {
          it.habilitarTipo = true
        })
      },
      cambioRuta(){

        if(this.$route.params.idEdit){
          this.idEdit = this.$route.params.idEdit;
        }

        if(this.$route.params.idAnula){
          this.idAnula = this.$route.params.idAnula;
        }
      },
      borrarTraslado(indice){
        this.formulario.tramos.splice(indice, 1);
      },
      watchNumeroProveedor(){
        if(!this.$v.formulario.numeroDocumentoIdentidadTercero.$error){
          if(this.formulario.tipoDocumentoIdentidadTercero=='6'){
            const params = qs.stringify({
              ruc: this.formulario.numeroDocumentoIdentidadTercero
            })
            const url = `api/sunat-buscar-ruc?${params}`
            Methods.doGet(this, url)
              .then(response => {
                this.formulario.denominacionTercero = response.nombre_o_razon_social;
              })
          }else if(this.formulario.tipoDocumentoIdentidadTercero=='1'){
            const params = qs.stringify({
              dni: this.formulario.numeroDocumentoIdentidadTercero
            })
            const url = `api/reniec-buscar-dni?${params}`
            Methods.doGet(this, url)
              .then(data => {
                if(data){
                  this.formulario.denominacionTercero = data.nombre;
                }
              })
          }else{
            this.formulario.denominacionTercero = null;
          }
        }
      },
      watchNumeroDestinatario(){
        if(!this.$v.formulario.numeroDocumentoIdentidadDestinatario.$error){
          if(this.formulario.tipoDocumentoIdentidadDestinatario=='6'){
            const params = qs.stringify({
              ruc: this.formulario.numeroDocumentoIdentidadDestinatario
            })
            const url = `api/sunat-buscar-ruc?${params}`
            Methods.doGet(this, url)
              .then(response => {
                this.formulario.denominacionDestinatario = response.nombre_o_razon_social;
              })
          }else if(this.formulario.tipoDocumentoIdentidadDestinatario == '1'){
            const params = qs.stringify({
              dni: this.formulario.numeroDocumentoIdentidadDestinatario
            })
            const url = `api/reniec-buscar-dni?${params}`
            Methods.doGet(this, url)
              .then(data => {
                if(data){
                  this.formulario.denominacionDestinatario = data.nombre;
                }
              })
          }else{
            this.formulario.denominacionDestinatario = null;
          }
        }
      }
    },
    watch:{
      vuelines: function (val) {

        if (val.length > 0) {
          this.validar()
        }
      },
      "$route": "cambioRuta",
      '$route.params.id': 'getDataFromGuia',
      'formulario.numeroDocumentoIdentidadTercero':'watchNumeroProveedor',
      'formulario.numeroDocumentoIdentidadDestinatario':'watchNumeroDestinatario',
      'formulario.serie': 'obtenerSiguienteNumero',
      'fechaEmision':{
        handler: function () {
          this.formulario.fechaEmision = dateformat(this.fechaEmision, "yyyy-mm-dd");
        }
      },
      'departamentoPartida': 'obtenerProvinciaPartida',
      'provinciaPartida': 'obtenerDistritoPartida',
      'departamentoLlegada': 'obtenerProvinciaLlegada',
      'provinciaLlegada': 'obtenerDistritoLlegada',
      'formulario.detailsGuiaRemision': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      'formulario.total_descuento': 'calculoTotal',
    },
    computed: {
      ...mapGetters({'getCompany': 'auth/getCompany'}),
      ...mapGetters({
        'getCatalogo07': 'catalogos/getCatalogo07'
      }),
      ...mapGetters({
        'getCatalogo06': 'catalogos/getCatalogo06'
      }),
      ...mapGetters({
        'getCatalogo18': 'catalogos/getCatalogo18'
      }),
      ...mapGetters({
        'getParametros': 'catalogos/getParametros'
      }),
      ...mapGetters({
        'getCatalogo20': 'catalogos/getCatalogo20'
      }),
      ...mapGetters({
        'getUbigeo': 'catalogos/getUbigeo'
      }),
      ...mapGetters({
        'getUbigeoTotal': 'catalogos/getUbigeoTotal'
      }),
      ...mapGetters({
        'getPuntoVenta': 'punto/getPuntoVenta'
      }),
      existenSeries() {
        return this.seriesDisponibles.length > 0
      },
      motivosTraslado() {
        const listado = [];
        this.getCatalogo20.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      },
      tipoTransporte() {
        const listado = [];
        this.getCatalogo18.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      },
      preciosIncluidoIgv() {
        if (this.getCompany.preciosIncluidoIgv == null || this.getCompany.preciosIncluidoIgv == undefined) return true
        else return this.getCompany.preciosIncluidoIgv
      },
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
      tipoIgvList() {
        const listado = [];
        this.getCatalogo07.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion,
            rel: v.codigoRelacionado
          })
        })
        return listado;
      },
      getDepartamentos() {
        const listado = [];
        this.getUbigeo.forEach(v => {
          listado.push({
            value: v.codigoDepartamento,
            text: v.descripcion
          })
        })
        return listado;
      }
    }

  }
</script>
<style>
  .label {
    color: #363636;
    display: block;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .label:not(:last-child) {
    margin-bottom: 0.1em;
  }

  .pd-per {
    padding: 0.3rem;
  }

  .pd-per-1 {
    padding: 0.1rem;
  }

  .help {
    display: block;
    font-size: 0.70rem;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
  }
  .my-input input{
  text-transform: uppercase
}
</style>
