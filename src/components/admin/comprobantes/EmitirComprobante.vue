<template>
    <div v-if="!validar_trial">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Emision de Comprobantes CERTIFAKT
          </p>
          <span class="icon">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </header>
        <div class="card-content">
          <div class="content">
            El servicio de Emision de Comprobantes para este usuario no se encuentra habilitado.
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
  <div v-else>
    <b-icon v-if="tipoComprobante == '01'"
      icon="brightness-1" size="is-medium" :class="semaforo_color" style="position: absolute;right: 1%;top: 1%;">
    </b-icon>
    <form @submit.prevent="generarComprobante">
      <div class="columns is-multiline">
        <div class="column pd-per is-2">
          <b-field label="Tipo de Documento:">
            <b-select size="is-small" expanded v-model="formulario.cliente_tipo_documento">
              <option :disabled="disabledTipoDocument(option.value)" v-for="(option, i) in tipoDocumento"
                      :value="option.value" :key="i">
                {{ option.text }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column pd-per is-2">
          <b-field label="Nª Documento:" :type="typeNumeroDoc" :message="messageNumeroDoc">
            <b-autocomplete size="is-small"
                            v-model="$v.formulario.cliente_numero_documento.$model"
                            :data="clientesAutocomplete"
                            :loading="isFetchingCliente"
                            :keep-first="true"
                            placeholder="Ingrese numero"
                            @input="buscarCliente"
                            :disabled="isDisabledNumberDoc"
                            @select="option => selectedCliente = option"
                            field="numeroDocumento">
              <template slot-scope="props">
                <div class="media">
                  <div class="media-left">
                    {{ props.option.numeroDocumento }}
                  </div>
                  <div class="media-content">
                    {{ props.option.razonSocial}}
                  </div>
                </div>
              </template>
            </b-autocomplete>
          </b-field>
        </div>

        <div class="column pd-per is-3">
          <b-field label="Denominación:" :type="toShowType($v.formulario.cliente_denominacion)"
                   :message="toShowMessage($v.formulario.cliente_denominacion)">
            <b-field>
              <b-input size="is-small" v-model="$v.formulario.cliente_denominacion.$model"></b-input>
              <p v-if="tipoComprobante=='07' || tipoComprobante=='08'" class="control">
                <b-tooltip label="Da click aqui para seleccionar el comprobante asociado a la nota...">
                  <button type="button" @click="changeCliente" class="button is-primary is-small">Comprobantes</button>
                </b-tooltip>
              </p>
            </b-field>
          </b-field>
        </div>
        <div class="column pd-per is-3">
          <b-field label="Dirección:" :type="toShowType($v.formulario.cliente_direccion)"
                   :message="toShowMessage($v.formulario.cliente_direccion)">
            <b-input size="is-small" v-model="$v.formulario.cliente_direccion.$model"></b-input>
          </b-field>
        </div>
        <div class="column pd-per is-2">
          <b-field label="Correo:" :type="toShowType($v.formulario.cliente_email)"
                   :message="toShowMessage($v.formulario.cliente_email)">
            <b-input size="is-small" v-model="$v.formulario.cliente_email.$model"></b-input>
          </b-field>
        </div>
        <div class="column pd-per is-3">
          <b-field label="Tipo de Operación:" :type="toShowType($v.formulario.tipo_operacion)"
                   :message="toShowMessage($v.formulario.tipo_operacion)">
            <b-select size="is-small" expanded v-model="$v.formulario.tipo_operacion.$model">
              <option v-for="(option, i) in tipoOperacion" :value="option.value" :key="i">
                {{ option.text}}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column pd-per is-1">
          <b-field v-if="!existenSeries" label="Serie:" :type="toShowType($v.formulario.documento_serie)"
                   :message="toShowMessage($v.formulario.documento_serie)">
            <b-input :disabled="isEdit" size="is-small" v-model="$v.formulario.documento_serie.$model"></b-input>
          </b-field>
          <b-field v-if="existenSeries" label="Serie:" :type="toShowType($v.formulario.documento_serie)"
                   :message="toShowMessage($v.formulario.documento_serie)">
            <b-select :disabled="isEdit" size="is-small" expanded v-model="$v.formulario.documento_serie.$model">
              <option v-for="(option, i) in seriesDisponibles" :value="option.value" :key="i">
                {{ option.text}}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column pd-per is-1">
          <b-field label="Número:" :type="toShowType($v.formulario.documento_numero)"
                   :message="toShowMessage($v.formulario.documento_numero)">
            <b-input disabled=true size="is-small" type="number"
                     v-model="$v.formulario.documento_numero.$model"></b-input>
          </b-field>
        </div>
        <div class="column pd-per is-2">
          <b-field label="Fecha emisión:" :type="toShowType($v.fecha_emision)"
                   :message="toShowMessage($v.fecha_emision)">
            <b-datepicker size="is-small" v-model="$v.fecha_emision.$model" :date-formatter="formatDate"
                          placeholder="Click para seleccionar fecha" icon="calendar-today">
            </b-datepicker>
          </b-field>
        </div>
        <div class="column pd-per is-1">
          <b-field label="Hora:" :type="toShowType($v.formulario.documento_hora_emision)"
                   :message="toShowMessage($v.formulario.documento_hora_emision)">
            <b-input size="is-small" v-model="$v.formulario.documento_hora_emision.$model"></b-input>
          </b-field>
        </div>
        <div class="column pd-per is-2">
          <b-field label="Fecha vencimiento:" :type="toShowType($v.fecha_vencimiento)"
                   :message="toShowMessage($v.fecha_vencimiento)">
            <b-datepicker size="is-small" v-model="$v.fecha_vencimiento.$model" :date-formatter="formatDate"
                          placeholder="Click para seleccionar fecha" icon="calendar-today">
            </b-datepicker>
          </b-field>
        </div>        
        <div class="column pd-per is-2">
          <b-field label="Moneda:">
            <b-select size="is-small" expanded v-model="formulario.documento_tipo_moneda">
              <option v-for="(option, i) in tiposMonedas" :value="option.value" :key="i">
                {{ option.text}}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="columns">

          <b-field class="column" v-if="formulario.detraccion == 'S'" label="Bien Detraccion"
                   :type="toShowType($v.formulario.codigo_bien_detraccion)"
                   :message="toShowMessage($v.formulario.codigo_bien_detraccion)">
            <b-select size="is-small" expanded v-model="formulario.codigo_bien_detraccion"
                      placeholder="Seleccione">
              <option v-for="(option, i) in tiposBienDetraccion" :value="option.value" :key="i">
                {{ option.text}}
              </option>
            </b-select>
          </b-field>
          <b-field class="column" v-if="formulario.detraccion == 'S'" label="Porcentaje"
                   :type="toShowType($v.formulario.porcentaje_detraccion)"
                   :message="toShowMessage($v.formulario.porcentaje_detraccion)">
            <b-input icon="percent" size="is-small" 
                     v-model="$v.formulario.porcentaje_detraccion.$model"></b-input>
          </b-field>
       
          <div class="column" style="margin-top:20px;">
            <b-checkbox v-model="estado_anticipo" true-value=1 v-if="formulario.tipo_operacion == '1001'"
                        false-value=0>Anticipo
            </b-checkbox>
          </div>
          <div class="column" style="margin-top:20px;">
            <b-checkbox v-model="retencion_detraccion" true-value=1 
                        false-value=0>Retención
            </b-checkbox>
          </div>
          
            <b-field class="column" v-if="retencion_detraccion == 1" label="Retención"  
                   :type="toShowType($v.formulario.porcentaje_retencion)"
                   :message="toShowMessage($v.formulario.porcentaje_retencion)">
              <b-input icon="percent" size="is-small"  
                      v-model="$v.formulario.porcentaje_retencion.$model"></b-input>
            </b-field>
          
          

        </div>


        <div class="column pd-per is-12">
          <b-field label="Productos:">
            <div class="box" style="padding: 1rem;">
              <linea-item v-model="$v.formulario.items" @selectedProducto="selectedProducto(...arguments)"
                          ref="lineaClass"
                          @borrarProducto="borrarProducto($event)" @editarProducto="editarProducto($event)"
                          @changeFieldDescription="changeFieldDescription($event)">
              </linea-item>
              <hr style="margin: 0.9rem 0;">

              <a @click="addProducto" v-if=" (tipoComprobante=='01' && idGuia == null) || tipoComprobante=='03' "
                 class="button is-primary is-rounded is-small">Agregar producto</a>
              <a @click="addBolsa" v-if="(tipoComprobante=='01' && idGuia == null) || tipoComprobante=='03'"
                 class="button is-primary is-rounded is-small">Agregar bolsa</a>
              <a v-if="isHabilitado" @click="showModalAnticipos" block class="button is-success is-rounded is-small">Agregar
                anticipo</a>
            </div>
          </b-field>
          <a class="buttoncsv float-letf" href="https://certifakt.s3-us-west-2.amazonaws.com/public/productoslist.csv">
                <span class="file-cta buttoncsv">
                  <span class="file-label">
                      Descargar Plantilla
                  </span>
                </span>
          </a>
          <label class="file-label float-letf">
            <a class="buttoncsv">
              <input type="file" id="file" name="resume" ref="fileinputref" accept=".csv" class="file-input"
                     v-on:change="handleFileUpload($event.target.files)"/>
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
        </div>
        <div class="column pd-per is-12">
          <div class="has-text-centered">
            <a @click="isModalDatos = true" class=" is-info is-rounded is-small">Agregar Guía / Orden de Compra /
              Condiciónes de Pago / Otros...</a>
          </div>
        </div>
        <div class="column pd-per is-4" v-if="tipoComprobanteCuotaComputed" style="display:block" >
          <b-field label="Transaccion:">
            <b-select size="is-small" expanded v-model="formulario.documento_tipo_transaccion" >
              <option v-for="(option, i) in tiposTransaccion" :value="option.value" :key="i" >
                {{ option.text}}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column pd-per is-8" v-if="tipoComprobanteCuotaComputed" style="display:block" >
            
        </div>
        <div class="column pd-per is-12" v-if="formulario.cantidad_cuotas==undefined?false:formulario.cantidad_cuotas>0">
          <div class="has-text-centered">
            <a @click="verCuotas" class=" is-info is-rounded is-small">Visualizar cuotas</a>
          </div>
        </div>
        <div class="column pd-per is-12">
          <hr style="margin: 0 0;">
        </div>
        <div class="column pd-per is-8">
          <div class="column pd-per">
            <b-field label="Motivo" v-if="tipoComprobante=='07' || tipoComprobante=='08'"
                     :type="toShowType($v.formulario.documento_afectado_motivo_nota)"
                     :message="toShowMessage($v.formulario.documento_afectado_motivo_nota)">
              <b-input size="is-small" v-model="$v.formulario.documento_afectado_motivo_nota.$model"
                       type="text"></b-input>
            </b-field>
          </div>
          <div class="column pd-per">
            <b-field label="Observación" v-if="tipoComprobante=='01' || tipoComprobante=='03'">
              <b-input size="is-small" v-model="datosExtras.observacion" type="text"></b-input>
            </b-field>
          </div>
          <div class="column">
            <div class="columns">
              <div v-if="tipoComprobante=='01' || tipoComprobante=='03'" class="column pd-per">
                <!--<b-field label="Operacion con Detraccion">
                  <b-switch v-model="formulario.detraccion"
                            true-value="S"
                            false-value="N">
                  </b-switch>
                </b-field>-->



                <div class="columns">
                  <b-field class="column" v-if="formulario.detraccion == 'S'" label="Cuenta Detracción"
                           :type="toShowType($v.formulario.cuenta_financiera_beneficiario)"
                           :message="toShowMessage($v.formulario.cuenta_financiera_beneficiario)">
                    <b-select size="is-small" expanded v-model="formulario.cuenta_financiera_beneficiario"
                              placeholder="Seleccione">
                      <option v-for="(option, i) in cuentasPago" :value="option.text" :key="i">
                        {{ option.text}}
                      </option>
                    </b-select>
                  </b-field>
                  <b-field class="column" v-if="formulario.detraccion == 'S'" label=" Pago"
                           :type="toShowType($v.formulario.codigo_medio_pago)"
                           :message="toShowMessage($v.formulario.codigo_medio_pago)">
                    <b-select size="is-small" expanded v-model="formulario.codigo_medio_pago" placeholder="Seleccione">
                      <option v-for="(option, i) in mediosDePago" :value="option.value" :key="i">
                        {{ option.text}}
                      </option>
                    </b-select>

                  </b-field>

                </div>
                <div class="columns">

                  <b-field class="column" v-if="formulario.detraccion == 'S'" label="Monto de Detraccion"
                           :type="toShowType($v.formulario.monto_detraccion)"
                           
                           :message="toShowMessage($v.formulario.monto_detraccion)">
                    <b-input size="is-small" v-model="$v.formulario.monto_detraccion.$model"></b-input>
                  </b-field>
                  <b-field class="column" v-if="formulario.detraccion == 'S'">
                    <b-field-body v-if="formulario.detraccion == 'S' && formulario.documento_tipo_moneda == 'USD'">
                      <b-message title="Mensaje informativo" type="is-info">
                        El monto de detraccion debe ser convertido he ingresado en soles, segun tipo de cambio del dia
                        de hoy
                      </b-message>
                    </b-field-body>
                  </b-field>
                </div>
                <div class="columns">

                    <b-field class="column" v-if="retencion_detraccion == 1" label="Monto de Retención"
                            :type="toShowType($v.formulario.monto_retencion)"
                            
                            :message="toShowMessage($v.formulario.monto_retencion)">
                      <b-input size="is-small" v-model="$v.formulario.monto_retencion.$model"></b-input>
                    </b-field>
                    
                  </div>
                </div>
              <div class="column pd-per is-4" v-if="tipoComprobante=='07' || tipoComprobante=='08'">
                <b-field label="Documento a Modificar:"
                         :type="toShowType($v.formulario.documento_afectado_tipo_comprobante)"
                         :message="toShowMessage($v.formulario.documento_afectado_tipo_comprobante)">
                  <b-select size="is-small" expanded
                            v-model="$v.formulario.documento_afectado_tipo_comprobante.$model">
                    <option v-for="(option, i) in docModificar" :value="option.value" :key="i">
                      {{ option.text}}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column pd-per is-4" v-if="tipoComprobante=='07' || tipoComprobante=='08'">
                <b-field label="Serie a modificar:"
                         :type="toShowType($v.formulario.documento_afectado_serie)"
                         :message="toShowMessage($v.formulario.documento_afectado_serie)">
                  <b-field>
                    <b-input size="is-small" v-model="$v.formulario.documento_afectado_serie.$model"
                             type="text"></b-input>
                    <p class="control">
                      <b-tooltip label="Da click aqui para seleccionar el comprobante asociado a la nota...">
                        <button type="button" class="button is-primary is-small" @click="changeCliente">Comprobantes
                        </button>
                      </b-tooltip>
                    </p>
                  </b-field>
                </b-field>
              </div>
              <div class="column pd-per is-4" v-if="tipoComprobante=='07' || tipoComprobante=='08'">
                <b-field label="Número a modificar:"
                         :type="toShowType($v.formulario.documento_afectado_numero)"
                         :message="toShowMessage($v.formulario.documento_afectado_numero)">
                  <b-input size="is-small" v-model="$v.formulario.documento_afectado_numero.$model"
                           placeholder="Ingrese Número"></b-input>
                </b-field>
              </div>
              
            </div>
          </div>
          <div class="column pd-per is-6" v-if="tipoComprobante=='07'">
            <b-field label="Tipo Nota de Crédito:">
              <b-select :disabled="disabledTipoNotaCredito" size="is-small"
                        v-model="$v.formulario.tipo_nota_credito.$model" expanded>
                <option v-for="(option, i) in tipoNotaCredito" :value="option.value" :key="i">
                  {{ option.text}}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column pd-per is-6" v-if="tipoComprobante=='08'">
            <b-field label="Tipo Nota de Débito:">
              <b-select size="is-small" v-model="$v.formulario.tipo_nota_debito.$model" expanded>
                <option v-for="(option, i) in tipoNotaDebito" :value="option.value" :key="i">
                  {{ option.text}}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
        <div class="column pd-per is-4">
          <div style="margin-top: 0.3rem; margin-left: 0.5rem" class="columns is-multiline">
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Descuento total</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" v-model="$v.formulario.total_descuento.$model"></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Anticipo (-)</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.monto_anticipo.$model)" disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Exportación</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_venta_exportacion.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Exonerada</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_venta_exoneradas.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Inafecta</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_venta_inafectas.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Gravada</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_venta_gravadas_front.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">IGV</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_igv.$model)" disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Gratuita</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_venta_gratuitas.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">ICBPER</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.total_venta_icbper.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Otros cargos</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field :type="toShowType($v.formulario.total_otros_cargos)"
                       :message="toShowMessage($v.formulario.total_otros_cargos)">
                <b-input size="is-small" v-model="$v.formulario.total_otros_cargos.$model"></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Total</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-field>
                <b-input size="is-small" :value="showWith2Decimal($v.formulario.importe_total.$model)"
                         disabled></b-input>
              </b-field>
            </div>
            <div class="column pd-per-1 is-7">
              <p class="has-text-black is-size-7">Des. Op. Gravada</p>
            </div>
            <div class="column pd-per-1 is-5">
              <b-checkbox v-model="checkDescuentoIgv">

              </b-checkbox>
            </div>

          </div>
        </div>
        <div class="column pd-per is-12 has-text-centered">
          <button type="submit" class="button is-success is-rounded is-large">{{titleButtonAction}}</button>
        </div>
      </div>
    </form>

    <!--//MODAL ANTICPOS-->
    <b-modal :active.sync="isModalAnticipos" :width="640">
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            <span><b-icon
              icon="delete-sweep"
              size="is-small">
            </b-icon></span> <span style="margin-left: 10px;">Agregar anticipos</span>
          </p>
        </div>
        <div class="card-content">
          <b-table :data="listAnticipo" :mobile-cards="true">
            <template slot-scope="props">
              <b-table-column label="Tipo documento">
                {{ props.row.tipoComprobante | FiltroTipoDocumento }}
              </b-table-column>
              <b-table-column label="Serie">
                {{ props.row.serie }}
              </b-table-column>
              <b-table-column label="Número">
                {{ props.row.numero }}
              </b-table-column>
              <b-table-column label="Monto total">
                {{ props.row.montoImporteTotalVenta | TwoDecimals}}
              </b-table-column>
              <b-table-column label="Seleccionar">
                <b-checkbox v-model="props.row.selec">
                </b-checkbox>
              </b-table-column>
            </template>
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="emoticon-sad" size="is-large">
                    </b-icon>
                  </p>
                  <p>Sin anticipos.</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </div>
    </b-modal>

    <!-- Otros datos -->

    <b-modal :active.sync="isModalDatos" :width="640">
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            <span><b-icon
              icon="plus"
              size="is-small">
            </b-icon></span> <span style="margin-left: 10px;">Agregar Datos</span>
          </p>
        </div>
        <div class="card-content">
          <div class="columns is-multiline">
            <div class="column is-12">
              <agregar-guia-remi v-model="formulario.guias_relacionadas"
                                 @borrarGuia="deleteGuia($event)"></agregar-guia-remi>
              <a class="button is-primary is-rounded is-small" @click="addGuias">Agregar Guía</a>
            </div>
            <div class="column is-12">
              <b-field label="Órden de Compra/Servicio"
                       :type="toShowType($v.formulario.orden_compra)"
                       :message="toShowMessage($v.formulario.orden_compra)">
                <b-input size="is-small" v-model="$v.formulario.orden_compra.$model"></b-input>
              </b-field>
            </div>
            <div class="column is-12">
              <b-field label="Condiciones de pago">
                <b-input size="is-small" v-model="datosExtras.condicionPago"></b-input>
              </b-field>
            </div>
            <div class="column is-12">
              <agregar-otros v-model="datosExtras.otros" @borrarOtro="deleteOtro($event)"></agregar-otros>
              <a class="button is-primary is-rounded is-small" @click="addOtros">Agregar Otros</a>
            </div>
          </div>
        </div>

        <footer class="card-footer" style="padding: 1rem">
          <div class="has-text-centered">
            <a class="button is-success is-rounded" @click="cerrarModalDatosExtra">Guardar</a>
          </div>
        </footer>


      </div>
    </b-modal>
    <!-- Numero de coutas modal -->
    <b-modal :active.sync="isModalCuotas" :width="640" canCancel=false>
      <div style="height:600px">
        <div class="card"  :height="600">
          <div class="card-header">
            <p class="card-header-title">
              <span><b-icon
                icon="plus"
                size="is-small">
              </b-icon></span> <span style="margin-left: 10px;">Detalle de {{ formulario.cantidad_cuotas }} Cuotas generadas</span>
            </p>
          </div>
          
          <div class="card-content">
            <div v-for="item in formulario.cuotas" v-bind:key="item.num">            
              <div class="columns">
                <div class="column">
                  <span>Cuota </span><span>{{item.cuota_numero}} : </span>
                </div>
                <div class="column" v-if="!vercuota">
                  <b-datepicker size="is-small" v-model="item.cuota_fecha" :date-formatter="formatDate"
                                placeholder="Click para seleccionar fecha" icon="calendar-today">
                  </b-datepicker>
                </div>
                <div class="column" v-else>
                  <span>{{ item.cuota_fecha }}</span>
                </div>
                <div class="column">
                  <input size="is-small" placeholder="Ingrese monto" v-model="item.cuota_monto" @keypress="validardecimal"/>
                </div>              
              </div>
            </div>
          </div>

          <footer class="card-footer" style="padding: 1rem">
            <div class="has-text-centered">
              <a class="button is-success is-rounded" @click="guardarModalCuotas">Guardar</a>
            </div>
            <div class="has-text-centered">
              <a class="button is-cancel is-rounded" @click="cerrarModalCuotas">Cancelar</a>
            </div>
            <span>{{validcuota}}</span>
          </footer>


        </div>
      </div>
      
    </b-modal>
    <!-- lista de comprobantes -->
    <b-modal :active.sync="isModalComprobantes" width="1024">
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            <span><b-icon
              icon="plus"
              size="is-small">
            </b-icon></span> <span style="margin-left: 10px;">Seleccionar Comprobante</span>
          </p>
        </div>
        <div class="card-content">
          <b-table
            :data="comprobantesList"
            :mobile-cards="true">

            <template slot-scope="props">

              <b-table-column label="Fecha" class="is-size-7">
                {{ props.row.fechaEmision }}
              </b-table-column>

              <b-table-column label="Tipo" class="is-size-7">
                {{ props.row.tipoComprobante }}
              </b-table-column>

              <b-table-column label="Número" class="is-size-7">
                {{props.row.serie}}-{{props.row.numero}}
              </b-table-column>

              <b-table-column label="Receptor" class="is-size-7">
                {{ props.row.numDocIdentReceptor }} - {{ props.row.denominacionReceptor }}
              </b-table-column>


              <b-table-column label="Monto total" class="is-size-7">
                {{ props.row.codigoMoneda}} {{ props.row.montoImporteTotalVenta }}
              </b-table-column>

              <b-table-column label="Opciones" class="is-size-7">
                <a class="button is-primary is-rounded is-small"
                   @click="seleccionComprobante(props.row)">Seleccionar</a>
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
    </b-modal>


    <b-modal :active.sync="isCardModalEditarProducto" :width="680" custom-class="modal-content-two">
      <div class="card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{product}}</p>
        </header>
        <section class="modal-card-body formproducto">

          <linea-itemform v-model="$v.formulario.items" v-bind:keying="idindice"
                          @selectedProducto="selectedProducto(...arguments)"
                          @borrarProducto="borrarProducto($event)" @validatePorcentaje="validatePorcentaje($event)"
                          @changeFieldDescription="changeFieldDescription($event)">
          </linea-itemform>

        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="
          rProducto=false">{{strSalir}}</button>
          <button class="button is-primary" @click="save(idindice)">{{strsave}}</button>
        </footer>
      </div>
    </b-modal>
    <b-modal :active-sync="buscarcouta==1" :width="600">
      <div>
        <h2>Lista de pendientes</h2>
      </div>
    </b-modal>
    <b-modal :active-sync="buscarcuota==1" :width="600">
      <div>
        <h2>Lista de pendientes</h2>
      </div>
    </b-modal>


    <b-modal :active.sync="isCardModalProducto" :width="640">
      <div class="card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{product}}</p>
        </header>
        <section class="modal-card-body ">

          <linea-itemform v-model="$v.formulario.items" v-bind:keying="idindice"
                          @selectedProducto="selectedProducto(...arguments)"
                          @borrarProducto="borrarProducto($event)" @validatePorcentaje="validatePorcentaje($event)"
                          @changeFieldDescription="changeFieldDescription($event)">
          </linea-itemform>

        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="borrar(formulario.items.length-1)">{{strSalir}}</button>
          <button class="button is-primary" @click="save(formulario.items.length-1)">{{strsave}}</button>
          <span>{{validateform}}</span>
        </footer>
      </div>
    </b-modal>
    <!--Modal para credito-->
    

  </div>
</template>

<script>

  import LineaItem from './LineaItem'
  import LineaItemform from './LineaItemform'
  import AgregarGuiaRemi from './AgregarGuiaRemi'
  import AgregarOtros from './AgregarOtros'
  import Methods from '../../../api/methods'
  import {
    alphaNum, decimal, email, maxLength, maxValue, minLength, minValue, numeric,
    required
  } from 'vuelidate/lib/validators'
  import {mapGetters} from 'vuex'
  import qs from "qs"
  import validationsMixin from '../../../validations/index'
  import ApiMixin from "./Mixins/ApiMixin";
  import dateformat from 'dateformat'
  import Util from '../../../util'
  import BFieldBody from "buefy/src/components/field/FieldBody";
  //import BModal from 'buefy/src/components/modal/Modal'

  const unidadDefault = Util.getUnidades().default
 
  export default {
    mixins: [validationsMixin,ApiMixin],
    props: [
      'tipoComprobante',
      'id',
      'idGuia',
      'isEdit',
      'idEdit'
    ],
    components: {
      BFieldBody,
      LineaItem,
      LineaItemform,
      AgregarGuiaRemi,
      AgregarOtros
    },
    data() {
      return {
        disabledetraccion:false,
        inmutable:false,
        validar_trial:true,
        validcuota:"",
        buscarcuota:0,
        semaforo_color:'semaforoplomo',
        btnsend: false,
        checkDescuentoIgv: true,
        strSalir: 'Salir',
        strcancel: 'Cancelar',
        validateform: '',
        strsave: 'Guardar',
        tipoboleta: false,
        product: 'Producto',
        estPorcentaje: false,
        celdadelete: [],
        idindice: 0,
        fileinput: null,
        filename: '',
        vuelines: [],
        itemcsv: [],
        estado_anticipo: 0,
        retencion_detraccion: 0,
        vercuota:false,
        tipoComprobanteCuota: false,
        inicio: true,
        formulario: {
          retencion: null,
          cliente_tipo_documento: this.tipoComprobante === '03' ? '1' : '6',
          cliente_numero_documento: null,
          cliente_denominacion: null,
          cliente_direccion: null,
          cliente_email: null,
          tipo_operacion: '01',
          documento_serie: null,
          documento_numero: null,
          documento_fecha_emision: null,
          documento_fecha_vencimiento: null,
          documento_hora_emision: null,
          documento_tipo_moneda: 'PEN',

          documento_tipo_transaccion: 1,
          monto_pendiente:1,
          cantidad_cuotas:0,
          pago_cuenta:3,

          id_payment_voucher_reference:'',
          comprobante_credito:null,
          is_comprobante_credito:false,
          monto_pendiente_acumulador:0.0,
          total_venta_gravadas: 0,
          total_venta_gravadas_front: 0,
          total_venta_inafectas: 0,
          total_venta_exoneradas: 0,
          total_venta_exportacion: 0,
          total_venta_gratuitas: 0,
          total_venta_icbper: 0,
          total_descuento: null,
          total_igv: 0,
          total_otros_cargos: null,
          importe_total: 0,
          documento_afectado_tipo_comprobante: null,
          documento_afectado_serie: null,
          documento_afectado_numero: null,
          tipo_nota_credito: null,
          tipo_nota_debito: null,
          documento_afectado_motivo_nota: null,
          detraccion: 0,
          porcentaje_detraccion: null,
          porcentaje_retencion: null,
          codigo_bien_detraccion: null,
          codigo_medio_pago: null,
          cuenta_financiera_beneficiario: null,
          monto_detraccion: null,
          monto_retencion: null,
          hidro_matricula:null,
          hidro_embarcacion:null,
          hidro_descripcion_tipo:null,
          hidro_lugar_descarga:null,
          hidro_fecha_descarga:null,
          hidro_cantidad:null,
          orden_compra: null,
          cuotas: [],
          items: [],
          detailsGuiaRemision: [],
          itemsEditar: [],
          selecte: -1,
          anticipos: [],
          guias_relacionadas: [],
          credito_seleccionado:null,

        },
        isCardModalProducto: false,
        isCardModalEditarProducto: false,
        disabledTipoNotaCredito: false,
        fecha_emision: null,
        fecha_vencimiento: null,
        tiposMonedas: [{
          value: 'PEN',
          text: 'PEN'
        },
          {
            value: 'USD',
            text: 'USD'
          },
            {
                value: 'EUR',
                text: 'EUR'
            }
        ],
        tiposTransaccion: [{
          value: 1,
          text: 'CONTADO'
        },{
          value: 2,
          text: 'CREDITO'
        },/*{
          value: 3,
          text: 'CUOTA'
        }*/],
        docModificar: [{
          value: '01',
          text: 'Factura'
        },
          {
            value: '03',
            text: 'Boleta de Venta'
          },
          {
            value: '07',
            text: 'Nota de credito'
          },
          {
            value: '08',
            text: 'Nota de débito'
          }
        ],
        monto_cuota:0.0,
        n_cuota:0.0,
        numero_cuota:null,
        monto_anticipo: 0,
        clientesAutocomplete: [],
        isFetchingCliente: false,
        typeNumeroDoc: null,
        messageNumeroDoc: null,
        isModalAnticipos: false,
        isModalCuotas: false,
        listAnticipo: [],
        listCredito: [],
        listCredito_modal: [],
        isModalDatos: false,
        datosExtras: {
          guiasRemi: [],
          condicionPago: null,
          observacion: null,
          otros: []
        },
        seriesDisponibles: [],
        comprobantesList: [],
        isModalComprobantes: false
      }
    },
    validations() {
      const result = {
        formulario: {
          cliente_numero_documento: {},
          cliente_denominacion: {
            required
          },
          cliente_direccion: {
            required
          },
          cliente_email: {
            
          },
          tipo_operacion: {
            required
          },
          documento_serie: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(4),
            alphaNum
          },
          documento_numero: {
            required,
            minLength: minLength(1),
            maxLength: maxLength(8),
            numeric
          },
          documento_fecha_emision: {
            required
          },
          documento_fecha_vencimiento: {},
          documento_hora_emision: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(8),
            isHour(value) {
              return this.validarHora(value);
            }
          },
          total_venta_gravadas: {
                decimal
            },
            total_venta_gravadas_front: {
                decimal
            },
          total_venta_inafectas: {
            decimal
          },
          total_venta_exoneradas: {
            decimal
          },
          total_venta_exportacion: {
            decimal
          },
          total_venta_gratuitas: {
            decimal
          },
          total_venta_icbper: {
            decimal
            },
          total_descuento: {
            decimal
          },
          total_igv: {
            decimal
          },
          total_otros_cargos: {
            decimal
          },
          importe_total: {
            decimal
          },
          detraccion: {},
          porcentaje_detraccion: {
            decimal
          },
          porcentaje_retencion:{
            decimal
          },
          codigo_bien_detraccion: {},
          codigo_medio_pago: {},
          cuenta_financiera_beneficiario: {},
          monto_detraccion: {
            decimal
          },
          monto_retencion:{
            decimal
          },
          monto_pendiente:{
            
          },
          n_cuota:{
            maxLength: maxLength(3),
          },
          numero_cuota:{},
          documento_afectado_motivo_nota: {},
          documento_afectado_tipo_comprobante: {},
          documento_afectado_serie: {},
          documento_afectado_numero: {},
          tipo_nota_credito: {},
          tipo_nota_debito: {},
          orden_compra: {},
          items: {

            $each: {
              inc_igv: {
                required
              },
              isTextAreaDescription: {
                required
              },
              unidad_medida: {
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
              valor_venta: {
                required,
                decimal
              },
              precio_venta_unitario: {
                minValue: minValue(0.0),
                decimal
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
              detalle_viaje_detraccion: {},
              valor_servicio_transporte: {},
              valor_carga_efectiva: {},
              valor_carga_util: {},
              direccion_origen_detraccion: {},
              direccion_destino_detraccion: {},
              ubigeo_destino_detraccion: {},
              ubigeo_origen_detraccion: {},
              hidro_matricula:{},
              hidro_embarcacion:{},
              hidro_descripcion_tipo:{},
              hidro_lugar_descarga:{},
              hidro_fecha_descarga:{},
              monto_icbper:{},
              unidad_manejo: {},
              marca: {},
              instrucciones_especiales: {},
              monto_base_icbper:{},
                hidro_cantidad:{}
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
              unidad_medida: {
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
              valor_venta: {
                required,
                decimal
              },
              precio_venta_unitario: {
                required,
                minValue: minValue(0.0),
                decimal
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
              ubigeo_origen_detraccion: {},
              ubigeo_destino_detraccion: {},
              detalle_viaje_detraccion: {},
              direccion_origen_detraccion: {},
              direccion_destino_detraccion: {},
              valor_servicio_transporte: {},
              valor_carga_efectiva: {},
              valor_carga_util: {},
              hidro_matricula:{},
              hidro_embarcacion:{},
              hidro_descripcion_tipo:{},
              hidro_lugar_descarga:{},
              hidro_fecha_descarga:{},
              unidad_manejo: {},
              marca: {},
              instrucciones_especiales: {},
              hidro_cantidad:{}

            }
          },
        },

        fecha_emision: {
          required
        },
        fecha_vencimiento: {},
        monto_anticipo: {
          decimal
        }
      }
      result.formulario.items.$each.codigo_producto_sunat = {

        maxLength: maxLength(8),
      }
      //Validación de tipo de Documento
      if (this.formulario.detraccion == 'S') {
        result.formulario.porcentaje_detraccion = {
          required,
          decimal
        }
        result.formulario.cuenta_financiera_beneficiario = {
          required

        }
        result.formulario.monto_detraccion = {
          required,
          decimal,
          minValue: minValue(0.01)
        }
        if (this.retencion_detraccion == 1) {
          result.formulario.monto_retencion = {
          required,
          decimal,
          minValue: minValue(0.01)
        }
        }
        result.formulario.codigo_bien_detraccion = {
          required
        }
        result.formulario.codigo_medio_pago = {
          required
        }
      }
      //Validacion de tipo de transaccion
      if (this.formulario.documento_tipo_transaccion==2){
        result.formulario.monto_pendiente = {          
          
        }
      }      
      if (this.formulario.cliente_tipo_documento == '0') {
        result.formulario.cliente_numero_documento = {
          required,
          maxLength: maxLength(15),
          alphaNum
        };
      } else if (this.formulario.cliente_tipo_documento == '1') {
        result.formulario.cliente_numero_documento = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(8),
          numeric
        };
      } else if (this.formulario.cliente_tipo_documento == '4') {
        result.formulario.cliente_numero_documento = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else if (this.formulario.cliente_tipo_documento == '6') {
        result.formulario.cliente_numero_documento = {
          required,
          minLength: minLength(11),
          maxLength: maxLength(11),
          numeric
        };
      } else if (this.formulario.cliente_tipo_documento == '7') {
        result.formulario.cliente_numero_documento = {
          required,
          minLength: minLength(8),
          maxLength: maxLength(12),
          alphaNum
        };
      } else {
        result.formulario.cliente_numero_documento = {
          required,
          maxLength: maxLength(15),
        };
      }

      //validacion de datos del cliente obligatorio
      if ((this.tipoComprobante == "03" || this.formulario.documento_afectado_tipo_comprobante == '03') && this.formulario.importe_total <= 700) {
        delete result.formulario.cliente_numero_documento.required;
        delete result.formulario.cliente_denominacion.required;
        delete result.formulario.cliente_direccion.required;
      }

      if (this.formulario.cliente_tipo_documento == '0') {
        delete result.formulario.cliente_numero_documento.required;

      }

      if (this.tipoComprobante == "07" || this.tipoComprobante == "08") {
        result.formulario.documento_afectado_motivo_nota = {
          required
        }
        result.formulario.documento_afectado_tipo_comprobante = {
          required
        }
        result.formulario.documento_afectado_serie = {
          required,
          minLength: minLength(4),
          maxLength: maxLength(4),
          alphaNum
        }
        result.formulario.documento_afectado_numero = {
          required,
          numeric
        }
      }

      if (this.tipoComprobante == "07") {
        result.formulario.tipo_nota_credito = {
          required
        }
      } else if (this.tipoComprobante == "08") {
        result.formulario.tipo_nota_debito = {
          required
        }
      }

      if (this.formulario.detraccion == 'S') {
        result.formulario.porcentaje_detraccion = {
          required,
          decimal,
          minValue: minValue(0.01),
          maxValue: maxValue(100)
        }
      }

      if (this.formulario.tipo_operacion == '02') {
        result.formulario.items.$each.codigo_producto_sunat = {

          maxLength: maxLength(8),
        }
      }
      return result;
    },
    watch: {
      vuelines: function (val) {

        if (val.length > 0) {
          this.validar()
        }
      },

    },
    methods: {
      
      async validatetrial(){
        if(this.getCompany){

          await this.cargarCantidadComprobantes().then(data => {
            this.totalcompany = data.total
            let valor = this.getCompany.trial
            if(this.totalcompany>500 && valor){
              this.validar_trial= false
            }else {
              this.validar_trial= true
            }
          })
        }else{
          return false
        }
      },
      validardecimal($event){
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);        
        if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46)) { // 46 is dot
          $event.preventDefault();
        }
      
      },
      onChangetransacc(){
        if ( this.formulario.documento_tipo_transaccion==1) return false;
        this.$buefy.dialog.confirm({
          message: '¿Es este comprobante, la primera cuota?',
          cancelText: 'No',
          confirmText: 'Si',
          onConfirm: () => this.$buefy.toast.open('Confirmar primera cuota'),
          onCancel: () => {
            buscarcuota = 1
          }
        })
      },
      formatomesdia(date){
        if (date != null) {
          //var anio = date.substr(0, 4);
          var anio = String(date).substr(11,4);
          var mes = String(date).substr(8,2);
          return date
        }    else {
          return null
        }
      },
      formatDateDescarga(date) {
        if (date != null) {
          return dateformat(date, "yyyy-mm-dd")
        }    else {
          return null
        }

      },
      getCuentasSelect() {
        this.getCuentas.forEach(v => {
          if (v.detraccion) {
            this.formulario.cuenta_financiera_beneficiario = v.number
          }
        })

      },
      handleFileUpload(fileList) {
        this.filename = fileList[0].name
        this.fileinput = fileList[0]
        var reader = new FileReader();
        reader.readAsText(fileList[0])
        reader.onload = this.loadHandler
        reader.onerror = this.errorHandler
      },
      loadHandler(event) {
        var csv = event.target.result;
        this.processData(csv);
      },
      processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        this.vuelines = [];
        for (var i = 0; i < allTextLines.length; i++) {
          var data = allTextLines[i].split(';');
          var tarr = [];
          for (var j = 0; j < data.length; j++) {
            tarr.push(data[j]);
          }
          this.vuelines.push(tarr);
        }

        if (this.vuelines.length > 0) {
          this.validar()
        }
      },
      save(index) {

        this.$v.formulario.items.$touch()

        if (this.formulario.items[index].codigo_producto_sunat == null) {
          this.formulario.items[index].codigo_producto_sunat = ""
        }
        if (this.formulario.items[index].codigo_producto_sunat == 0) {
          this.formulario.items[index].codigo_producto_sunat = ""
        }
        if (this.formulario.items[index].codigo_producto_sunat == "0") {
          this.formulario.items[index].codigo_producto_sunat = ""
        }
        var codprodsunat = this.formulario.items[index].codigo_producto_sunat;

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


        if (this.estPorcentaje && this.formulario.items[index].porcentaje_trib_vta_grat == null) {
          this.btnsend = false
          this.validateform = "Verificar porcentaje de impuesto"
          return false
        } else {
          this.validateform = ""
        }

        if (this.estPorcentaje && this.formulario.items[index].porcentaje_trib_vta_grat <= 0) {
          this.btnsend = false
          this.validateform = "Verificar porcentaje de impuesto"
          return false
        } else {
          this.validateform = ""
        }
        if (this.formulario.tipo_operacion == "1004") {
          if (this.formulario.detalle_viaje_detraccion == "" || this.formulario.valor_servicio_transporte == "" || this.formulario.valor_carga_efectiva == "" ||
            this.formulario.valor_carga_util == "" || this.formulario.direccion_origen_detraccion == "" || this.formulario.direccion_destino_detraccion == "" ||
            this.formulario.ubigeo_destino_detraccion == "" || this.formulario.ubigeo_origen_detraccion == "") {
            this.btnsend = false
            this.validateform = "Verificar campos de transporte"
            return false
          }
        } else {
          this.validateform = ""
        }
        if (this.formulario.tipo_operacion == "02" && this.formulario.items[index].codigo_producto_sunat == "") {
          this.btnsend = false
          return false
        }

        if (this.$v.formulario.items.$error) {
          return false
        }
        if (this.formulario.items[index].descripcion == "" || this.formulario.items[index].descripcion == null || this.formulario.items[index].valor_unitario <= 0) {
          if(this.formulario.items[index].monto_base_icbper == null){
              if (this.formulario.items[index].valor_unitario <= 0 ) {
              this.formulario.items[index].valor_unitario = ""
            }
            this.btnsend = false
            return false
          }
        }else if(this.formulario.items[index].valor_unitario == 0 && this.formulario.items[index].tipo_afectacion_igv == 21){

        }else {
          this.btnsend = true
          this.isCardModalProducto = false
          this.isCardModalEditarProducto = false
        }

        if (this.formulario.items[index].descripcion == "" || this.formulario.items[index].descripcion == null || this.formulario.items[index].valor_unitario < 0) {
          if(this.formulario.items[index].monto_base_icbper != null){
            this.formulario.items[index].valor_unitario = "";
            this.btnsend = false
            return false
          }
        } else if(this.formulario.items[index].valor_unitario == 0){
          if(this.formulario.items[index].monto_base_icbper != null){
            this.formulario.items[index].tipo_afectacion_igv = 20
            this.formulario.items[index].igv = null
            this.formulario.items[index].porcentaje_igv = null
            this.btnsend = true
            this.isCardModalProducto = false
            this.isCardModalEditarProducto = false
          }
        }
        else {
          this.btnsend = true
          this.isCardModalProducto = false
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

            /*if(row.length>7){
              this.errorSend("Existen celdas que exceden a las columnas o revise los decimales deben ser en formato ##.## en la fila "+j)
              resp = 1
              this.resetfile()
              return false
            }
            if(row[3].toUpperCase()=="NIU" || row[3].toUpperCase()=="BX" || row[3].toUpperCase()=="KGM" || row[3].toUpperCase()=="BG" || row[3].toUpperCase()=="ZZ" || row[3].toUpperCase()=="PK"){}else{
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

            }*/
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
            /*producto.codigo=row[0]
            producto.descripcion=row[1]
            producto.cantidad=row[2]
            producto.moneda="PEN"
            producto.unidadMedida="NIU"
            producto.tipoAfectacion=row[4]
            producto.valorVentaConIgv=row[5]
            producto.valorVentaSinIgv=row[6]
            this.listproductimport.push(producto)*/
            var vunit = 0;
            if (row[4] == 10) {
              vunit = row[3] - row[3] * 0.18
            } else {
              vunit = row[3]
            }

            this.formulario.items.push({
              isTextAreaDescription: false,
              inc_igv: this.preciosIncluidoIgv,
              unidad_medida: row[5],
              cantidad: row[2],
              descripcion: row[0] + " " + row[1],
              codigo_producto_interno: row[0] ? row[0] : "",
              igv: row[4] != null ? 18.00 : 0.00,
              tipo_afectacion_igv: row[4],
              porcentaje_trib_vta_grat: null,
              codigo_producto_sunat: null,
              valor_unitario: row[3],
              precio_venta_unitario: (row[3]),
              precio_total: row[2] * row[3],
              valor_venta: row[2] * row[3],
              habilitarTipo: true,
              mostrarTransporte: this.formulario.tipo_operacion,
              codigoBienDetraccion: this.formulario.codigo_bien_detraccion
            })
          }
        }
        this.estadoproductos = false

      },
      borrar(index) {
        this.isCardModalProducto = false
      },      
      creditoSeleccionado(x){
        this.formulario.credito_seleccionado=x
        this.listCredito_modal.forEach(cre=>{
          if (cre.serie!=x.serie && cre.numero != x.numero){
            cre.selec=false
          }
        })
      },
      showModalPrimeraCuota() {
        if(!this.inicio || !this.isEdit){
          this.$buefy.dialog.prompt({
                    title: 'Transacción a credito',
                    message: '¿Cuantas cuotas desea generar?',                    
                    trapFocus: true,
                    inputAttrs: {
                      type: 'number',
                      value: '1',
                      min: 1,
                      max: 999
                    },
                    onConfirm: (value) => {
                      this.formulario.cantidad_cuotas = value
                      this.abrirDetalleCuotas(true);
                      },
                    onCancel:()=>{
                      this.buscarcuota = 1
                      this.formulario.documento_tipo_transaccion = 1
                      //this.showModalCreditos();
                    }
                })
        }else{
          this.inicio = false
        }
        
      },
      calcularcuota(){
        let imp = this.formulario.importe_total - 
                        (this.formulario.monto_detraccion==null?0:this.formulario.monto_detraccion) -
                        (this.formulario.monto_retencion==null?0:this.formulario.monto_retencion)
        return imp
      },
      abrirDetalleCuotas(modal){
        //if(!this.isEdit){
          
          var importe = this.calcularcuota()
          
          var monto = importe / this.formulario.cantidad_cuotas
          
          if(modal){
            this.formulario.cuotas = []
            var cuota = {}
            for(var i=0;i<this.formulario.cantidad_cuotas;i++){
              cuota = {}
              cuota.cuota_numero = i + 1
              cuota.cuota_monto = Math.round(monto * 100) / 100
              this.formulario.cuotas.push(cuota)
            }
            this.isModalCuotas = true
          }else{
            for(var i=0;i<this.formulario.cantidad_cuotas;i++){
              this.formulario.cuotas[i].cuota_monto = Math.round(monto * 100) / 100              
            }
          }
          
        //}
        
      },
      primeraCuota() {
        //this.formulario.monto_pendiente_acumulador=0;
      },
      cerrarModalDatosExtra() {
        this.isModalDatos = false
        /*if(this.formulario.items[index].tipo_afectacion_igv == 21){
          this.formulario.items[index].valor_unitario = 0
        }
        if(this.formulario.items[index].tipo_afectacion_igv == 13){
          this.formulario.items[index].valor_referencial_unitario = null
        }*/

      },
      cerrarModalCuotas(){
        if(!this.vercuota){
          this.formulario.documento_tipo_transaccion = 1
          this.formulario.cuotas = []
        }        
        this.isModalCuotas = false
      },
      guardarModalCuotas(){
        var pase = true
        for(var i =0; i < this.formulario.cuotas.length;i++){
          
          if(this.formulario.cuotas[i].cuota_monto==undefined || parseFloat(this.formulario.cuotas[i].cuota_monto)==0){
            this.validcuota="Llene el campo valor de cuota"
            pase = false
          }else if(this.formulario.cuotas[i].cuota_fecha==null){
            this.validcuota="Llene el campo fecha de cuota"
            pase = false
          }else{
            this.formulario.cuotas[i].cuota_fecha=dateformat(this.formulario.cuotas[i].cuota_fecha,"yyyy-mm-dd")
            this.formulario.cuotas[i].cuota_monto=parseFloat(this.formulario.cuotas[i].cuota_monto)
          }
        }
        if(pase){
          console.log(this.formulario)
          this.isModalCuotas = false
        }
      },
      disabledTipoDocument(codeTipoDoc) {
        if (this.formulario.tipo_operacion == '02' && codeTipoDoc == '6') {
          return true
        } else false

        if (this.tipoComprobante == '01' && codeTipoDoc == '1')
          return true
        else false

        return false

      },
      addProducto() {
        this.isCardModalProducto = true
        this.idindice = this.formulario.items.length
        this.formulario.items.push({
          isTextAreaDescription: false,
          inc_igv: this.preciosIncluidoIgv,
          unidad_medida: unidadDefault ? unidadDefault.code : 'NIU',
          cantidad: 1,
          descripcion: null,
          codigo_producto_interno: null,
          valor_unitario: 0.0000,
          precio_total: 0.00,
          valor_venta: 0.00,
          precio_venta_unitario: null,
          igv: 0.00,
          tipo_afectacion_igv: '10',
          monto_icbper: null,
          monto_base_icbper: null,
          porcentaje_trib_vta_grat: null,
          codigo_producto_sunat: null,
          habilitarTipo: true,
          mostrarTransporte: this.formulario.tipo_operacion,
          codigoBienDetraccion: this.formulario.codigo_bien_detraccion
        });
      },
      verCuotas(){
        
        this.vercuota = true
        this.isModalCuotas = true
      },      
      addBolsa() {
            this.isCardModalProducto = true
            this.idindice = this.formulario.items.length
            this.formulario.items.push({
                isTextAreaDescription: false,
                inc_igv: false,
                unidad_medida: unidadDefault ? unidadDefault.code : 'NIU',
                cantidad: 1,
                descripcion: 'BOLSA DE PLASTICO',
                codigo_producto_interno: null,
                valor_unitario: 0.0000,
                precio_total: 0.00,
                valor_venta: 0.00,
                precio_venta_unitario: 0.00,
                igv: 0.00,
                tipo_afectacion_igv: '10',
                porcentaje_trib_vta_grat: null,
                codigo_producto_sunat: null,
                monto_icbper: 0.00,
                monto_base_icbper: 0.40,
                habilitarTipo: true,
                mostrarTransporte: this.formulario.tipo_operacion,
                codigoBienDetraccion: this.formulario.codigo_bien_detraccion
            });
        },
      editarProducto(indice) {
        this.idindice = indice
        if(this.isEdit){
          if(this.formulario.items[indice].hidro_fecha_descarga)
            this.formulario.items[indice].hidro_fecha_descarga = new Date(this.formatomesdia(this.formulario.items[indice].hidro_fecha_descarga))



          this.formulario.items[indice].mostrarTransporte = this.formulario.tipo_operacion
          this.formulario.items[indice].codigoBienDetraccion = this.formulario.codigo_bien_detraccion
        }
        this.isCardModalEditarProducto = true
      },
      borrarProducto(index) {
        this.formulario.items.splice(index, 1);
      },
      validatePorcentaje(est) {
        this.estPorcentaje = est
      },
      changeFieldDescription(index) {
        this.formulario.items[index].isTextAreaDescription = !this.formulario.items[index].isTextAreaDescription
      },
      selectedProducto(index, option) {        
        if (option != null) {
          if(option.tipoAfectacion!="10" && option.tipoAfectacion!="11" && option.tipoAfectacion!="12" && option.tipoAfectacion!="13"
          && option.tipoAfectacion!="14" && option.tipoAfectacion!="15" && option.tipoAfectacion!="16" && option.tipoAfectacion!="17"){
           this.formulario.items[index].inc_igv = false
          }
          this.formulario.items[index].tipo_afectacion_igv = option.tipoAfectacion
          this.formulario.items[index].unidad_medida = option.unidadMedida
          this.formulario.items[index].codigo_producto_interno = option.codigo
          this.formulario.items[index].valor_unitario = (option.valorVentaSinIgv)
          this.formulario.items[index].precio_venta_unitario = (option.valorVentaConIgv)
          this.formulario.items[index].valor_venta = ((option.valorVentaSinIgv * this.formulario.items[index].cantidad))
          this.formulario.items[index].precio_total = ((option.valorVentaConIgv * this.formulario.items[index].cantidad))
          this.formulario.items[index].igv = (this.formulario.items[index].precio_total - this.formulario.items[index].valor_venta)
        }
      },
      getParametro(key) {
        return this.getParametros.find(val => val.key == key)
      },
      detraccionmonto(){
        if ((this.formulario.tipo_operacion == "1001" || this.formulario.tipo_operacion == "1004") && this.formulario.importe_total > 0) {
          if(this.inmutable==false){
            this.formulario.monto_detraccion = Math.round( (((this.formulario.importe_total / 100) * this.formulario.porcentaje_detraccion) * 100 ) / 100).toFixed(2)
            this.abrirDetalleCuotas(false)
          }
          
        } else {
          this.formulario.monto_detraccion = null
          this.formulario.monto_retencion = null
        }
      },
      retencionmonto(){
         if(this.inmutable==false){
            if(this.retencion_detraccion==1){
              this.formulario.monto_retencion = ((this.formulario.importe_total) * (this.formulario.porcentaje_retencion / 100)).toFixed(2)   
              this.abrirDetalleCuotas(false)           
            }else{
              this.formulario.monto_retencion = null
              this.abrirDetalleCuotas(false)
            }
         }
      },
      retencionmontochange(){
         this.abrirDetalleCuotas(false)
      },
      detraccioncalculoTotal(){
        if (this.formulario.tipo_operacion == "1001" || this.formulario.tipo_operacion == "1004") {
            this.formulario.detraccion = 'S'            
          } else {
            this.formulario.detraccion = 'N'
            this.formulario.porcentaje_detraccion = null
            this.formulario.codigo_bien_detraccion = null
          }
        this.formulario.documento_tipo_transaccion = 1
      },
      detraccionTipo(){
        if(this.formulario.codigo_bien_detraccion == "022"){
          this.formulario.porcentaje_detraccion = 12
           this.disabledetraccion = true
        }else{
          this.formulario.porcentaje_detraccion = null
           this.disabledetraccion = false
        }
      },
      retencionporcentaje(){
        if(this.retencion_detraccion == 1){
          this.formulario.porcentaje_retencion = 3
          this.formulario.retencion = 1
        }else{
          this.formulario.porcentaje_retencion = null
          this.formulario.retencion = null
        }
      },
      calculoTotal() {
        if (this.formulario.tipo_operacion == "1001" || this.formulario.tipo_operacion == "1004") {
          this.formulario.detraccion = 'S'
          this.detraccionmonto()
        } else {
          this.formulario.detraccion = 'N'
          this.formulario.porcentaje_detraccion = null
          this.formulario.codigo_bien_detraccion = null
        }
        this.retencionmonto()
        this.formulario.total_venta_exoneradas = 0
        this.formulario.total_venta_exportacion = 0
        this.formulario.total_venta_gravadas = 0
        this.formulario.total_venta_gravadas_front = 0
        this.formulario.total_venta_inafectas = 0
        this.formulario.total_venta_gratuitas = 0
        this.formulario.total_venta_icbper = 0
        this.formulario.total_igv = 0
        this.formulario.importe_total = 0
        this.monto_anticipo = 0
        this.formulario.total_imp_ope_grat = null
        var subtotal = 0
        var cambio_nota_credito = true;

        this.formulario.items.forEach((element, index) => {
          var tipoIgv = this.tipoIgvList.find((param) => param.value == element.tipo_afectacion_igv)



          if(this.formulario.items[index].monto_base_icbper != null){
            if(this.formulario.items[index].valor_unitario == 0){
              this.formulario.items[index].tipo_afectacion_igv = '21';
            }else{
              this.formulario.items[index].tipo_afectacion_igv = '10';
            }
          }



          if (tipoIgv.rel == '1001') {
            
            //SI EL PRECIO INCLUYE IGV
            if (this.formulario.items[index].inc_igv) {
              //valor del producto sin igv ni isc
              this.formulario.items[index].valor_unitario =
                ((element.precio_venta_unitario / (parseFloat(this.getParametro("IGV").value) + 1)))
              if(this.formulario.items[index].monto_base_icbper!=null)
                  this.formulario.items[index].monto_icbper = element.cantidad * element.monto_base_icbper
                //Valor del pago total del producto
              this.formulario.items[index].precio_total =
                  ((element.precio_venta_unitario * element.cantidad)+ (this.formulario.items[index].monto_icbper==null?0:
                  parseFloat(this.formulario.items[index].monto_icbper)))
              //valor del pago total sin igv ni isc del producto
              this.formulario.items[index].valor_venta =
                (((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
                    + (this.formulario.items[index].monto_icbper==null?0:parseFloat(this.formulario.items[index].monto_icbper)))
              //valor del igv
              this.formulario.items[index].igv =
                (element.precio_total - element.valor_venta)
            }
            //SI NO EL PRECIO NO INCLUYE IGV
            else {
              console.log("no incluye igv")
              //valor del producto sin igv ni isc
              this.formulario.items[index].precio_venta_unitario =
                ((element.valor_unitario * (parseFloat(this.getParametro("IGV").value) + 1)))
              //valor monto icbper bolsas plasticas
              if(this.formulario.items[index].monto_base_icbper!=null)
                  this.formulario.items[index].monto_icbper = element.cantidad * element.monto_base_icbper
              //Valor del pago total del producto
              this.formulario.items[index].precio_total =
                ((element.precio_venta_unitario * element.cantidad) + (element.monto_icbper==null?0:parseFloat(element.monto_icbper)))
              //valor del pago total sin igv ni isc del producto
              this.formulario.items[index].valor_venta =
                parseFloat(this.showWith6Decimal(((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
                    + (element.monto_icbper==null?0:parseFloat(element.monto_icbper))))
              //valor del igv
              this.formulario.items[index].igv =
                (element.precio_total - element.valor_venta)
              console.log("NOO incluye igv "+this.formulario.items[index].valor_venta+" "+element.precio_venta_unitario+" "+element.cantidad)
            }

          } else {
            //SI INCLUYE IGV
            if (this.formulario.items[index].inc_igv) {
              //valor del producto sin igv ni isc
              this.formulario.items[index].valor_unitario = parseFloat(element.precio_venta_unitario)
              //Valor del pago total del producto
              this.formulario.items[index].precio_total = ((element.precio_venta_unitario * element.cantidad) 
                                                          + element.monto_icbper==null?0:parseFloat(element.monto_icbper))
              //valor del pago total sin igv ni isc del producto
              this.formulario.items[index].valor_venta = parseFloat(element.precio_total)
              //valor del igv
              /*this.formulario.items[index].igv =
                (element.precio_total - element.valor_venta)*/
              if(this.formulario.items[index].monto_base_icbper!=null)
                  this.formulario.items[index].monto_icbper = element.cantidad * element.monto_base_icbper
            }else {
              //valor del producto sin igv ni isc
              if(this.formulario.items[index].tipo_afectacion_igv == 21 || this.formulario.items[index].tipo_afectacion_igv == 13 || this.formulario.items[index].tipo_afectacion_igv == 31){
                this.formulario.items[index].precio_venta_unitario = null
                this.formulario.items[index].valor_referencial_unitario = parseFloat(element.valor_unitario)
                this.formulario.items[index].precio_total = ((this.formulario.items[index].valor_referencial_unitario * element.cantidad) + 
                (element.monto_icbper==null?0:parseFloat(element.monto_icbper)))
                //this.formulario.items[index].valor_venta = parseFloat(element.precio_total) + (element.monto_icbper==null?0:parseFloat(element.monto_icbper))
                this.formulario.items[index].valor_venta = 0

              }else{
                this.formulario.items[index].precio_venta_unitario = parseFloat(element.valor_unitario)
                //Valor del pago total del producto
                this.formulario.items[index].precio_total =
                  ((element.precio_venta_unitario * element.cantidad) + (element.monto_icbper==null?0:parseFloat(element.monto_icbper)))
                //valor del pago total sin igv ni isc del producto

                this.formulario.items[index].valor_venta = parseFloat(element.precio_total) + (element.monto_icbper==null?0:parseFloat(element.monto_icbper))

              }
              //valor del igv
              /*this.formulario.items[index].igv =
                (element.precio_total - element.valor_venta)*/
              if(this.formulario.items[index].monto_base_icbper!=null)
                  this.formulario.items[index].monto_icbper = element.cantidad * element.monto_base_icbper
            }
            this.formulario.items[index].igv = null;
          }
          this.formulario.items[index].monto_base_igv = null
          this.formulario.items[index].porcentaje_igv = null
          this.formulario.items[index].monto_base_inafecto = null
          this.formulario.items[index].monto_base_exonerado = null
          this.formulario.items[index].monto_base_gratuito = null
          this.formulario.items[index].mostraPorc = false
          if (this.formulario.tipo_operacion == "1004") {

          }
          if (tipoIgv.rel == '1001') {
            this.formulario.total_venta_gravadas = parseFloat(this.formulario.total_venta_gravadas) + (element.monto_icbper==null?0:parseFloat(element.monto_icbper)) +
                ((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
            this.formulario.total_venta_gravadas_front = parseFloat(this.formulario.total_venta_gravadas_front) +
                ((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
            this.formulario.items[index].monto_base_igv = ((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
            this.formulario.items[index].porcentaje_igv = (parseFloat(this.getParametro("IGV").value) * 100)
            this.formulario.items[index].porcentaje_trib_vta_grat = null
            if(element.tipo_afectacion_igv == '21'){
              this.formulario.total_imp_ope_grat = this.formulario.total_imp_ope_grat + element.imp_vta_grat
            }
          } else if (tipoIgv.rel == '1002') {
            this.formulario.total_venta_inafectas = parseFloat(this.formulario.total_venta_inafectas) +
                parseFloat(((element.precio_venta_unitario * element.cantidad) ))
            this.formulario.items[index].monto_base_inafecto = ((element.precio_venta_unitario * element.cantidad) )
            this.formulario.items[index].porcentaje_trib_vta_grat = null
          } else if (tipoIgv.rel == '1003') {
            this.formulario.total_venta_exoneradas = parseFloat(this.formulario.total_venta_exoneradas) + parseFloat(((element.precio_venta_unitario * 
            element.cantidad) ))
            this.formulario.items[index].monto_base_exonerado = ((element.precio_venta_unitario * element.cantidad) )
            this.formulario.items[index].porcentaje_trib_vta_grat = null
          } else if (tipoIgv.rel == '1000') {
            this.formulario.total_venta_exportacion = parseFloat(this.formulario.total_venta_exportacion) + parseFloat(((element.precio_venta_unitario * 
            element.cantidad)))
            this.formulario.items[index].monto_base_exportacion = ((element.precio_venta_unitario * element.cantidad))
            this.formulario.items[index].porcentaje_trib_vta_grat = null
          } else if (tipoIgv.rel == '1004') {
           if (element.tipo_afectacion_igv == '11' || element.tipo_afectacion_igv == '12' || element.tipo_afectacion_igv == '14' || element.tipo_afectacion_igv == '13' ||
              element.tipo_afectacion_igv == '15' || element.tipo_afectacion_igv == '16' || element.tipo_afectacion_igv == '17') {
              this.formulario.items[index].imp_vta_grat = parseFloat(parseFloat(element.porcentaje_trib_vta_grat ? element.porcentaje_trib_vta_grat : 0) / 100) * parseFloat((element.valor_unitario * element.cantidad))
              this.formulario.items[index].mostraPorc = true
            } else {
              this.formulario.items[index].imp_vta_grat = 0
              this.formulario.items[index].porcentaje_trib_vta_grat = 0
            }            
            //this.formulario.total_venta_icbper = parseFloat(this.formulario.total_venta_icbper) + parseFloat(((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1)))
            //this.formulario.items[index].monto_base_gratuito = ((element.precio_venta_unitario * element.cantidad) / (parseFloat(this.getParametro("IGV").value) + 1))
            this.formulario.items[index].monto_base_gratuito = parseFloat(element.precio_total) 
            this.formulario.total_venta_gratuitas = parseFloat(this.formulario.total_venta_gratuitas) + parseFloat(this.formulario.items[index].monto_base_gratuito)
            this.formulario.items[index].valor_referencial_unitario = this.formulario.items[index].monto_base_gratuito / element.cantidad
            this.formulario.total_imp_ope_grat = this.formulario.total_imp_ope_grat + element.imp_vta_grat

            
          }
          this.formulario.total_venta_icbper = this.formulario.total_venta_icbper + (element.monto_icbper==null?0:parseFloat(element.monto_icbper))
          subtotal = parseFloat(subtotal) + parseFloat(((element.precio_venta_unitario * element.cantidad) / 
          (parseFloat(this.getParametro("IGV").value) + 1))) + this.formulario.total_venta_icbper

          if (element.tipo_afectacion_igv == '17' && this.tipoComprobante == '07' && cambio_nota_credito) {
            this.formulario.tipo_nota_credito = '12'
            cambio_nota_credito = false
            this.disabledTipoNotaCredito = true
          }
          /*else if(this.tipoComprobante=='07' && cambio_nota_credito){

                      this.disabledTipoNotaCredito = false
                      this.formulario.tipo_nota_credito = '01'
                    }*/
        });
        this.formulario.total_igv = this.checkIncludeIgv
        this.formulario.importe_total = this.computeImporteTotal + this.formulario.total_venta_icbper
        this.formulario.total_venta_gravadas_front = this.formulario.total_venta_gravadas_front - 
        (this.formulario.total_descuento == null ? 0 : this.formulario.total_descuento) 
        this.formulario.total_venta_gravadas = this.formulario.total_venta_gravadas_front
        if (this.formulario.tipo_operacion == "04" || this.formulario.tipo_operacion == "1001") {
          this.listAnticipo.forEach(anti => {
            if (anti.selec) {
              anti.totalValorVentaOperacionGravada = anti.totalValorVentaOperacionGravada == null ? 0 : anti.totalValorVentaOperacionGravada;
              anti.totalValorVentaOperacionInafecta = anti.totalValorVentaOperacionInafecta == null ? 0 : anti.totalValorVentaOperacionInafecta;
              anti.totalValorVentaOperacionExonerada = anti.totalValorVentaOperacionExonerada == null ? 0 : anti.totalValorVentaOperacionExonerada;
              anti.totalValorVentaOperacionExportada = anti.totalValorVentaOperacionExportada == null ? 0 : anti.totalValorVentaOperacionExportada;
              anti.totalValorVentaOperacionGratuita = anti.totalValorVentaOperacionGratuita == null ? 0 : anti.totalValorVentaOperacionGratuita;
              anti.totalValorVentaIcbper = anti.totalValorVentaIcbper == null ? 0 : anti.totalValorVentaIcbper;
              anti.montoImporteTotalVenta = anti.montoImporteTotalVenta == null ? 0 : anti.montoImporteTotalVenta;
              anti.sumatoriaIGV = anti.sumatoriaIGV == null ? 0 : anti.sumatoriaIGV;
              this.formulario.total_venta_gravadas = parseFloat(this.formulario.total_venta_gravadas) - 
                    parseFloat(anti.totalValorVentaOperacionGravada == null ? 0 : anti.totalValorVentaOperacionGravada)
              this.formulario.total_venta_gravadas_front = this.formulario.total_venta_gravadas
              this.formulario.total_venta_inafectas = parseFloat(this.formulario.total_venta_inafectas) - parseFloat(anti.totalValorVentaOperacionInafecta)
              this.formulario.total_venta_exoneradas = parseFloat(this.formulario.total_venta_exoneradas) - parseFloat(anti.totalValorVentaOperacionExonerada)
              this.formulario.total_venta_exportacion = parseFloat(this.formulario.total_venta_exportacion) - parseFloat(anti.totalValorVentaOperacionExportada)
              this.formulario.total_venta_gratuitas = parseFloat(this.formulario.total_venta_gratuitas) - parseFloat(anti.totalValorVentaOperacionGratuita)
              this.formulario.total_venta_icbper = parseFloat(this.formulario.total_venta_icbper) - parseFloat(anti.totalValorVentaIcbper)
              this.monto_anticipo = parseFloat(this.monto_anticipo) + parseFloat(anti.montoImporteTotalVenta) 
              //+ parseFloat(anti.totalValorVentaOperacionInafecta) + parseFloat(anti.totalValorVentaOperacionExonerada) +
                //parseFloat(anti.totalValorVentaOperacionGratuita) + parseFloat(anti.totalValorVentaOperacionExonerada)
              console.log(anti)
              this.formulario.importe_total = parseFloat(this.formulario.importe_total) - parseFloat(anti.montoImporteTotalVenta)   
              this.formulario.total_igv = parseFloat(this.formulario.total_igv) - parseFloat(anti.sumatoriaIGV)
            }
          })
        }
        if (this.formulario.total_descuento) {
          this.formulario.importe_total = parseFloat(this.formulario.importe_total) - parseFloat(this.formulario.total_descuento)          
          this.formulario.descuentos_globales = this.formulario.total_descuento
        }
        if (this.formulario.total_otros_cargos) {
          //this.formulario.importe_total = parseFloat(this.formulario.importe_total) + parseFloat(this.formulario.total_otros_cargos)
          
          //this.formulario.importe_total = parseFloat(this.formulario.importe_total) + parseFloat(
         // (this.formulario.total_otros_cargos == null ? 0 : this.formulario.total_otros_cargos))
          
        }
        if (this.formulario.tipo_operacion == '02') {
          if (this.formulario.cliente_tipo_documento == '6') {
            this.formulario.cliente_tipo_documento = '0'
          }
          this.formulario.items.forEach(it => {
            it.habilitarTipo = false
            it.tipo_afectacion_igv = '40'
          })
        } else {
          this.formulario.items.forEach(it => {
            it.habilitarTipo = true
          })
        }
        if (this.tipoComprobante === '07' && this.formulario.tipo_nota_credito == '13') {
          var monto = 0.00;
          for(var i = 0; i < this.formulario.cuotas.length; i++){
            monto +=  parseFloat(this.formulario.cuotas[i].cuota_monto);
          }
          this.formulario.monto_pendiente = monto;
          this.formulario.importe_total = 0;
        }        

      },
      watchNumeroDoc() {

        this.typeNumeroDoc = this.toShowType(this.$v.formulario.cliente_numero_documento);
        this.messageNumeroDoc = this.toShowMessage(this.$v.formulario.cliente_numero_documento);
        if (this.formulario.cliente_numero_documento && !this.typeNumeroDoc && !this.id) {
          if (!this.selectedCliente) {
            const params = qs.stringify({
              tipo: this.formulario.cliente_tipo_documento,
              numero: this.formulario.cliente_numero_documento
            })
            const url = `api/clientebyTypeNum?${params}`
            Methods.doGet(this, url)
              .then(response => {
                if (response.length > 0) {
                  this.formulario.cliente_denominacion = response[0].razonSocial;
                  this.formulario.cliente_direccion = response[0].direccionFiscal;
                  this.formulario.cliente_email = response[0].email;
                  this.listarAnticipos();
                }
                else if (this.formulario.cliente_tipo_documento == '6') {
                  const params = qs.stringify({
                    ruc: this.formulario.cliente_numero_documento
                  })
                  const url = `api/sunat-buscar-ruc?${params}`
                  Methods.doGet(this, url).then(data => {
                    if (data.success) {

                      this.formulario.cliente_denominacion = data.nombre_o_razon_social;
                      this.formulario.cliente_direccion = data.direccion_completa;
                    }
                    else{
                       this.typeNumeroDoc = 'is-warning'
                       this.messageNumeroDoc = 'Documento no Encontrado'
                       this.formulario.cliente_denominacion = null;
                       this.formulario.cliente_direccion = null;
                       this.formulario.cliente_email = null;
                     }
                    this.listarAnticipos();
                  });
                }

                else if (this.formulario.cliente_tipo_documento == '1') {
                  const params = qs.stringify({
                    dni: this.formulario.cliente_numero_documento
                  })
                  const url = `api/reniec-buscar-dni?${params}`
                  Methods.doGet(this, url).then(data => {
                    if (data) {
                      this.formulario.cliente_denominacion = data.nombre;
                    } else {
                      this.typeNumeroDoc = 'is-warning'
                      this.messageNumeroDoc = 'Documento no Encontrado'
                      this.formulario.cliente_denominacion = null;
                      this.formulario.cliente_direccion = null;
                      this.formulario.cliente_email = null;
                    }
                    this.listarAnticipos();
                  });
                } else {
                  this.formulario.cliente_denominacion = null;
                  this.formulario.cliente_direccion = null;
                  this.formulario.cliente_email = null;
                }
              })
              .catch((error) => {
                console.log("Error catch", error)
                throw error
              })
          } else if (this.selectedCliente) {
            this.formulario.cliente_denominacion = this.selectedCliente.razonSocial;
            this.formulario.cliente_direccion = this.selectedCliente.direccionFiscal;
            this.formulario.cliente_email = this.selectedCliente.email;
            this.selectedCliente = null;
            this.listarAnticipos();
            this.listarCreditos();
            //this.getSemaforoColor();
          }
        }
      },
      buscarCliente() {
        this.clientesAutocomplete = []
        this.isFetchingCliente = true
        const params = qs.stringify({
          tipo: this.formulario.cliente_tipo_documento,
          numero: this.formulario.cliente_numero_documento
        })
        const url = `api/clientebyTypeNum?${params}`
        Methods.doGet(this, url)
          .then(response => {
            response.forEach((item) => this.clientesAutocomplete.push(item))
            this.isFetchingCliente = false
          })
          .catch((error) => {
            this.isFetchingCliente = false
            throw error
          })
      },
      generarComprobante() {
        var hoy = new Date();        
        var emi = this.formulario.documento_fecha_emision;  
        var emiSplit = emi.split("-")
        if(emiSplit[0]>hoy.getFullYear() || 
          (emiSplit[0]==hoy.getFullYear() && (emiSplit[1]-1)>hoy.getMonth()) ||
          (emiSplit[0]==hoy.getFullYear() && (emiSplit[1]-1)==hoy.getMonth() && emiSplit[2]>hoy.getDate())){
          this.$buefy.dialog.alert({
                    title: 'Error',
                    message: 'La fecha de emision es mayor a la fecha actual. '+hoy,
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        return false
                    }
                })
        }else{
          this.$v.$touch();

            this.typeNumeroDoc = this.toShowType(this.$v.formulario.cliente_numero_documento);
            this.messageNumeroDoc = this.toShowMessage(this.$v.formulario.cliente_numero_documento);
            if (!this.$v.formulario.$error) {
                this.$buefy.dialog.confirm({
                    title: 'Confirmar',
                    message: '¿Seguro que desea generar este documento?',
                    confirmText: 'Confirmar',
                    cancelText: 'Cancelar',
                    type: 'is-info',
                    hasIcon: true,
                    onConfirm: () => {
                      this.inmutable=true
                      this.guardarComprobante()
                    }
                })
            }
        }
        //let resta = hoy.getTime() - emi.getTime() 
        //console.log(resta / (1000 * 60 * 60 *24))
        /*if(hoy.getFullYear() < emi.getFullYear() ||
            (hoy.getFullYear() == emi.getFullYear() && hoy.getMonth() < emi.getMonth()) ||
            (hoy.getFullYear() == emi.getFullYear() && hoy.getMonth() == emi.getMonth() && 
            hoy.getDate() < (emi.getDate() + 1))){

            //if (Math.round(resta / (1000 * 60 * 60 * 24)) < 1) {
                this.$buefy.dialog.alert({
                    title: 'Error',
                    message: 'La fecha de emision es mayor a la fecha actual. '+hoy,
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        return false
                    }
                })

        }else {

            this.$v.$touch();

            this.typeNumeroDoc = this.toShowType(this.$v.formulario.cliente_numero_documento);
            this.messageNumeroDoc = this.toShowMessage(this.$v.formulario.cliente_numero_documento);
            console.log(this.$v.formulario.$error)
            console.log(this.$v.formulario)
            if (!this.$v.formulario.$error) {
                this.$buefy.dialog.confirm({
                    title: 'Confirmar',
                    message: '¿Seguro que desea generar este documento?',
                    confirmText: 'Confirmar',
                    cancelText: 'Cancelar',
                    type: 'is-info',
                    hasIcon: true,
                    onConfirm: () => this.guardarComprobante()
                })
            }
        }*/
        //if(hoy.getDate() != emi.getDate() + 1){

          //}
            // else {
              /*if (Math.round(resta / (1000 * 60 * 60 * 24)) > 7 && this.tipoComprobante != '03') {
                this.$dialog.alert({
                  title: 'Error',
              message: 'Por normativa de Sunat la fecha de emision esta excediendo los 7 dias.',
              type: 'is-danger',
              hasIcon: true,
              onConfirm: () => {
                return false
              }
            })
          } else {*/
          //if (Math.round(resta / (1000 * 60 * 60 * 24)) >= 1){

            //}

          //}
        //}


      },
      guardarComprobante() {
        //Agregar Campos Adicionales
        if (this.tipoComprobante == "01" && this.formulario.tipo_operacion == "01") {
          /*if (this.formulario.cliente_tipo_documento != "6") {
            this.$buefy.dialog.alert({
              message: "El tipo de documento no es permitido en la factura",
              type: "is-danger",
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa'
            })
            return false
          }*/

        }
        this.formulario.campos_adicionales = [];

/*
        if(this.formulario.documento_tipo_transaccion==1){
          this.formulario.campos_adicionales.push({
                nombre_campo: 'Transaccion',
                valor_campo: "Contado"
          })
        }
        if(this.formulario.documento_tipo_transaccion==2){
          this.formulario.campos_adicionales.push({
                nombre_campo: 'Transaccion',
                valor_campo: "Credito"
          })
        }*/

        //Añadiendo transaccion
        if(this.formulario.documento_tipo_transaccion!=1){
          
            /*if (!this.formulario.monto_pendiente) {
              this.formulario.monto_pendiente = 0.0;
            } else {
              if (this.formulario.monto_pendiente>=this.formulario.importe_total){
                  this.$buefy.dialog.alert({
              message: "El monto pendiente no debe ser mayor o igual al importe total",
              type: "is-danger",
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa'
            })
            return false
              }else{
                this.formulario.monto_pendiente = parseFloat(this.formulario.monto_pendiente);
              }
            }
            if (!this.formulario.monto_cuota) {
              this.formulario.monto_cuota = 0.0;
            } else {
              if (this.formulario.monto_cuota>=this.formulario.importe_total){
                  this.$buefy.dialog.alert({
              message: "El monto cuota no debe ser mayor o igual al importe total",
              type: "is-danger",
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa'
            })
            return false
              }else{
              this.formulario.monto_cuota = parseFloat(this.formulario.monto_cuota);
              }
            }
            if (!this.formulario.n_cuota) {
              this.formulario.n_cuota = 0;
              this.formulario.numero_cuota=null;
            } else {
              const num = this.formulario.n_cuota
              var zeros = 3 - num.toString().length + 1;
              this.formulario.numero_cuota="Cuota"+Array(+(zeros>0 && zeros)).join("0")+num
              this.formulario.n_cuota = parseInt(this.formulario.n_cuota)
            }*/
          

        }else{
          this.formulario.monto_pendiente=0.0
        }

        if (this.datosExtras.condicionPago) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'CONDICIONES DE PAGO',
            valor_campo: this.datosExtras.condicionPago
          })
        }
        this.datosExtras.otros.forEach(data => {
          if (data.campo && data.valor) {
            this.formulario.campos_adicionales.push({
              nombre_campo: data.campo,
              valor_campo: data.valor
            })
          }
        })
        if (this.datosExtras.observacion) {
          this.formulario.campos_adicionales.push({
            nombre_campo: 'OBSERVACION',
            valor_campo: this.datosExtras.observacion
          })
        }

        //Agregar anticipos
        this.formulario.anticipos = []
        if (this.formulario.tipo_operacion == "04" || this.formulario.tipo_operacion == "1001") {
          this.listAnticipo.forEach(anti => {            
            if (anti.selec) {
              var result = {
                "documento_anticipo_serie": anti.serie,
                "documento_anticipo_numero": anti.numero,
                "documento_anticipo_tipo_documento": (anti.tipoComprobante == "01" ? "02" : anti.tipoComprobante),
                "documento_anticipo_monto_anticipado": parseFloat(parseFloat(anti.montoImporteTotalVenta
                  /*
                    (anti.totalValorVentaOperacionGravada == null ? 0 : parseFloat(anti.totalValorVentaOperacionGravada)) +
                    (anti.totalValorVentaOperacionInafecta == null ? 0 : parseFloat(anti.totalValorVentaOperacionInafecta)) +
                    (anti.totalValorVentaOperacionExonerada == null ? 0 : parseFloat(anti.totalValorVentaOperacionExonerada)) +
                    (anti.totalValorVentaOperacionGratuita == null ? 0 : parseFloat(anti.totalValorVentaOperacionGratuita))*/
                    ).toFixed(2))
              }
              /*var item = {
                "cantidad": 1,
                "descripcion": 'ANTICIPOS: COMPROBANTE NRO. '+anti.serie+'-'+anti.numero+'',
                "inc_igv": true,
                "igv": parseFloat(anti.sumatoriaIGV == null ? 0 : anti.sumatoriaIGV),
                "monto_base_igv": parseFloat(anti.montoImporteTotalVenta-anti.sumatoriaIGV),
                "porcentaje_igv": 18,
                "precio_total": anti.montoImporteTotalVenta,
                "precio_venta_unitario": anti.montoImporteTotalVenta,
                "tipo_afectacion_igv": '10',
                "unidad_medida": 'NIU',
                "valor_unitario": anti.monto_base_igv,
                "valor_venta": anti.monto_base_igv,
                "anti": true
              }*/
              this.formulario.anticipos.push(result);
              //this.formulario.items.push(item);
            }
          })
        }
        this.formulario.documento_tipo_comprobante = this.tipoComprobante;
        this.formulario.editClient = this.clientesAutocomplete.length > 0;
        if (this.formulario.cliente_tipo_documento == '0') {
          if (this.tipoComprobante == "01") {
            this.formulario.cliente_numero_documento = "-"
          } else if (this.tipoComprobante == "03") {
            this.formulario.cliente_numero_documento = "0"
          }
        }
        const url = this.isEdit ? `api/editar-comprobante` : `api/comprobantes-pago`

        this.formulario.items.forEach(i => {
          i.cantidad = parseFloat(i.cantidad);
          i.precio_venta_unitario = parseFloat(i.precio_venta_unitario);
          i.valor_unitario = parseFloat(i.valor_unitario);
          i.valor_servicio_transporte = parseFloat(i.valor_servicio_transporte);
          i.valor_carga_efectiva = parseFloat(i.valor_carga_efectiva);
          i.valor_carga_util = parseFloat(i.valor_carga_util);

          if(!i.porcentaje_trib_vta_grat){
            i.porcentaje_trib_vta_grat=null;
          }else{
            i.porcentaje_trib_vta_grat=parseFloat(i.porcentaje_trib_vta_grat);
          }

          i.hidro_fecha_descarga=this.formatDateDescarga(i.hidro_fecha_descarga);


        });
        this.formulario.documento_numero = parseInt(this.formulario.documento_numero);
        this.formulario.documento_afectado_numero = parseInt(this.formulario.documento_afectado_numero);
        if (!this.formulario.total_venta_gravadas) {
          this.formulario.total_venta_gravadas = null;
        }
        if (!this.formulario.total_venta_gravadas_front) {
            this.formulario.total_venta_gravadas_front = null;
        }
        if (!this.formulario.total_venta_gratuitas) {

          this.formulario.total_venta_gratuitas = null;
        }
        if (!this.formulario.total_venta_icbper) {

              this.formulario.total_venta_icbper = null;
        }
        if (!this.formulario.total_venta_exoneradas) {
          this.formulario.total_venta_exoneradas = null;
        }
        if (!this.formulario.total_venta_exportacion) {
          this.formulario.total_venta_exportacion = null;
        }
        if (!this.formulario.total_venta_inafectas) {
          this.formulario.total_venta_inafectas = null;
        }
        if (!this.formulario.total_igv) {
          this.formulario.total_igv = null;
        }
        if (!this.formulario.monto_detraccion) {
          this.formulario.monto_detraccion = null;
        } else {
            this.formulario.monto_detraccion = parseFloat(this.formulario.monto_detraccion);
        }
        if (!this.formulario.monto_retencion) {
          this.formulario.monto_retencion = null;
        } else {
            this.formulario.monto_retencion = parseFloat(this.formulario.monto_retencion);
        }
        if (!this.formulario.porcentaje_detraccion) {
          this.formulario.porcentaje_detraccion = null;
        } else {
          this.formulario.porcentaje_detraccion = parseFloat(this.formulario.porcentaje_detraccion);
        }

        if (this.formulario.total_descuento) {
          this.formulario.total_descuento = parseFloat(this.formulario.total_descuento);
        }

        if (this.formulario.descuentos_globales) {
          this.formulario.descuentos_globales = parseFloat(this.formulario.descuentos_globales);
        }
        if (this.formulario.total_otros_cargos) {
            if (parseFloat(this.formulario.total_otros_cargos)>0){
                this.formulario.total_otros_cargos = parseFloat(this.formulario.total_otros_cargos);
            }else{
                this.formulario.total_otros_cargos = null;
            }

        }
        if (this.formulario.documento_tipo_transaccion==2) {
          var monto = 0.00;
          for(var i = 0; i < this.formulario.cuotas.length; i++){
            monto +=  parseFloat(this.formulario.cuotas[i].cuota_monto);
          }

          this.formulario.monto_pendiente=monto
          this.formulario.cantidad_cuotas=parseFloat(this.formulario.cantidad_cuotas)
          this.formulario.pago_cuenta=parseFloat(this.formulario.pago_cuenta)              

         }
         console.log(this.formulario)
        Methods.doPost(this, url, this.formulario).then(data => {
          const params = [
            `identificadorDocumento=` + data.nombre,

          ].join('&')
          if (this.estado_anticipo == 1) {
            const urlanticipo = `api/update-anticipo-comprobante?` + params
            Methods.doPost(this, urlanticipo).then(data => {


            })
          }
          this.$buefy.dialog.confirm({
            title: 'Mensaje',
            message: data.mensaje,
            confirmText: 'Aceptar',
            type: data.estado ? 'is-success' : 'is-danger',
            hasIcon: true,
            onConfirm: () => {
              if (data.estado) {
                this.$router.push('/admin/comprobantes/ver-comprobantes');
              }
            }
          })
        })
      },
      showModalAnticipos() {
        this.isModalAnticipos = true
      },
      addGuias() {
        this.formulario.guias_relacionadas.push({serie_numero_guia: '', codigo_tipo_guia: '09'});
      },
      deleteGuia(ind) {
        this.formulario.guias_relacionadas.splice(ind, 1);
      },
      addOtros() {
        this.datosExtras.otros.push({
          campo: '',
          valor: null
        });
      },
      deleteOtro(ind) {
        this.datosExtras.otros.splice(ind, 1);
      },
      obtenerSiguienteNumero() {
        if (!this.isEdit) {
          if (this.formulario.documento_serie) {
            const url = `api/siguienteNumero/${this.tipoComprobante}/${this.formulario.documento_serie}`
            Methods.doGet(this, url).then(numero => {
              this.formulario.documento_numero = numero
            })

          }
        }
      },
      seleccionComprobante(item) {
        if (this.tipoComprobante == '07') {
          this.$router.push({
            name: "admin.comprobantes.emitir-nota-credito",
            params: {id: item.idPaymentVoucher}
          });
        } else if (this.tipoComprobante == '08') {
          this.$router.push({
            name: "admin.comprobantes.emitir-nota-debito",
            params: {id: item.idPaymentVoucher}
          });
        }
        this.isModalComprobantes = false;
      },
      changeCliente() {
        this.$v.formulario.cliente_numero_documento.$touch();
        this.watchNumeroDoc();
        if (!this.$v.formulario.cliente_numero_documento.$error) {
          if (this.tipoComprobante == '07' || this.tipoComprobante == '08') {
            const params = qs.stringify({
              filtroNumDoc: this.formulario.cliente_numero_documento
            })
            const url = `api/comprobantes-notas?${params}`
            Methods.doGet(this, url).then(response => {
              if (response.length > 0) {
                this.comprobantesList = response;
                this.isModalComprobantes = true;
              } else {
                this.$buefy.dialog.alert({
                  title: 'Error',
                  message: 'No hay comprobante relacionado al Numero de Documento',
                  type: 'is-danger',
                  hasIcon: true
                })
              }
            })
          }
        }
      },
      getDataFromGuia(){
        const idFind = this.idGuia
        if (idFind) {
          const params = qs.stringify({
            id: idFind
          })
          const url = `api/guiaById?${params}`
          Methods.doGet(this, url).then(data => {
            const prods = [];
            data.detailsGuiaRemision.forEach(p => {
              if(p.codigoTipoAfectacionIGV!="10" && p.codigoTipoAfectacionIGV!="11" && p.codigoTipoAfectacionIGV!="12" && 
                 p.codigoTipoAfectacionIGV!="13" && p.codigoTipoAfectacionIGV!="14" && p.codigoTipoAfectacionIGV!="15" && 
                 p.codigoTipoAfectacionIGV!="16" && p.codigoTipoAfectacionIGV!="17"){
                  this.preciosIncluidoIgv = false
                }                
              var pr = {
                inc_igv: this.preciosIncluidoIgv,    
                tipo_afectacion_igv: p.codigoTipoAfectacionIGV,            
                cantidad: p.cantidad,
                descripcion: p.descripcion,
                isTextAreaDescription: false,
                unidad_medida: p.unidadMedida,
                valor_unitario: p.precioItem,
                codigo_producto_interno: p.codigoItem,
                valor_venta: parseFloat(p.precioItem * p.cantidad),
                codigo_producto_sunat: p.codigoProductoSunat,
                valor_unitario: (p.valorUnitario == 0 ? p.valorReferencialUnitario : p.valorUnitario),
                porcentaje_trib_vta_grat: p.porcentajeTributoVentaGratuita,
                precio_venta_unitario: p.precioVentaUnitario ? p.precioVentaUnitario : p.valorReferencialUnitario,
                valor_venta: parseFloat(p.valorVenta),
                precio_total: parseFloat(p.precioVentaUnitario * p.cantidad),
                
              };
              prods.push(pr);
            });

            this.formulario = {
              cliente_tipo_documento: data.tipoDocumentoIdentidadDestinatario,
              cliente_numero_documento: (data.numeroDocumentoIdentidadDestinatario == '-' ? '' : data.numeroDocumentoIdentidadDestinatario),
              documento_tipo_moneda: 'PEN',
              documento_tipo_transaccion: 1,
              monto_pendiente:0,
              cliente_denominacion: data.denominacionDestinatario,
              // FECHA EMISION DESDE GUIA
              documento_fecha_emision: this.formulario.documento_fecha_emision,
              documento_fecha_vencimiento: this.formulario.documento_fecha_vencimiento,
              total_descuento: 0,
              tipo_operacion: '01',
              total_venta_exoneradas: data.totalValorVentaOperacionExonerada,
              total_venta_exportacion: data.totalValorVentaOperacionExportada,
              total_venta_inafectas: data.totalValorVentaOperac1ionInafecta,
              total_venta_gravadas: data.totalValorVentaOperacionGravada,
              total_venta_gravadas_front: (data.totalValorVentaOperacionGravada==null?0:parseFloat(data.totalValorVentaOperacionGravada)) - (data.totalValorVentaIcbper==null?0:parseFloat(data.totalValorVentaIcbper)),
              total_igv: data.sumatoriaIGV,
              total_venta_gratuitas: data.totalValorVentaOperacionGratuita,
              total_venta_icbper: data.totalValorVentaIcbper,
              total_descuento: data.totalDescuento,
              importe_total: data.montoImporteTotalVenta,
              documento_hora_emision: this.formulario.documento_hora_emision,
              documento_afectado_tipo_comprobante: this.formulario.documento_afectado_tipo_comprobante,
              documento_afectado_serie: this.formulario.documento_afectado_serie,
              documento_afectado_numero: this.formulario.documento_afectado_numero,
              detraccion: this.formulario.detraccion,
              items: prods,
              codigo_medio_pago: this.formulario.codigo_medio_pago,
              codigo_bien_detraccion: this.formulario.codigo_bien_detraccion,
              cuenta_financiera_beneficiario: this.formulario.cuenta_financiera_beneficiario,
              tipo_nota_credito: this.formulario.tipo_nota_credito,
              tipo_nota_debito: this.formulario.tipo_nota_debito,
              documento_serie: this.formulario.documento_serie,
              documento_numero: this.formulario.documento_numero,
              guias_relacionadas: []
            };
              this.formulario.guias_relacionadas.push({
                serie_numero_guia: data.serie+'-'+data.numero,
                codigo_tipo_guia: '09'
              })
          })
        }
      },
      getDataFromComprobanteCredito(){
        const prods=[]
        this.formulario.credito_seleccionado.detailsPaymentVouchers.forEach(p => {
          if(p.codigoTipoAfectacionIGV!="10" && p.codigoTipoAfectacionIGV!="11" && p.codigoTipoAfectacionIGV!="12" && 
                 p.codigoTipoAfectacionIGV!="13" && p.codigoTipoAfectacionIGV!="14" && p.codigoTipoAfectacionIGV!="15" && 
                 p.codigoTipoAfectacionIGV!="16" && p.codigoTipoAfectacionIGV!="17"){
                  this.preciosIncluidoIgv = false
                }  
              var pr = {
                inc_igv: this.preciosIncluidoIgv,
                tipo_afectacion_igv: p.codigoTipoAfectacionIGV,
                cantidad: p.cantidad,
                unidad_medida: p.codigoUnidadMedida,
                descripcion: p.descripcion,
                isTextAreaDescription: false,
                codigo_producto_interno: p.codigoProducto,
                codigo_producto_sunat: p.codigoProductoSunat,
                detalle_viaje_detraccion: p.detalleViajeDetraccion,
                direccion_origen_detraccion: p.direccionOrigenDetraccion,
                direccion_destino_detraccion: p.direccionDestinoDetraccion,
                ubigeo_origen_detraccion: p.ubigeoOrigenDetraccion,
                ubigeo_destino_detraccion: p.ubigeoDestinoDetraccion,
                valor_servicio_transporte: p.valorServicioTransporte,
                valor_carga_efectiva: p.valorCargaEfectiva,
                valor_carga_util: p.valorCargaUtil,
                unidad_manejo: p.unidadManejo,
                marca: p.marca,
                instrucciones_especiales: p.instruccionesEspeciales,
                valor_unitario: (p.valorUnitario == 0 ? p.valorReferencialUnitario : p.valorUnitario),
                porcentaje_trib_vta_grat: p.porcentajeTributoVentaGratuita,
                precio_venta_unitario: p.precioVentaUnitario ? p.precioVentaUnitario : p.valorReferencialUnitario,
                valor_venta: parseFloat(p.valorVenta),
                precio_total: parseFloat(p.precioVentaUnitario * p.cantidad),
                
                hidro_matricula: p.hidroMatricula,
                hidro_embarcacion: p.hidroEmbarcacion,
                hidro_descripcion_tipo: p.hidroDescripcionTipo,
                hidro_lugar_descarga: p.hidroLugarDescarga,
                hidro_fecha_descarga: p.hidroFechaDescarga,
                hidro_cantidad: p.hidroCantidad

              };
              prods.push(pr);
            });

        this.formulario.items=prods
        this.formulario.total_venta_exoneradas= this.formulario.credito_seleccionado.totalValorVentaOperacionExonerada
        this.formulario.total_venta_exportacion= this.formulario.credito_seleccionado.totalValorVentaOperacionExportada
        this.formulario.total_venta_inafectas= this.formulario.credito_seleccionado.totalValorVentaOperac1ionInafecta
        this.formulario.total_venta_gravadas= this.formulario.credito_seleccionado.totalValorVentaOperacionGravada
        this.formulario.total_venta_gravadas_front= (this.formulario.credito_seleccionado.totalValorVentaOperacionGravada==null?0:parseFloat(this.formulario.credito_seleccionado.totalValorVentaOperacionGravada)) - (this.formulario.credito_seleccionado.totalValorVentaIcbper==null?0:parseFloat(this.formulario.credito_seleccionado.totalValorVentaIcbper))
        this.formulario.total_igv= this.formulario.credito_seleccionado.montoImporteTotalVenta//this.formulario.credito_seleccionado.sumatoriaIGV
        this.formulario.total_venta_gratuitas= this.formulario.credito_seleccionado.totalValorVentaOperacionGratuita
        this.formulario.total_venta_icbper= this.formulario.credito_seleccionado.totalValorVentaIcbper
        this.formulario.total_descuento= this.formulario.credito_seleccionado.totalDescuento
        this.formulario.total_otros_cargos= this.formulario.credito_seleccionado.montoSumatorioOtrosCargos,
        this.formulario.importe_total= this.formulario.credito_seleccionado.montoImporteTotalVenta
      },
      getDataFromComprobante() {
        const idFind = this.isEdit ? this.idEdit : this.id
        const idFindGuia = this.isEdit ? this.idEdit : this.idGuia
        var include = true
        if (idFind) {
          const params = qs.stringify({
            id: idFind
          })
          const url = `api/comprobanteById?${params}`
          Methods.doGet(this, url).then(data => {
            const prods = [];
            const ctas = [];
            console.log("NOTA EDIT")
            console.log(data)
            data.detailsPaymentVouchers.forEach(p => {              
              include = true
              if(p.codigoTipoAfectacionIGV!="10" && p.codigoTipoAfectacionIGV!="11" && p.codigoTipoAfectacionIGV!="12" && 
                 p.codigoTipoAfectacionIGV!="13" && p.codigoTipoAfectacionIGV!="14" && p.codigoTipoAfectacionIGV!="15" && 
                 p.codigoTipoAfectacionIGV!="16" && p.codigoTipoAfectacionIGV!="17"){                  
                  include = false
                }else{
                  include = this.preciosIncluidoIgv
                }  
              var pr = {
                inc_igv: include,
                tipo_afectacion_igv: p.codigoTipoAfectacionIGV,
                cantidad: p.cantidad,
                unidad_medida: p.codigoUnidadMedida,
                descripcion: p.descripcion,
                isTextAreaDescription: false,
                codigo_producto_interno: p.codigoProducto,
                codigo_producto_sunat: p.codigoProductoSunat,
                detalle_viaje_detraccion: p.detalleViajeDetraccion,
                direccion_origen_detraccion: p.direccionOrigenDetraccion,
                direccion_destino_detraccion: p.direccionDestinoDetraccion,
                ubigeo_origen_detraccion: p.ubigeoOrigenDetraccion,
                ubigeo_destino_detraccion: p.ubigeoDestinoDetraccion,
                valor_servicio_transporte: p.valorServicioTransporte,
                valor_carga_efectiva: p.valorCargaEfectiva,
                valor_carga_util: p.valorCargaUtil,
                unidad_manejo: p.unidadManejo,
                marca: p.marca,
                instrucciones_especiales: p.instruccionesEspeciales,
                valor_unitario: (p.valorUnitario == 0 ? p.valorReferencialUnitario : p.valorUnitario),
                porcentaje_trib_vta_grat: p.porcentajeTributoVentaGratuita,
                precio_venta_unitario: p.precioVentaUnitario ? p.precioVentaUnitario : p.valorReferencialUnitario,
                valor_venta: parseFloat(p.valorVenta),
                precio_total: parseFloat(p.precioVentaUnitario * p.cantidad),
                
                hidro_matricula: p.hidroMatricula,
                hidro_embarcacion: p.hidroEmbarcacion,
                hidro_descripcion_tipo: p.hidroDescripcionTipo,
                hidro_lugar_descarga: p.hidroLugarDescarga,
                hidro_fecha_descarga: p.hidroFechaDescarga,
                hidro_cantidad: p.hidroCantidad,
                monto_pendiente: 0.0
              };
              prods.push(pr);
            });
            data.cuotas.forEach(c => {
              var cuota = {
                cuota_numero: c.numero,
                cuota_monto: c.monto,
                cuota_fecha: c.fecha                
              }
              ctas.push(cuota)
            })
            if (this.isEdit) {

              this.formulario.documento_serie = data.serie
              this.formulario.documento_numero = data.numero
              // SI ES EDITAR COMPROBANTE
              this.formulario.documento_fecha_emision = data.fechaEmision
              this.formulario.documento_fecha_vencimiento = data.fechaVencimiento
              this.formulario.documento_hora_emision = data.horaEmision
              this.formulario.documento_afectado_tipo_comprobante = data.tipoComprobanteAfectado
              this.formulario.documento_afectado_serie = data.serieAfectado
              this.formulario.documento_afectado_numero = data.numeroAfectado
              this.formulario.tipo_nota_credito = data.codigoTipoNotaCredito
              this.formulario.tipo_nota_debito = data.codigoTipoNotaDebito
              
              this.formulario.porcentaje_detraccion = data.porcentajeDetraccion
              this.fecha_emision = new Date(data.fechaEmisionDate)


              this.formulario.detraccion = data.detraccion
              this.formulario.monto_detraccion = data.montoDetraccion
              this.formulario.monto_retencion = data.montoRetencion
              this.formulario.codigo_bien_detraccion = data.codigoBienDetraccion,
              this.formulario.codigo_medio_pago = data.codigoMedioPago
              this.formulario.cuenta_financiera_beneficiario = data.cuentaFinancieraBeneficiario


              this.formulario.documento_tipo_transaccion = data.tipoTransaccion 
              this.formulario.monto_pendiente = data.montoPendiente
              this.formulario.cantidad_cuotas = data.cantidadCuotas
              this.formulario.pago_cuenta = data.pagoCuenta
              this.formulario.tipo_operacion = data.tipoOperacion=="0101"?"01":this.formulario.tipo_operacion = data.tipoOperacion
              this.formulario.detraccion = data.detraccion
            }
            else {
              if (this.seriesDisponibles.length > 0) {
                this.formulario.documento_serie = this.seriesDisponibles.find(function (element) {
                  if (data.tipoComprobante == '01') {
                    return element.value.includes("F", 0);
                  } else {
                    return element.value.includes("B", 0);
                  }
                }).value;
              }

              this.formulario.documento_afectado_tipo_comprobante = data.tipoComprobante
              this.formulario.documento_afectado_serie = data.serie
              this.formulario.documento_afectado_numero = data.numero
              this.formulario.tipo_operacion = data.tipoOperacion=="1001"?"01":data.tipoOperacion=="1004"?"01":data.tipoOperacion
              this.formulario.detraccion = "N"
            }
            this.formulario = {
              cliente_tipo_documento: data.tipoDocIdentReceptor,
              cliente_numero_documento: (data.numDocIdentReceptor == '-' ? '' : data.numDocIdentReceptor),
              cliente_denominacion: data.denominacionReceptor,
              //SI NO ES EDITAR
              documento_fecha_emision: this.formulario.documento_fecha_emision,
              documento_fecha_vencimiento: this.formulario.documento_fecha_vencimiento,
              documento_tipo_moneda: data.codigoMoneda,
              documento_tipo_transaccion: data.tipoTransaccion,
              monto_pendiente:this.showWith2Decimal(data.montoPendiente==null?0.0:data.montoPendiente),
              monto_pendiente_acumulador:this.showWith2Decimal(data.montoPendiente==null?0:data.montoPendiente),

              documento_afectado_motivo_nota: data.motivoNota,
              total_venta_exoneradas: data.totalValorVentaOperacionExonerada,
              total_venta_exportacion: data.totalValorVentaOperacionExportada,
              total_venta_inafectas: data.totalValorVentaOperac1ionInafecta,
              total_venta_gravadas: data.totalValorVentaOperacionGravada,
              total_venta_gravadas_front: (data.totalValorVentaOperacionGravada==null?0:parseFloat(data.totalValorVentaOperacionGravada)) - (data.totalValorVentaIcbper==null?0:parseFloat(data.totalValorVentaIcbper)),
              total_igv: data.sumatoriaIGV,
              total_venta_gratuitas: data.totalValorVentaOperacionGratuita,
              total_venta_icbper: data.totalValorVentaIcbper,
              total_descuento: data.totalDescuento,
              importe_total: data.montoImporteTotalVenta,
              cliente_direccion: data.direccionReceptor,
              
              documento_hora_emision: this.formulario.documento_hora_emision,
              documento_afectado_tipo_comprobante: this.formulario.documento_afectado_tipo_comprobante,
              documento_afectado_serie: this.formulario.documento_afectado_serie,
              documento_afectado_numero: this.formulario.documento_afectado_numero,
              tipo_operacion: this.formulario.tipo_operacion,
              
              detraccion: this.formulario.detraccion,
              porcentaje_detraccion: this.formulario.detraccion=="S"?this.formulario.porcentaje_detraccion:null,
              monto_detraccion: this.formulario.detraccion=="S"?this.formulario.monto_detraccion:null,
              monto_retencion: this.formulario.detraccion=="S"?this.formulario.monto_retencion:null,
              codigo_medio_pago: this.formulario.detraccion=="S"?this.formulario.codigo_medio_pago:null,
              codigo_bien_detraccion: this.formulario.detraccion=="S"?this.formulario.codigo_bien_detraccion:null,
              cuenta_financiera_beneficiario: this.formulario.detraccion=="S"?this.formulario.cuenta_financiera_beneficiario:null,


              //total_otros_cargos: (data.totalOtrosCargos == null?0:parseFloat(data.totalOtrosCargos)),
              tipo_nota_credito: this.formulario.tipo_nota_credito,
              tipo_nota_debito: this.formulario.tipo_nota_debito,
              documento_serie: this.formulario.documento_serie,
              documento_numero: this.formulario.documento_numero,

              cliente_email: data.emailReceptor,
              total_otros_cargos: data.montoSumatorioOtrosCargos,
              orden_compra: data.ordenCompra,
              items: prods,
              cuotas: ctas,
              cantidad_cuotas: data.cantidadCuotas,
              anticipos: data.anticipos,
              guias_relacionadas: []
            };
            if(!data.tipoTransaccion){
                this.formulario.documento_tipo_transaccion=1
            }

            data.guiasRelacionadas.forEach(g => {
              this.formulario.guias_relacionadas.push({
                serie_numero_guia: g.serieNumeroGuia,
                codigo_tipo_guia: g.codigoTipoGuia
              })
            })
            if(data.aditionalFields != undefined)
              data.aditionalFields.forEach(field => {
                if (field.typeField.name == 'CONDICIONES DE PAGO') {
                  this.datosExtras.condicionPago = field.valorCampo;
                } else if (field.typeField.name == 'OBSERVACION') {
                  this.datosExtras.observacion = field.valorCampo;
                } else {
                  this.datosExtras.otros.push({campo: field.typeField.name, valor: field.valorCampo});
                }
              })
              
            this.listarAnticipos();
          })
        }
      },
      showWith2Decimal(number) {
        if (parseFloat(number) < 0.005 && parseFloat(number) > -0.005)
          return (0).toFixed(2)
        return ((Math.round(parseFloat(number) * 100)) / 100).toFixed(2)

      },
      showWith6Decimal(number) {
        if (parseFloat(number) < 0.005 && parseFloat(number) > -0.005)
          return (0).toFixed(2)
        return ((parseFloat(number)).toFixed(6))

      },
      listarAnticipos() {
            if(this.tipoComprobante == '01' || (this.tipoComprobante == '07' && this.formulario.documento_afectado_tipo_comprobante == '01' )){
              this.tipoComprobanteCuota = true;
            }else {
              this.tipoComprobanteCuota = false;
            }
        const params = qs.stringify({
          filtroNumDoc: this.formulario.cliente_numero_documento
        })
        const url = `api/comprobantes-anticipo?${params}`
        Methods.doGet(this, url)
          .then(response => {
            this.listAnticipo = response;
            if (this.formulario.anticipos != null && this.formulario.anticipos.length > 0) {
              this.listAnticipo.forEach((anti, index) => {
                var resp = this.formulario.anticipos.find(val => {
                  return (val.serieAnticipo == anti.serie && val.numeroAnticipo == anti.numero)
                })
                if (resp) {
                  this.listAnticipo[index].selec = true;
                }
              })
            }
          })
          .catch((error) => {
            throw error
          })
      },
      listarCreditos() {
        this.listCredito=[]
        this.listCredito_modal=[]
        const params = qs.stringify({
          filtroNumDoc: this.formulario.cliente_numero_documento
        })
        const url = `api/comprobantes-credito?${params}`
        Methods.doGet(this, url)
          .then(response => {
            this.listCredito = response;
            
            this.listCredito.forEach(x=>{
              x.selec=false
              const {serie,numero,fechaEmision,montoPendiente,ncuota,montoImporteTotalVenta,selec}=x
              this.listCredito_modal.push({serie,numero,fechaEmision,montoPendiente:this.showWith2Decimal(montoPendiente),ncuota,montoImporteTotalVenta,selec})
            })
          })
          .catch((error) => {
            throw error
          })
      },
      getSemaforoColor() {
        const url_empresa = `http://200.41.86.230:8091/api/consultar/empresa/${this.formulario.cliente_numero_documento}`
        const url_persona = `http://200.41.86.230:8091/api/consultar/persona/1/${this.formulario.cliente_numero_documento}`
        const semaforo='semaforo'

        Methods.doGet(this, url_empresa)
          .then(response => {
            console.log(response);
          })
          .catch((error) => {
            throw error
          })
        Methods.doGet(this, url_persona)
          .then(response => {
            console.log(response);
          })
          .catch((error) => {
            throw error
          })
        this.semaforo_color=semaforo + 'plomo'
      },
      loadSeriesByPunto() {
        //CARGANDO SERIES
        if (!this.isEdit) {
          if (this.getPuntoVenta) {
            this.seriesDisponibles = []
            this.getPuntoVenta.series.forEach((ser, i) => {
              if (ser.tipoDocumento == this.tipoComprobante)
                this.seriesDisponibles.push({
                  value: ser.serie,
                  text: ser.serie
                })
            })
            if (this.seriesDisponibles[0])
              this.formulario.documento_serie = this.seriesDisponibles[0].value
          }
        }
      }
    },
    beforeMount() {
      const fechaActual = new Date();
      this.validatetrial()
      if (!this.isEdit) {
        if (this.tipoComprobante === '07') {
          this.formulario.tipo_nota_credito = '01'
        } else if (this.tipoComprobante === '08') {
          this.formulario.tipo_nota_debito = '01'
        }
        if (this.tipoComprobante === '07' || this.tipoComprobante === '08') {
          this.formulario.documento_afectado_tipo_comprobante = '01';
        }              
        
        this.fecha_emision = fechaActual;
        this.formulario.documento_fecha_emision = dateformat(this.fecha_emision, "yyyy-mm-dd");
        this.formulario.documento_hora_emision = dateformat(this.fecha_emision, "HH:MM:ss");
      }
      else {
        const fechaActual = new Date();
        this.formulario.documento_hora_emision = dateformat(fechaActual, "HH:MM:ss");
      }
      
    },
    mounted() {
      if(this.tipoComprobante=='01'){
        this.tipoComprobanteCuota=true
      }
      //CARGANDO SERIES
      this.loadSeriesByPunto()
      //SI SE CARGA DESDE COMPROBANTE CON ID
      this.getDataFromGuia()
      this.getDataFromComprobante()
      this.getCuentasSelect()
      
    },
    watch: {

      'checkDescuentoIgv': {
        handler: function () {

          if (this.checkDescuentoIgv) {
            this.formulario.total_igv = parseFloat(this.formulario.total_venta_gravadas_front - this.formulario.total_descuento) * parseFloat(this.getParametro("IGV").value)
          } else {
            this.formulario.total_igv = parseFloat(this.formulario.total_venta_gravadas_front) * parseFloat(this.getParametro("IGV").value)
          }
          this.formulario.importe_total = this.formulario.total_venta_gravadas_front + this.formulario.total_venta_inafectas + this.formulario.total_venta_exoneradas +
            this.formulario.total_venta_exportacion +     //this.formulario.total_venta_gratuitas
            +this.formulario.total_igv - this.formulario.total_descuento
        }
      },
      'formulario.documento_tipo_transaccion':function(x){
        //if (!this.isEdit) {
        if (x==2) {
          this.vercuota = false          
          this.showModalPrimeraCuota()
          //}
        }else{
          this.vercuota = false
          this.formulario.cuotas = []
          this.formulario.cantidad_cuotas = 0
        }

      },
      'formulario.credito_seleccionado':function(x){
        if (x==null || !x.selec) {
          this.listCredito_modal.forEach(cre=>{
            cre.selec=false
          })
        }else{
          this.listCredito_modal.forEach(cre=>{
            if (cre.serie!=x.serie && cre.numero!=x.numero){
              cre.selec=false
            }
          })
        }

      },
      'formulario.monto_cuota':function(x){
        if (!this.isEdit) {
          if(x==''){
            this.formulario.cuota_monto=0
          }
          if(parseFloat(x)>0){
            this.formulario.cuota_monto=parseFloat(x)
          }
          
        }

      },
      'formulario.importe_total':function(x){
        if (!this.isEdit) {
          if(this.formulario.documento_tipo_transaccion==2){
            this.formulario.monto_pendiente_acumulador= this.showWith2Decimal(this.formulario.importe_total)            
          }
        }

      },
      'formulario.monto_pendiente_acumulador':function(x){
        if (!this.isEdit) {
          
        }
      },
      'isCardModalProducto': {
        handler: function () {
          var indice = this.formulario.items.length - 1
          if (this.btnsend == false) {
            if (this.isCardModalProducto == false) {
              this.formulario.items.splice(indice, 1)
            }

          } else {
            this.btnsend = false
          }
        }
      },
      'fecha_emision': {
        handler: function () {
          this.formulario.documento_fecha_emision = dateformat(this.fecha_emision, "yyyy-mm-dd");
        }
      },
      'fecha_vencimiento': {
        handler: function () {
          this.formulario.documento_fecha_vencimiento = dateformat(this.fecha_vencimiento, "yyyy-mm-dd");
        }
      },
      'formulario.tipo_operacion': 'detraccioncalculoTotal',
      'formulario.codigo_bien_detraccion': 'detraccionTipo',
      'retencion_detraccion': 'retencionporcentaje',      
      'formulario.porcentaje_detraccion': 'detraccionmonto',
      'formulario.porcentaje_retencion': 'retencionmonto',
      'formulario.monto_retencion': 'retencionmontochange',
      
      'formulario.cliente_tipo_documento': 'watchNumeroDoc',
      'formulario.cliente_numero_documento': 'watchNumeroDoc',
      'formulario.documento_serie': 'obtenerSiguienteNumero',
      'formulario.items': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      'formulario.total_descuento': 'calculoTotal',
      'formulario.total_otros_cargos': 'calculoTotal',
      'formulario.anticipos': 'calculoTotal',
      'listAnticipo': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      '$route.params.id': 'getDataFromComprobante',
      '$route.params.idGuia': 'getDataFromGuia',
      'getPuntoVenta': 'loadSeriesByPunto'
    },
    computed: {
      ...mapGetters({'getCompany': 'auth/getCompany'}),
      ...mapGetters({
        'getCatalogo54': 'catalogos/getCatalogo54'
      }),
      ...mapGetters({
        'getCatalogo59': 'catalogos/getCatalogo59'
      }),
      ...mapGetters({
        'getCatalogo06': 'catalogos/getCatalogo06'
      }),
      ...mapGetters({
        'getCatalogo07': 'catalogos/getCatalogo07'
      }),
      ...mapGetters({
        'getCatalogo09': 'catalogos/getCatalogo09'
      }),
      ...mapGetters({
        'getCatalogo10': 'catalogos/getCatalogo10'
      }),
      ...mapGetters({
        'getCatalogo17': 'catalogos/getCatalogo17'
      }),
      ...mapGetters({
        'getParametros': 'catalogos/getParametros'
      }),
      ...mapGetters({
        'getCuentas': 'catalogos/getCuentas'
      }),
      ...mapGetters({
        'getPuntoVenta': 'punto/getPuntoVenta'
      }),
      /*async validatetrial(){
        if(this.getCompany){

          await this.cargarCantidadComprobantes().then(data => {
            this.totalcompany = data.total
            let valor = this.getCompany.trial
            //valor=true
            if(this.totalcompany>500 && valor){
              console.log("sobrepasa 500 y el trial es verdadero")
              console.log(`cantidad de comprobantes ${this.totalcompany} y su valor trial es ${this.getCompany.trial}`)
              this.validar_trial= true
            }else {
              console.log(`cantidad de comprobantes ${this.totalcompany} y su valor trial es ${this.getCompany.trial}`)
              this.validar_trial= false
            }
          })
        }else{
          return false
        }
      },*/      
      disabledetraccionComppute() {
        return this.disabledetraccion;
      },
      isDisabledNumberDoc() {

        let dis = false
        if (this.tipoComprobante == '03' && this.formulario.cliente_tipo_documento == '0') {
          dis = true
        }
        return dis
      },
      tipoComprobanteCuotaComputed(){
        return this.tipoComprobanteCuota
      },
      isHabilitado() {

        if (this.formulario.tipo_operacion == '04')
          return true

        if (this.formulario.tipo_operacion == '1001' && this.estado_anticipo == 0)
          return true

        return false
      },
      tiposBienDetraccion() {
        const listado = [];
        if (this.formulario.tipo_operacion == "1004") {
          this.getCatalogo54.forEach(v => {
            if (v.codigo == "027") {
              listado.push({
                value: v.codigo,
                text: v.descripcion
              })
            }

          })
        } else {
          this.getCatalogo54.forEach(v => {
            if (v.codigo != "027") {
              listado.push({
                value: v.codigo,
                text: v.descripcion
              })
            }

          })
        }

        return listado;
      },
      mediosDePago() {
        const listado = [];
        this.getCatalogo59.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      },
      cuentasPago() {
        const listado = [];
        this.getCuentas.forEach(v => {
          if (v.detraccion) {
            listado.push({
              value: v.id,
              text: v.number
            })
          }

        })
        return listado;
      },
      titleButtonAction() {
        return this.isEdit ? `Actualizar documento` : `Generar documento`
      },
      computeImporteTotal() {
        var respimporte = this.formulario.total_venta_gravadas_front + this.formulario.total_venta_inafectas + this.formulario.total_venta_exoneradas +
          this.formulario.total_venta_exportacion +     //this.formulario.total_venta_gratuitas
          +this.formulario.total_igv
        return respimporte
      },
      checkIncludeIgv() {
        var resp = 0
        if (this.checkDescuentoIgv) {
          resp = parseFloat(this.formulario.total_venta_gravadas_front - this.formulario.total_descuento) * parseFloat(this.getParametro("IGV").value)

        } else {
          resp = parseFloat(this.formulario.total_venta_gravadas_front) * parseFloat(this.getParametro("IGV").value)
        }
        return resp
      },
      preciosIncluidoIgv() {
        if (this.getCompany.preciosIncluidoIgv == null || this.getCompany.preciosIncluidoIgv == undefined) return true
        else return this.getCompany.preciosIncluidoIgv
      },
      existenSeries() {
        return this.seriesDisponibles.length > 0
      },
      isValidAnticipo() {
        this.$v.anticipo.$touch();
        return !this.$v.anticipo.$error;
      },
      tipoOperacion() {
        const listado = [];
        this.getCatalogo17.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
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
      tipoNotaCredito() {
        const listado = [];
        this.getCatalogo09.forEach(v => {
          listado.push({
            value: v.codigo,
            text: v.descripcion
          })
        })
        return listado;
      },
      tipoNotaDebito() {
        const listado = [];
        this.getCatalogo10.forEach(v => {
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
  .modal-content-two{
    overflow: hidden !important;
  }
</style>
<style scoped>
  .formproducto{
    max-height: 540px;
  }

  .media-left {
    margin-right: .5rem !important;
  }

  .float-letf {
    float: left;
  }
  .semaforored {
    color: #DB4437;
  }
  .semaforogreen {
    color: #00D1B2;
  }
  .semaforoplomo {
    color: #ffffff;
  }


</style>
