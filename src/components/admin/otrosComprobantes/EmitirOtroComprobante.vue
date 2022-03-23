<template>
  <div>
    <div v-if="getCompany.viewOtroComprobante">
    <div v-if="tipoComprobante == '20'">
      <form @submit.prevent="generarComprobante()">
        <div class="columns is-multiline">

          <div class="column pd-per is-2">
            <b-field label="Ruc:" :type="typeNumeroDoc" :message="messageNumeroDoc" >
              <b-autocomplete size="is-small"
                              v-model="$v.formularioRetencion.proveedor_numero_docum_identidad.$model"
                              :data="clientesAutocomplete"
                              :loading="isFetchingCliente"
                              :keep-first="true"
                              placeholder="Ingrese numero"
                              @input="buscarCliente"
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
            <b-field label="Denominación:" :type="toShowType($v.formularioRetencion.proveedor_denominacion)" :message="toShowMessage($v.formularioRetencion.proveedor_denominacion)">
              <b-field>
                <b-input size="is-small" v-model="$v.formularioRetencion.proveedor_denominacion.$model"></b-input>
              </b-field>
            </b-field>
          </div>
          <div class="column pd-per is-3">
            <b-field label="Dirección:" :type="toShowType($v.formularioRetencion.proveedor_domicilio_direccion)" :message="toShowMessage($v.formularioRetencion.proveedor_domicilio_direccion)">
              <b-input size="is-small" v-model="$v.formularioRetencion.proveedor_domicilio_direccion.$model"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-2">
            <b-field label="Correo:" :type="toShowType($v.formularioRetencion.proveedor_email)" :message="toShowMessage($v.formularioRetencion.proveedor_email)">
              <b-input size="is-small" v-model="$v.formularioRetencion.proveedor_email.$model"></b-input>
            </b-field>
          </div>


          <div class="column pd-per is-1" >
            <b-field v-if="!existenSeries" label="Serie:" :type="toShowType($v.formularioRetencion.documento_serie)" :message="toShowMessage($v.formularioRetencion.documento_serie)">
              <b-input :disabled="isEdit" size="is-small" v-model="$v.formularioRetencion.documento_serie.$model"></b-input>
            </b-field>
            <b-field v-if="existenSeries" label="Serie:" :type="toShowType($v.formularioRetencion.documento_serie)" :message="toShowMessage($v.formularioRetencion.documento_serie)">
              <b-select :disabled="isEdit" size="is-small" expanded v-model="$v.formularioRetencion.documento_serie.$model">
                <option v-for="(option, i) in seriesDisponibles" :value="option.value" :key="i">
                  {{ option.text}}
                </option>
              </b-select>
            </b-field>
          </div>

          <div class="column pd-per is-1">
            <b-field label="Número:" :type="toShowType($v.formularioRetencion.documento_numero)" :message="toShowMessage($v.formularioRetencion.documento_numero)">
              <b-input :disabled="isEdit" size="is-small" type="number" v-model="$v.formularioRetencion.documento_numero.$model"></b-input>
            </b-field>
          </div>

          <div class="column pd-per is-2">
            <b-field label="Fecha emisión:" :type="toShowType($v.documento_fecha_emision)" :message="toShowMessage($v.documento_fecha_emision)">
              <b-datepicker size="is-small" v-model="fecha_emision" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
              </b-datepicker>
            </b-field>
          </div>

          <div class="column pd-per is-2">
            <b-field label="Regimen:">
              <b-select size="is-small" expanded v-model="formularioRetencion.retencion_regimen">
                <option v-for="(option, i) in [{value: '01', text: 'Tasa 3%'}]" :value="option.value" :key="i">
                  {{ option.text }}
                </option>
              </b-select>
            </b-field>
          </div>

          <div class="column pd-per is-4">
            <b-field label="Observaciones:">

                <b-input  size="is-small"  v-model="$v.formularioRetencion.observaciones.$model"></b-input>

            </b-field>
          </div>

          <div class="column pd-per is-12">
            <b-message auto-close title="Error!" type="is-danger" has-icon :active.sync="errorDocumentosRelacionados" aria-close-label="Cerrar">
              Agregue documentos relacionados!
            </b-message>
          </div>

          <div class="column pd-per is-12">
            <b-field label="Documentos relacionados:">
              <div class="box" style="padding: 1rem;">

                <hr style="margin: 0.9rem 0;">

                <b-table
                  :data="$v.formularioRetencion.documentos_relacionados_retencion.$model"
                  :mobile-cards="true">

                  <template slot-scope="props">

                    <b-table-column  label="Documento"  class="is-size-7">
                      {{props.row.tipo_documento | nombreDocumento}} {{props.row.serie}}-{{props.row.numero}}
                    </b-table-column>


                    <b-table-column  label="Fecha emisión"  class="is-size-7">
                      {{formatDate(props.row.fecha_emision)}}
                    </b-table-column>

                    <b-table-column  label="Importe total"  class="is-size-7">
                      {{props.row.importe_total}}
                    </b-table-column>

                    <b-table-column  label="Número pago"  class="is-size-7">
                      {{props.row.numero_pago}}
                    </b-table-column>

                    <b-table-column  label="Pago sin retenciones"  class="is-size-7">
                      {{props.row.pago_sin_retencion}}
                    </b-table-column>

                    <b-table-column  label="Importe retenido"  class="is-size-7">
                      {{props.row.importe_retenido}}
                    </b-table-column>

                    <b-table-column  label="Fecha retención"  class="is-size-7">
                    {{formatDate(props.row.fecha_retencion)}}
                    </b-table-column>

                    <b-table-column  label="Importe pagado"  class="is-size-7">
                    {{props.row.importe_total_pagar}}
                    </b-table-column>

                    <b-table-column  label="Acciones"  class="is-size-7">
                      <span style="cursor: pointer" @click="borrarItem(props.row)">
                        <b-icon
                          icon="delete">
                      </b-icon>
                      </span>
                      <span style="cursor: pointer" @click="editarItem(props.row)">
                        <b-icon
                          icon="pencil">
                      </b-icon>
                      </span>
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
                        <p>Sin documentos relacionados.</p>
                      </div>
                    </section>
                  </template>
                </b-table>

                <a @click="showModalAddProducto()" class="button is-primary is-rounded is-small">Agregar documento</a>

              </div>
            </b-field>

          </div>

          <div class="column pd-per is-12">
            <hr style="margin: 0 0;">
          </div>

          <div class="column pd-per is-4">
            <div style="margin-top: 0.3rem; margin-left: 0.5rem" class="columns is-multiline">

              <div class="column pd-per-1 is-7">
                <p class="has-text-black is-size-7">Imp. total retenido</p>
              </div>
              <div class="column pd-per-1 is-5">
                <b-field>
                  <b-input size="is-small" :value="showWith2Decimal($v.formularioRetencion.importe_total_retenido.$model)" disabled></b-input>
                </b-field>
              </div>
              <div class="column pd-per-1 is-7">
                <p class="has-text-black is-size-7">Imp. total pagado</p>
              </div>
              <div class="column pd-per-1 is-5">
                <b-field>
                  <b-input size="is-small" :value="showWith2Decimal($v.formularioRetencion.importe_total_pagado.$model)" disabled></b-input>
                </b-field>
              </div>

            </div>
          </div>
          <div class="column pd-per is-12 has-text-centered">
            <button type="submit" class="button is-success is-rounded is-large">{{titleButtonAction}}</button>
          </div>
        </div>
      </form>
    </div>

    <div v-if="tipoComprobante == '40'">
      <form @submit.prevent="generarComprobante()">
        <div class="columns is-multiline">

          <div class="column pd-per is-2">
            <b-field label="Ruc:" :type="typeNumeroDoc" :message="messageNumeroDoc" >
              <b-autocomplete size="is-small"
                              v-model="$v.formularioPercepcion.cliente_numero_docum_identidad.$model"
                              :data="clientesAutocomplete"
                              :loading="isFetchingCliente"
                              :keep-first="true"
                              placeholder="Ingrese numero"
                              @input="buscarCliente"
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
            <b-field label="Denominación:" :type="toShowType($v.formularioPercepcion.cliente_denominacion)" :message="toShowMessage($v.formularioPercepcion.cliente_denominacion)">
              <b-field>
                <b-input size="is-small" v-model="$v.formularioPercepcion.cliente_denominacion.$model"></b-input>
              </b-field>
            </b-field>
          </div>
          <div class="column pd-per is-3">
            <b-field label="Dirección:" :type="toShowType($v.formularioPercepcion.cliente_domicilio_direccion)" :message="toShowMessage($v.formularioPercepcion.cliente_domicilio_direccion)">
              <b-input size="is-small" v-model="$v.formularioPercepcion.cliente_domicilio_direccion.$model"></b-input>
            </b-field>
          </div>
          <div class="column pd-per is-2">
            <b-field label="Correo:" :type="toShowType($v.formularioPercepcion.cliente_email)" :message="toShowMessage($v.formularioPercepcion.cliente_email)">
              <b-input size="is-small" v-model="$v.formularioPercepcion.cliente_email.$model"></b-input>
            </b-field>
          </div>


          <div class="column pd-per is-1" >
            <b-field v-if="!existenSeries" label="Serie:" :type="toShowType($v.formularioPercepcion.documento_serie)" :message="toShowMessage($v.formularioPercepcion.documento_serie)">
              <b-input :disabled="isEdit" size="is-small" v-model="$v.formularioPercepcion.documento_serie.$model"></b-input>
            </b-field>
            <b-field v-if="existenSeries" label="Serie:" :type="toShowType($v.formularioPercepcion.documento_serie)" :message="toShowMessage($v.formularioPercepcion.documento_serie)">
              <b-select :disabled="isEdit" size="is-small" expanded v-model="$v.formularioPercepcion.documento_serie.$model">
                <option v-for="(option, i) in seriesDisponibles" :value="option.value" :key="i">
                  {{ option.text}}
                </option>
              </b-select>
            </b-field>
          </div>

          <div class="column pd-per is-1">
            <b-field label="Número:" :type="toShowType($v.formularioPercepcion.documento_numero)" :message="toShowMessage($v.formularioPercepcion.documento_numero)">
              <b-input :disabled="isEdit" size="is-small" type="number" v-model="$v.formularioPercepcion.documento_numero.$model"></b-input>
            </b-field>
          </div>

          <div class="column pd-per is-2">
            <b-field label="Fecha emisión:" :type="toShowType($v.documento_fecha_emision)" :message="toShowMessage($v.documento_fecha_emision)">
              <b-datepicker size="is-small" v-model="fecha_emision" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
              </b-datepicker>
            </b-field>
          </div>

          <div class="column pd-per is-2">
            <b-field label="Regimen:">
              <b-select size="is-small" expanded v-model="formularioPercepcion.percepcion_regimen">
                <option v-for="(option, i) in [{value: '01', text: 'Tasa 2%'}]" :value="option.value" :key="i">
                  {{ option.text }}
                </option>
              </b-select>
            </b-field>
          </div>

          <div class="column pd-per is-4">
            <b-field label="Observaciones:">

                <b-input  size="is-small"  v-model="$v.formularioPercepcion.observaciones.$model"></b-input>

            </b-field>
          </div>

          <div class="column pd-per is-12">
            <b-message auto-close title="Error!" type="is-danger" has-icon :active.sync="errorDocumentosRelacionados" aria-close-label="Cerrar">
              Agregue documentos relacionados!
            </b-message>
          </div>

          <div class="column pd-per is-12">
            <b-field label="Documentos relacionados:">
              <div class="box" style="padding: 1rem;">

                <hr style="margin: 0.9rem 0;">

                <b-table
                  :data="$v.formularioPercepcion.documentos_relacionados_percepcion.$model"
                  :mobile-cards="true">

                  <template slot-scope="props">

                    <b-table-column  label="Documento"  class="is-size-7">
                      {{props.row.tipo_documento | nombreDocumento}} {{props.row.serie}}-{{props.row.numero}}
                    </b-table-column>


                    <b-table-column  label="Fecha emisión"  class="is-size-7">
                      {{formatDate(props.row.fecha_emision)}}
                    </b-table-column>

                    <b-table-column  label="Importe total"  class="is-size-7">
                      {{props.row.importe_total}}
                    </b-table-column>

                    <b-table-column  label="Número cobro"  class="is-size-7">
                      {{props.row.numero_cobro}}
                    </b-table-column>

                    <b-table-column  label="Importe del cobro"  class="is-size-7">
                      {{props.row.importe_cobro}}
                    </b-table-column>

                    <b-table-column  label="Importe percibido"  class="is-size-7">
                      {{props.row.importe_percibido}}
                    </b-table-column>

                    <b-table-column  label="Fecha retención"  class="is-size-7">
                    {{formatDate(props.row.fecha_percepcion)}}
                    </b-table-column>

                    <b-table-column  label="Importe cobrado"  class="is-size-7">
                    {{props.row.importe_total_cobrar}}
                    </b-table-column>

                    <b-table-column  label="Acciones"  class="is-size-7">
                      <span style="cursor: pointer" @click="borrarItem(props.row)">
                        <b-icon
                          icon="delete">
                      </b-icon>
                      </span>
                      <span style="cursor: pointer" @click="editarItem(props.row)">
                        <b-icon
                          icon="pencil">
                      </b-icon>
                      </span>
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
                        <p>Sin documentos relacionados.</p>
                      </div>
                    </section>
                  </template>
                </b-table>

                <a @click="showModalAddProducto()" class="button is-primary is-rounded is-small">Agregar documento</a>

              </div>
            </b-field>

          </div>

          <div class="column pd-per is-12">
            <hr style="margin: 0 0;">
          </div>

          <div class="column pd-per is-4">
            <div style="margin-top: 0.3rem; margin-left: 0.5rem" class="columns is-multiline">

              <div class="column pd-per-1 is-7">
                <p class="has-text-black is-size-7">Imp. total percibido</p>
              </div>
              <div class="column pd-per-1 is-5">
                <b-field>
                  <b-input size="is-small" :value="showWith2Decimal($v.formularioPercepcion.importe_total_percibido.$model)" disabled></b-input>
                </b-field>
              </div>
              <div class="column pd-per-1 is-7">
                <p class="has-text-black is-size-7">Imp. total cobrado</p>
              </div>
              <div class="column pd-per-1 is-5">
                <b-field>
                  <b-input size="is-small" :value="showWith2Decimal($v.formularioPercepcion.importe_total_cobrado.$model)" disabled></b-input>
                </b-field>
              </div>

            </div>
          </div>
          <div class="column pd-per is-12 has-text-centered">
            <button type="submit" class="button is-success is-rounded is-large">{{titleButtonAction}}</button>
          </div>
        </div>
      </form>
    </div>



    <b-modal :active.sync="isCardModalProductoRetencion" :width="900" >
      <div class="card">
        <header class="modal-card-head">
          <p class="modal-card-title">Agregar documento</p>
        </header>
        <section class="modal-card-body " >

         <div>
           <div class="columns is-multiline">
             <div class="column is-3">
               <b-field label="Tipo de Documento:">
                 <b-select size="is-small" expanded v-model="documentoRelacionadoRetencion.tipo_documento">
                   <option v-for="(option, i) in tiposComprobantes" :value="option.value" :key="i">
                     {{ option.text }}
                   </option>
                 </b-select>
               </b-field>
             </div>
             <div class="column is-3">
               <b-field label="Serie:">
                 <b-input size="is-small" v-model="documentoRelacionadoRetencion.serie"></b-input>
               </b-field>
             </div>
             <div class="column is-3">
               <b-field label="Numero:">
                 <b-input size="is-small" v-model="documentoRelacionadoRetencion.numero"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Fecha emisión:">
                 <b-datepicker size="is-small" v-model="documentoRelacionadoRetencion.fecha_emision" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                 </b-datepicker>
               </b-field>
             </div>

             <div class="column is-3">
                <b-field label="Moneda:">
                  <b-select size="is-small" expanded v-model="documentoRelacionadoRetencion.moneda">
                    <option v-for="(option, i) in tiposMonedas" :value="option.value" :key="i">
                      {{ option.text}}
                    </option>
                  </b-select>
                </b-field>
              </div>

             <div class="column is-3">
               <b-field label="Importe total:">
                 <b-input size="is-small" v-model="documentoRelacionadoRetencion.importe_total"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Fecha de pago:">
                 <b-datepicker size="is-small" v-model="documentoRelacionadoRetencion.fecha_pago" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                 </b-datepicker>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Número pago:">
                 <b-input size="is-small" v-model="documentoRelacionadoRetencion.numero_pago"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Pago sin retención:">
                 <b-input size="is-small" v-model="documentoRelacionadoRetencion.pago_sin_retencion"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Importe retenido:">
                 <b-input disabled size="is-small" v-model="documentoRelacionadoRetencion.importe_retenido"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Fecha retención:">
                 <b-datepicker size="is-small" v-model="documentoRelacionadoRetencion.fecha_retencion" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                 </b-datepicker>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Importe pagado:">
                 <b-input disabled  size="is-small" v-model="documentoRelacionadoRetencion.importe_total_pagar"></b-input>
               </b-field>
             </div>

           </div>
         </div>


        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="isCardModalProductoRetencion = !isCardModalProductoRetencion">{{strSalir}}</button>
          <button :disabled="!isValidAddDr" class="button is-primary" @click="addProducto()">{{strsave}}</button>
          <span >{{validateform}}</span>
        </footer>
      </div>
    </b-modal>




    <b-modal :active.sync="isCardModalProductoPercepcion" :width="900" >
      <div class="card">
        <header class="modal-card-head">
          <p class="modal-card-title">Agregar documento</p>
        </header>
        <section class="modal-card-body " >

         <div>
           <div class="columns is-multiline">
             <div class="column is-3">
               <b-field label="Tipo de Documento:">
                 <b-select size="is-small" expanded v-model="documentoRelacionadoPercepcion.tipo_documento">
                   <option v-for="(option, i) in tiposComprobantes" :value="option.value" :key="i">
                     {{ option.text }}
                   </option>
                 </b-select>
               </b-field>
             </div>
             <div class="column is-3">
               <b-field label="Serie:">
                 <b-input size="is-small" v-model="documentoRelacionadoPercepcion.serie"></b-input>
               </b-field>
             </div>
             <div class="column is-3">
               <b-field label="Numero:">
                 <b-input size="is-small" v-model="documentoRelacionadoPercepcion.numero"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Fecha emisión:">
                 <b-datepicker size="is-small" v-model="documentoRelacionadoPercepcion.fecha_emision" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                 </b-datepicker>
               </b-field>
             </div>

             <div class="column is-3">
                <b-field label="Moneda:">
                  <b-select size="is-small" expanded v-model="documentoRelacionadoPercepcion.moneda">
                    <option v-for="(option, i) in tiposMonedas" :value="option.value" :key="i">
                      {{ option.text}}
                    </option>
                  </b-select>
                </b-field>
              </div>

             <div class="column is-3">
               <b-field label="Importe total:">
                 <b-input size="is-small" v-model="documentoRelacionadoPercepcion.importe_total"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Fecha de cobro:">
                 <b-datepicker size="is-small" v-model="documentoRelacionadoPercepcion.fecha_cobro" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                 </b-datepicker>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Número cobro:">
                 <b-input size="is-small" v-model="documentoRelacionadoPercepcion.numero_cobro"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Pago sin percepción:">
                 <b-input size="is-small" v-model="documentoRelacionadoPercepcion.importe_cobro"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Importe percibido:">
                 <b-input disabled size="is-small" v-model="documentoRelacionadoPercepcion.importe_percibido"></b-input>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Fecha percepción:">
                 <b-datepicker size="is-small" v-model="documentoRelacionadoPercepcion.fecha_percepcion" :date-formatter="formatDate" placeholder="Click para seleccionar fecha" icon="calendar-today">
                 </b-datepicker>
               </b-field>
             </div>

             <div class="column is-3">
               <b-field label="Importe cobrado:">
                 <b-input disabled  size="is-small" v-model="documentoRelacionadoPercepcion.importe_total_cobrar"></b-input>
               </b-field>
             </div>

           </div>
         </div>


        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="isCardModalProductoPercepcion = !isCardModalProductoPercepcion">{{strSalir}}</button>
          <button :disabled="!isValidAddDr" class="button is-primary" @click="addProducto()">{{strsave}}</button>
          <span >{{validateform}}</span>
        </footer>
      </div>
    </b-modal>
    </div>
    <div v-else>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Rentenciones - Percepciones CERTIFAKT
          </p>
          <span class="icon">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </header>
        <div class="card-content">
          <div class="content">
            El servicio de Retenciones y Percepciones para este usuario no se encuentra habilitado.
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
  import Util from "../../../util";

  const monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Setiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];
  import Methods from '../../../api/methods'
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
  } from 'vuex'
  import qs from "qs"
  import validationsMixin from '../../../validations/index'
  import dateformat from 'dateformat'
  import axios from 'axios'

  import BFieldBody from "buefy/src/components/field/FieldBody";

  export default {
    mixins: [validationsMixin],
    props: [
      'tipoComprobante',
      'id',
      'isEdit',
      'idEdit'
    ],
    components: {
      BFieldBody
    },
    data() {
      return {

        checkDescuentoIgv:true,
        strSalir:'Salir',
        strcancel:'Cancelar',
        validateform:'',
        strsave:'Guardar',
        tipoboleta:false,
        product:'Producto',
        estPorcentaje:false,
        celdadelete:[],
        valorTipoCambio: null,
        idindice:0,
        fileinput:null,
        filename:'',
        vuelines:[],
        itemcsv:[],
        estado_anticipo:0,
        fecha_emision: new Date(),
        seriesDisponibles: [],
        formularioRetencion: {
          proveedor_tipo_docum_identidad: '6',
          proveedor_numero_docum_identidad: null,
          proveedor_denominacion: null,
          proveedor_domicilio_direccion: null,
          proveedor_email: '',
          documento_serie: null,
          documento_numero: null,
          documento_fecha_emision: null,
          codigo_moneda: 'PEN',
          importe_total_retenido: 0,
          importe_total_pagado: 0,
          retencion_regimen: '01',
          observaciones: '',
          documentos_relacionados_retencion: []

        },
        formularioPercepcion: {
          cliente_tipo_docum_identidad: '6',
          cliente_numero_docum_identidad: null,
          cliente_denominacion: null,
          cliente_domicilio_direccion: null,
          cliente_email: '',
          documento_serie: null,
          documento_numero: null,
          documento_fecha_emision: null,
          codigo_moneda: 'PEN',
          importe_total_percibido: 0,
          importe_total_cobrado: 0,
          percepcion_regimen: '01',
          observaciones: '',
          documentos_relacionados_percepcion: []
        },
        isCardModalProductoRetencion:false,
        isCardModalProductoPercepcion:false,
        isCardModalEditarProducto:false,
        tiposMonedas: [{
          value: 'PEN',
          text: 'PEN'
        },
        {
          value: 'USD',
          text: 'USD'
        }
        ],

        clienteDatosAdicionales: {},

        clientesAutocomplete:[],
        isFetchingCliente: false,
        typeNumeroDoc: null,
        messageNumeroDoc: null,


        documentoRelacionadoRetencion:  {
          tipo_documento: "01",
          serie: null,
          numero: null,
          fecha_emision: new Date(),
          moneda: 'PEN',
          importe_total: 0.00,
          fecha_pago: new Date(),
          numero_pago: "1",
          pago_sin_retencion: 0.00,
          moneda_pago: null,
          importe_retenido: 0.00,
          fecha_retencion: new Date(),
          importe_total_pagar: 0.00,
          fecha_cambio: new Date()
        },
        documentoRelacionadoPercepcion:  {
          tipo_documento: "01",
          serie: null,
          numero: null,
          fecha_emision: new Date(),
          moneda: 'PEN',
          importe_total: 0.00,
          fecha_cobro: new Date(),
          numero_cobro: "1",
          importe_cobro: 0.00,
          moneda_cobro: null,
          importe_percibido: 0.00,
          fecha_percepcion: new Date(),
          importe_total_cobrar: 0.00,
          fecha_cambio: new Date()
        },

        iEdit: null,

        errorDocumentosRelacionados: false

      }
    },
    validations() {
      const result = {
        formularioRetencion: {
          proveedor_numero_docum_identidad: {
          required
          },
          proveedor_denominacion: {
            required
          },
          proveedor_domicilio_direccion: {
            required
          },
          proveedor_email: {
            email
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

          importe_total_retenido: {
            decimal
          },
          importe_total_pagado: {
            decimal
          },
          retencion_regimen: {
            required
          },
          observaciones: {},
          documentos_relacionados_retencion: {

              $each: {
              tipo_documento:{
                required
              },
              serie:{
                required
              },
              numero: {
                required
              },
              fecha_emision: {
                required,
              },
              importe_total: {
                required
              },
              fecha_pago: {
                required
              },
              numero_pago: {
                required
              },
              pago_sin_retencion: {
                required,
                decimal
              },
              importe_retenido: {
                required,
                decimal
              },
              fecha_retencion: {
                required
              },
              importe_total_pagar: {
                required,
                decimal
              }
            }
          },
        },
        formularioPercepcion: {
          cliente_numero_docum_identidad: {
          required
          },
          cliente_denominacion: {
            required
          },
          cliente_domicilio_direccion: {
            required
          },
          cliente_email: {
            email
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

          importe_total_percibido: {
            decimal
          },
          importe_total_cobrado: {
            decimal
          },
          percepcion_regimen: {
            required
          },
          observaciones: {},
          documentos_relacionados_percepcion: {

              $each: {
              tipo_documento:{
                required
              },
              serie:{
                required
              },
              numero: {
                required
              },
              fecha_emision: {
                required,
              },
              importe_total: {
                required
              },
              fecha_cobro: {
                required
              },
              numero_cobro: {
                required
              },
              importe_cobro: {
                required,
                decimal
              },
              importe_percibido: {
                required,
                decimal
              },
              fecha_percepcion: {
                required
              },
              importe_total_cobrar: {
                required,
                decimal
              }
            }
          },
        },

        fecha_emision: {
          required
        }
      }

      return result;
    },
    watch: {
      'formularioRetencion.proveedor_tipo_docum_identidad': 'watchNumeroDoc',
      'formularioRetencion.proveedor_numero_docum_identidad': 'watchNumeroDoc',
      'formularioRetencion.documento_serie': 'obtenerSiguienteNumero',
      '$route.params.id': 'getDataFromOtherVoucher',
      'formularioPercepcion.cliente_tipo_docum_identidad': 'watchNumeroDoc',
      'formularioPercepcion.cliente_numero_docum_identidad': 'watchNumeroDoc',
      'formularioPercepcion.documento_serie': 'obtenerSiguienteNumero',
      'formularioRetencion.documentos_relacionados_retencion': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      'formularioPercepcion.documentos_relacionados_percepcion': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      'documentoRelacionadoRetencion': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      'documentoRelacionadoPercepcion': {
        handler: function () {
          this.calculoTotal();
        },
        deep: true
      },
      'isCardModalProductoRetencion':  {
        handler: function () {
            if (!this.isCardModalProductoRetencion) {
              this.resetDocumentoRelacionado()
            };
        },
        deep: true
      },
      'isCardModalProductoPercepcion':  {
        handler: function () {
            if (!this.isCardModalProductoPercepcion) {
              this.resetDocumentoRelacionado()
            };
        },
        deep: true
      },
      'formularioRetencion.documento_serie': 'obtenerSiguienteNumero',
      'formularioPercepcion.documento_serie': 'obtenerSiguienteNumero',
    },
    beforeMount(){
      if(this.tipoComprobante == '20'){
        this.formularioRetencion.documento_fecha_emision = new Date();
      }else if(this.tipoComprobante == '40'){
        this.formularioPercepcion.documento_fecha_emision = new Date();
      }
      
    },
    mounted() {

          if (this.getPuntoVenta) {
            console.log(this.getPuntoVenta)
            this.seriesDisponibles = []
            this.getPuntoVenta.series.forEach((ser, i) => {
              if (ser.tipoDocumento == this.tipoComprobante){
                this.seriesDisponibles.push({
                  value: ser.serie,
                  text: ser.serie
                })
              }
            })
            if (this.seriesDisponibles[0]){
              if(this.tipoComprobante == '20'){
                this.formularioRetencion.documento_serie = this.seriesDisponibles[0].value
              }else if(this.tipoComprobante == '40'){
                this.formularioPercepcion.documento_serie = this.seriesDisponibles[0].value
              }
            }  
          }

          this.tipoCambioActual();
          this.getDataFromOtherVoucher();
        
    },
    methods: {

      watchObservaciones(){
        if(this.tipoComprobante == '20'){
          const text = this.formularioRetencion.observaciones.replace(">","").replace("<","");
          this.formularioRetencion.observaciones = text;
        }else if(this.tipoComprobante == '40'){
          const text = this.formularioPercepcion.observaciones.replace(">","").replace("<","");
          this.formularioPercepcion.observaciones = text;
        }
        
      },

      formatDate(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return `${day} de ${monthNames[monthIndex]} de ${year}`
      },

      getDataFromOtherVoucher() {
        console.log("Entro a editar el comprobante")
        const idFind = this.isEdit ? this.idEdit : this.id
         console.log("idFind: "+idFind);
        if (idFind) {
          const params = qs.stringify({
            id: idFind
          })
          const url = `api/otherVoucherById?${params}`
          Methods.doGet(this, url).then(data => {
            console.log(data)
            var docs = [];


            data.details.forEach(dr => {

              if(this.tipoComprobante == '40'){

                var doc = {
                  tipo_documento: dr.tipoDocumentoRelacionado,
                  serie: dr.serieDocumentoRelacionado,
                  numero: dr.numeroDocumentoRelacionado,
                  fecha_emision: new Date(dr.fechaEmisionDocumentoRelacionado),
                  importe_total: dr.importeTotalDocumentoRelacionado,
                  fecha_cobro: new Date(dr.fechaPagoCobro),
                  numero_cobro: dr.numeroPagoCobro,
                  importe_cobro: dr.importePagoSinRetencionCobro,
                  moneda : dr.monedaPagoCobro,
                  moneda_importe_percibido : this.formularioPercepcion.codigo_moneda,
                  moneda_importe_total_pagar : this.formularioPercepcion.codigo_moneda,
                  moneda_cobro: dr.monedaPagoCobro,
                  importe_percibido: dr.importeRetenidoPercibido,
                  fecha_percepcion: new Date(dr.fechaRetencionPercepcion),
                  importe_total_cobrar: dr.importeTotalToPagarCobrar,
                  moneda_objetivo_tasa_cambio: dr.monedaObjetivoTasaCambio,
                  moneda_referencia_tipo_cambio: dr.monedaReferenciaTipoCambio
                };

              }else if(this.tipoComprobante == '20'){
                 var doc = {
                  tipo_documento: dr.tipoDocumentoRelacionado,
                  serie: dr.serieDocumentoRelacionado,
                  numero: dr.numeroDocumentoRelacionado,
                  fecha_emision: new Date(dr.fechaEmisionDocumentoRelacionado),
                  importe_total: dr.importeTotalDocumentoRelacionado,
                  fecha_pago: new Date(dr.fechaPagoCobro),
                  numero_pago: dr.numeroPagoCobro,
                  pago_sin_retencion: dr.importePagoSinRetencionCobro,
                  moneda : dr.monedaPagoCobro,
                  moneda_importe_retenido : this.formularioRetencion.codigo_moneda,
                  moneda_importe_total_pagar : this.formularioRetencion.codigo_moneda,
                  moneda_pago: dr.monedaPagoCobro,
                  importe_retenido: dr.importeRetenidoPercibido,
                  fecha_retencion: new Date(dr.fechaRetencionPercepcion),
                  importe_total_pagar: dr.importeTotalToPagarCobrar,
                  moneda_objetivo_tasa_cambio: dr.monedaObjetivoTasaCambio,
                  moneda_referencia_tipo_cambio: dr.monedaReferenciaTipoCambio
                };
              }
              

              docs.push(doc);
            });


            if (this.isEdit) {

              this.fecha_emision = new Date(data.fechaEmisionDate)

              if(this.tipoComprobante == '40'){
                this.formularioPercepcion = {
                  cliente_tipo_docum_identidad: data.tipoDocumentoIdentidadReceptor,
                  cliente_numero_docum_identidad: data.numeroDocumentoIdentidadReceptor,
                  cliente_denominacion: data.denominacionReceptor,
                  cliente_domicilio_direccion: data.direccionCompletaDomicilioFiscalReceptor,
                  cliente_email: data.emailReceptor,
                  documento_serie : data.serie,
                  documento_numero: data.numero,
                  documento_fecha_emision: data.fechaEmision,
                  codigo_moneda: data.codigoMoneda,
                  //importe_total_percibido: data.importeTotalRetenidoPercibido,
                  //importe_total_cobrado: data.importeTotalPagadoCobrado,
                  percepcion_regimen: data.regimen,
                  documentos_relacionados_percepcion: docs,
                  observaciones: data.observaciones
                }
              }else if(this.tipoComprobante == '20'){
                this.formularioRetencion = {
                  proveedor_tipo_docum_identidad: data.tipoDocumentoIdentidadReceptor,
                  proveedor_numero_docum_identidad: data.numeroDocumentoIdentidadReceptor,
                  proveedor_denominacion: data.denominacionReceptor,
                  proveedor_domicilio_direccion: data.direccionCompletaDomicilioFiscalReceptor,
                  proveedor_email: data.emailReceptor,
                  documento_serie : data.serie,
                  documento_numero: data.numero,
                  documento_fecha_emision: data.fechaEmision,
                  codigo_moneda: data.codigoMoneda,
                  //importe_total_retenido: data.importeTotalRetenidoPercibido,
                  //importe_total_pagado: data.importeTotalPagadoCobrado,
                  retencion_regimen: data.regimen,
                  documentos_relacionados_retencion: docs,
                  observaciones: data.observaciones
                }
              }
              

              
            }
            console.log("Formuario percepcion")
            console.log(this.formularioPercepcion);

          })
        }
      },

      resetDocumentoRelacionado(){

        if(this.tipoComprobante == '20'){
            this.documentoRelacionadoRetencion = {
            tipo_documento: "01",
            serie: null,
            numero: null,
            fecha_emision: new Date(),
            moneda: 'PEN',
            importe_total: 0.00,
            fecha_pago: new Date(),
            numero_pago: "1",
            pago_sin_retencion: 0.00,
            moneda_pago: this.formularioRetencion.codigo_moneda,
            importe_retenido: 0.00,
            fecha_retencion: new Date(),
            importe_total_pagar: 0.00
          }
        }else if(this.tipoComprobante == '40'){
            this.documentoRelacionadoPercepcion = {
            tipo_documento: "01",
            serie: null,
            numero: null,
            fecha_emision: new Date(),
            moneda: 'PEN',
            importe_total: 0.00,
            fecha_cobro: new Date(),
            numero_cobro: "1",
            importe_cobro: 0.00,
            moneda_cobro: this.formularioPercepcion.codigo_moneda,
            importe_percibido: 0.00,
            fecha_percepcion: new Date(),
            importe_total_cobrar: 0.00
          }
        }

        
      },

      borrarItem(item){
        if(this.tipoComprobante == '20'){
          const i = this.formularioRetencion.documentos_relacionados_retencion.findIndex(it => it == item);
          this.formularioRetencion.documentos_relacionados_retencion.splice(i, 1);
          console.log('borrando', item, i);
        }else if(this.tipoComprobante == '40'){
          const i = this.formularioPercepcion.documentos_relacionados_percepcion.findIndex(it => it == item);
          this.formularioPercepcion.documentos_relacionados_percepcion.splice(i, 1);
          console.log('borrando', item, i);
        }
        
      },

      editarItem(item){
        if(this.tipoComprobante == '20'){
          const iEdit = this.formularioRetencion.documentos_relacionados_retencion.findIndex(it => it == item);
          console.log(iEdit)
          this.iEdit = iEdit;
          Object.assign(this.documentoRelacionadoRetencion, item);
          this.isCardModalProductoRetencion = true;
        }else if(this.tipoComprobante == '40'){
          const iEdit = this.formularioPercepcion.documentos_relacionados_percepcion.findIndex(it => it == item);
          console.log(iEdit)
          this.iEdit = iEdit;
          Object.assign(this.documentoRelacionadoPercepcion, item);
          this.isCardModalProductoPercepcion = true;
        }
        
      },

      save(index){
        console.log(index)
        if(this.tipoComprobante == '20'){
          this.$v.formularioRetencion.documentos_relacionados_retencion.$touch()
        }else if(this.tipoComprobante == '40'){
          this.$v.formularioPercepcion.documentos_relacionados_percepcion.$touch()
        }
        

      },
      validar(){
        var resp = 0

      },

      showModalAddProducto() {
        if(this.tipoComprobante == '20'){
          this.isCardModalProductoRetencion = true;
        }else if(this.tipoComprobante == '40'){
          this.isCardModalProductoPercepcion = true;
        }
        
      },

      addProducto() {

        if(this.tipoComprobante == '20'){
          let dr = {};
          Object.assign(dr, this.documentoRelacionadoRetencion);
          dr.moneda_pago = this.documentoRelacionadoRetencion.moneda,
          dr.moneda_importe_retenido = this.formularioRetencion.codigo_moneda;
          dr.moneda_importe_total_pagar = this.formularioRetencion.codigo_moneda;
          dr.moneda_referencia_tipo_cambio = this.documentoRelacionadoRetencion.moneda;
          dr.moneda_objetivo_tasa_cambio = "PEN";

          if(this.documentoRelacionadoRetencion.moneda == 'PEN'){
            dr.tipo_cambio = 1.00
          }else if(this.documentoRelacionadoRetencion.moneda == 'USD'){
            dr.tipo_cambio = this.valorTipoCambio
          }
          
          if(this.iEdit !== undefined && this.iEdit !== null) {
            console.log('actualizando');
            this.formularioRetencion.documentos_relacionados_retencion[this.iEdit] = dr;
            this.iEdit = null;
          } else {
            console.log('Pusheando');
            this.formularioRetencion.documentos_relacionados_retencion.push(dr);
          }

          this.resetDocumentoRelacionado();
          this.isCardModalProductoRetencion = false;
        }else if(this.tipoComprobante == '40'){
          let dr = {};
          Object.assign(dr, this.documentoRelacionadoPercepcion);
          dr.moneda_cobro = this.documentoRelacionadoPercepcion.moneda,
          dr.moneda_importe_percibido = this.formularioPercepcion.codigo_moneda;
          dr.moneda_importe_total_cobrar = this.formularioPercepcion.codigo_moneda;
          dr.moneda_referencia_tipo_cambio = this.documentoRelacionadoPercepcion.moneda;
          dr.moneda_objetivo_tasa_cambio = "PEN";

          if(this.documentoRelacionadoPercepcion.moneda == 'PEN'){
            dr.tipo_cambio = 1.00
          }else if(this.documentoRelacionadoPercepcion.moneda == 'USD'){
            dr.tipo_cambio = this.valorTipoCambio
          }

          if(this.iEdit !== undefined && this.iEdit !== null) {
            console.log('actualizando');
            this.formularioPercepcion.documentos_relacionados_percepcion[this.iEdit] = dr;
            this.iEdit = null;
          } else {
            console.log('Pusheando');
            this.formularioPercepcion.documentos_relacionados_percepcion.push(dr);
          }

          this.resetDocumentoRelacionado();
          this.isCardModalProductoPercepcion = false;
        }
      },

      tipoCambioActual(){
        axios.get('https://deperu.com/api/rest/cotizaciondolar.json').then(response => this.valorTipoCambio = response.data.Cotizacion[0].Compra)
      },


      calculoTotal(){

        if(this.tipoComprobante == '20'){
          this.formularioRetencion.importe_total_retenido = 0;
          this.formularioRetencion.importe_total_pagado = 0;


          if(this.documentoRelacionadoRetencion.moneda == 'PEN'){
            this.documentoRelacionadoRetencion.importe_retenido = (parseFloat(this.documentoRelacionadoRetencion.pago_sin_retencion) * 0.03).toFixed(2)
            this.documentoRelacionadoRetencion.importe_total_pagar = parseFloat(this.documentoRelacionadoRetencion.pago_sin_retencion) - parseFloat(this.documentoRelacionadoRetencion.importe_retenido)
          }else if(this.documentoRelacionadoRetencion.moneda == 'USD'){
            this.documentoRelacionadoRetencion.importe_retenido = (parseFloat(this.documentoRelacionadoRetencion.pago_sin_retencion) * this.valorTipoCambio * 0.03).toFixed(2)
            this.documentoRelacionadoRetencion.importe_total_pagar = (parseFloat(this.documentoRelacionadoRetencion.pago_sin_retencion) * this.valorTipoCambio ) - parseFloat(this.documentoRelacionadoRetencion.importe_retenido)
          }
          
          this.formularioRetencion.documentos_relacionados_retencion.forEach(dr => {
            dr.numero = parseInt(dr.numero);

            if(dr.moneda == 'PEN'){
              dr.importe_retenido = parseFloat(dr.pago_sin_retencion)* 0.03;
            }else if(dr.moneda == 'USD'){
              dr.importe_retenido = parseFloat(dr.pago_sin_retencion) * this.valorTipoCambio * 0.03;
            }
            dr.importe_total = parseFloat(dr.importe_total);
            dr.importe_total_pagar = parseFloat(dr.importe_total_pagar);
            dr.pago_sin_retencion = parseFloat(dr.pago_sin_retencion);
            this.formularioRetencion.importe_total_retenido = parseFloat(this.formularioRetencion.importe_total_retenido) + parseFloat(dr.importe_retenido);
            this.formularioRetencion.importe_total_pagado = parseFloat(this.formularioRetencion.importe_total_pagado) + parseFloat(dr.importe_total_pagar);
          });


        }else if(this.tipoComprobante == '40'){
          this.formularioPercepcion.importe_total_percibido = 0;
          this.formularioPercepcion.importe_total_cobrado = 0;

          if(this.documentoRelacionadoPercepcion.moneda == 'PEN'){
            this.documentoRelacionadoPercepcion.importe_percibido = (parseFloat(this.documentoRelacionadoPercepcion.importe_cobro) * 0.02).toFixed(2)
          this.documentoRelacionadoPercepcion.importe_total_cobrar = parseFloat(this.documentoRelacionadoPercepcion.importe_cobro) + parseFloat(this.documentoRelacionadoPercepcion.importe_percibido)
          }else if(this.documentoRelacionadoPercepcion.moneda == 'USD'){
            this.documentoRelacionadoPercepcion.importe_percibido = (parseFloat(this.documentoRelacionadoPercepcion.importe_cobro) * this.valorTipoCambio * 0.02).toFixed(2)
          this.documentoRelacionadoPercepcion.importe_total_cobrar = (parseFloat(this.documentoRelacionadoPercepcion.importe_cobro) * this.valorTipoCambio ) + parseFloat(this.documentoRelacionadoPercepcion.importe_percibido)
          }

          
          
          this.formularioPercepcion.documentos_relacionados_percepcion.forEach(dr => {
            dr.numero = parseInt(dr.numero);
            if(dr.moneda == 'PEN'){
              dr.importe_percibido = parseFloat(dr.importe_cobro)* 0.02;
            }else if(dr.moneda == 'USD'){
              dr.importe_percibido = parseFloat(dr.importe_cobro)* this.valorTipoCambio * 0.02;
            }
            
            dr.importe_total = parseFloat(dr.importe_total);
            dr.importe_total_cobrar = parseFloat(dr.importe_total_cobrar);
            dr.importe_cobro = parseFloat(dr.importe_cobro);
            this.formularioPercepcion.importe_total_percibido = parseFloat(this.formularioPercepcion.importe_total_percibido) + parseFloat(dr.importe_percibido);
            this.formularioPercepcion.importe_total_cobrado = parseFloat(this.formularioPercepcion.importe_total_cobrado) + parseFloat(dr.importe_total_cobrar);
          });
        }
        
        
        
        
      },
      watchNumeroDoc(){


        if(this.tipoComprobante == '20'){


        this.typeNumeroDoc = this.toShowType(this.$v.formularioRetencion.proveedor_numero_docum_identidad);
        this.messageNumeroDoc = this.toShowMessage(this.$v.formularioRetencion.proveedor_numero_docum_identidad);
 
        if(this.formularioRetencion.proveedor_numero_docum_identidad && !this.typeNumeroDoc && !this.id){
          if(!this.selectedCliente){
            const params = qs.stringify({
              tipo: this.formularioRetencion.proveedor_tipo_docum_identidad,
              numero: this.formularioRetencion.proveedor_numero_docum_identidad
            })
            const url = `api/clientebyTypeNum?${params}`
            Methods.doGet(this, url)
              .then(response => {
               if(this.formularioRetencion.proveedor_tipo_docum_identidad == '6'){
                  const params = qs.stringify({
                    ruc: this.formularioRetencion.proveedor_numero_docum_identidad
                  })
                  const url = `api/sunat-buscar-ruc?${params}`
                  Methods.doGet(this, url).then(data => {
                    if (data.success) {
                      this.formularioRetencion.proveedor_denominacion = data.nombre_o_razon_social;
                      this.formularioRetencion.proveedor_domicilio_direccion = data.direccion_completa;

                      this.clienteDatosAdicionales = data;

                    }else{
                      this.typeNumeroDoc = 'is-warning'
                      this.messageNumeroDoc = 'Documento no Encontrado'
                      this.formularioRetencion.proveedor_denominacion = null;
                      this.formularioRetencion.proveedor_domicilio_direccion = null;
                      this.formularioRetencion.proveedor_email = null;

                      this.clienteDatosAdicionales = null;
                    }
                  });
                }

                else if(this.formularioRetencion.proveedor_tipo_docum_identidad == '1'){
                  const params = qs.stringify({
                    dni: this.formularioRetencion.proveedor_numero_docum_identidad
                  })
                  const url = `api/reniec-buscar-dni?${params}`
                  Methods.doGet(this, url).then(data => {
                    if (data) {
                      this.formularioRetencion.proveedor_denominacion = data.nombre;
                    }else{
                      this.typeNumeroDoc = 'is-warning'
                      this.messageNumeroDoc = 'Documento no Encontrado'
                      this.formularioRetencion.proveedor_denominacion = null;
                      this.formularioRetencion.proveedor_domicilio_direccion = null;
                      this.formularioRetencion.proveedor_email = null;
                    }
                  });
                }else{
                  this.formularioRetencion.proveedor_denominacion = null;
                  this.formularioRetencion.proveedor_domicilio_direccion = null;
                  this.formularioRetencion.proveedor_email = null;
                  this.clienteDatosAdicionales = null;
                }
              })
              .catch((error) => {
                throw error
              })
          }else if(this.selectedCliente){
            this.formularioRetencion.proveedor_denominacion = this.selectedCliente.razonSocial;
            this.formularioRetencion.proveedor_domicilio_direccion = this.selectedCliente.direccionFiscal;
            this.formularioRetencion.proveedor_email = this.selectedCliente.email;
            this.selectedCliente = null;

            if(this.formularioRetencion.proveedor_tipo_docum_identidad == '6'){
              const params = qs.stringify({
                ruc: this.formularioRetencion.proveedor_numero_docum_identidad
              })
              const url = `api/sunat-buscar-ruc?${params}`
              Methods.doGet(this, url).then(data => {
                if (data.success) {
                  this.clienteDatosAdicionales = data;
                }
              });
            }

          }
        }


        }else if(this.tipoComprobante == '40'){

          
          this.typeNumeroDoc = this.toShowType(this.$v.formularioPercepcion.cliente_numero_docum_identidad);
        this.messageNumeroDoc = this.toShowMessage(this.$v.formularioPercepcion.cliente_numero_docum_identidad);
        if(this.formularioPercepcion.cliente_numero_docum_identidad && !this.typeNumeroDoc && !this.id){
          if(!this.selectedCliente){
            const params = qs.stringify({
              tipo: this.formularioPercepcion.cliente_tipo_docum_identidad,
              numero: this.formularioPercepcion.cliente_numero_docum_identidad
            })
            const url = `api/clientebyTypeNum?${params}`
            Methods.doGet(this, url)
              .then(response => {
               if(this.formularioPercepcion.cliente_tipo_docum_identidad == '6'){
                  const params = qs.stringify({
                    ruc: this.formularioPercepcion.cliente_numero_docum_identidad
                  })
                  const url = `api/sunat-buscar-ruc?${params}`
                  Methods.doGet(this, url).then(data => {
                    if (data.success) {
                      this.formularioPercepcion.cliente_denominacion = data.nombre_o_razon_social;
                      this.formularioPercepcion.cliente_domicilio_direccion = data.direccion_completa;

                      this.clienteDatosAdicionales = data;

                    }else{
                      this.typeNumeroDoc = 'is-warning'
                      this.messageNumeroDoc = 'Documento no Encontrado'
                      this.formularioPercepcion.cliente_denominacion = null;
                      this.formularioPercepcion.cliente_domicilio_direccion = null;
                      this.formularioPercepcion.cliente_email = null;

                      this.clienteDatosAdicionales = null;
                    }
                  });
                }

                else if(this.formularioPercepcion.cliente_tipo_docum_identidad == '1'){
                  const params = qs.stringify({
                    dni: this.formularioPercepcion.cliente_numero_docum_identidad
                  })
                  const url = `api/reniec-buscar-dni?${params}`
                  Methods.doGet(this, url).then(data => {
                    if (data) {
                      this.formularioPercepcion.cliente_denominacion = data.nombre;
                    }else{
                      this.typeNumeroDoc = 'is-warning'
                      this.messageNumeroDoc = 'Documento no Encontrado'
                      this.formularioPercepcion.cliente_denominacion = null;
                      this.formularioPercepcion.cliente_domicilio_direccion = null;
                      this.formularioPercepcion.cliente_email = null;
                    }
                  });
                }else{
                  this.formularioPercepcion.cliente_denominacion = null;
                  this.formularioPercepcion.cliente_domicilio_direccion = null;
                  this.formularioPercepcion.cliente_email = null;
                  this.clienteDatosAdicionales = null;
                }
              })
              .catch((error) => {
                throw error
              })
          }else if(this.selectedCliente){

            this.formularioPercepcion.cliente_denominacion = this.selectedCliente.razonSocial;
            this.formularioPercepcion.cliente_domicilio_direccion = this.selectedCliente.direccionFiscal;
            this.formularioPercepcion.cliente_email = this.selectedCliente.email;
            this.selectedCliente = null;

            if(this.formularioPercepcion.cliente_tipo_docum_identidad == '6'){
              const params = qs.stringify({
                ruc: this.formularioPercepcion.cliente_numero_docum_identidad
              })
              const url = `api/sunat-buscar-ruc?${params}`
              Methods.doGet(this, url).then(data => {
                if (data.success) {
                  this.clienteDatosAdicionales = data;
                }
              });
            }

          }
        }



        }

        





      },
      buscarCliente() {
        this.clientesAutocomplete = []
        this.isFetchingCliente = true
        let params;
        console.log("Entro aqui")
        if(this.tipoComprobante == '20'){
          params = qs.stringify({
          tipo: this.formularioRetencion.proveedor_tipo_docum_identidad,
          numero: this.formularioRetencion.proveedor_numero_docum_identidad
          })
        }else if(this.tipoComprobante == '40'){
          params = qs.stringify({
          tipo: this.formularioPercepcion.cliente_tipo_docum_identidad,
          numero: this.formularioPercepcion.cliente_numero_docum_identidad
          })
        }
        
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

        if(this.tipoComprobante == '20'){
            if (this.formularioRetencion.documentos_relacionados_retencion.length == 0 ) {
          this.errorDocumentosRelacionados = true;
          return;
        }

        if (this.formularioRetencion.observaciones) {
          this.watchObservaciones();
        }

        let model = {};
        Object.assign(model, this.formularioRetencion);

        model.documento_tipo_comprobante = this.tipoComprobante;

        const fe = dateformat(this.fecha_emision, "yyyy-mm-dd");
        model.documento_fecha_emision = fe;
        model.documentos_relacionados_retencion = [];



          this.formularioRetencion.documentos_relacionados_retencion.forEach(dr => {
          let nm = {};
          Object.assign(nm, dr);
          model.documentos_relacionados_retencion.push(nm)
          console.log(dr);
        });

          model.documentos_relacionados_retencion.forEach(dr => {
            const fed = dateformat(dr.fecha_emision, "yyyy-mm-dd");
            const fepd = dateformat(dr.fecha_pago, "yyyy-mm-dd");
            const ferd = dateformat(dr.fecha_retencion, "yyyy-mm-dd");
            const ferc = dateformat(dr.fecha_cambio, "yyyy-mm-dd");

            dr.fecha_emision = fed;
            dr.documento_fecha_emision = fed;
            dr.fecha_pago = fepd;
            dr.fecha_retencion = ferd;
            dr.fecha_cambio = ferc;
          });

        this.$v.$touch();
        console.log(this.$v)

        if(!this.$v.formularioRetencion.$error){
          this.$buefy.dialog.confirm({
            title: 'Confirmar',
            message: '¿Seguro que desea generar este documento?',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            type: 'is-info',
            hasIcon: true,
            onConfirm: () => this.guardarComprobante(model)
          })
        }

        console.log(model);
        }else if(this.tipoComprobante == '40'){


          if (this.formularioPercepcion.documentos_relacionados_percepcion.length == 0 ) {
          this.errorDocumentosRelacionados = true;
          return;
        }

        if (this.formularioPercepcion.observaciones) {
          this.watchObservaciones();
        }

        let model = {};
        Object.assign(model, this.formularioPercepcion);

        model.documento_tipo_comprobante = this.tipoComprobante;

        const fe = dateformat(this.fecha_emision, "yyyy-mm-dd");
        model.documento_fecha_emision = fe;
        model.documentos_relacionados_percepcion = [];



          this.formularioPercepcion.documentos_relacionados_percepcion.forEach(dr => {
          let nm = {};
          Object.assign(nm, dr);
          model.documentos_relacionados_percepcion.push(nm)
          console.log(dr);
        });

          model.documentos_relacionados_percepcion.forEach(dr => {
            const fed = dateformat(dr.fecha_emision, "yyyy-mm-dd");
            const fepd = dateformat(dr.fecha_pago, "yyyy-mm-dd");
            const ferd = dateformat(dr.fecha_retencion, "yyyy-mm-dd");
            const ferc = dateformat(dr.fecha_cambio, "yyyy-mm-dd");

            dr.fecha_emision = fed;
            dr.documento_fecha_emision = fed;
            dr.fecha_cobro = fepd;
            dr.fecha_percepcion = ferd;
            dr.fecha_cambio = ferc;
          });

        this.$v.$touch();
        console.log(this.$v)

        if(!this.$v.formularioPercepcion.$error){
          this.$buefy.dialog.confirm({
            title: 'Confirmar',
            message: '¿Seguro que desea generar este documento?',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            type: 'is-info',
            hasIcon: true,
            onConfirm: () => this.guardarComprobante(model)
          })
        }

        console.log(model);

        }


        
      },

      guardarComprobante(model) {

        console.log('Guardando', model);
        console.log('Adicionales cli', this.clienteDatosAdicionales);

        var url;

        console.log(this.tipoComprobante)

        if(this.tipoComprobante == '20'){
          url =  this.isEdit ? `api/editar-retencion` : `api/retencion`

        }else if(this.tipoComprobante == '40'){
          url =  this.isEdit ? `api/editar-percepcion` : `api/percepcion`
        }

        console.log(url)

        Methods.doPost(this, url, model).then(data => {

          this.$buefy.dialog.alert({
            title: 'Mensaje',
            message: data.mensaje,
            confirmText: 'Aceptar',
            type: data.estado ? 'is-success' : 'is-danger',
            hasIcon: true,
            onConfirm: () => {
              if (data.estado) {
                this.$router.push('/admin/otros-comprobantes/ver');
              }
            }
          })
        })

      },

      obtenerSiguienteNumero() {
        console.log("isedit")
        console.log(this.isEdit)
        if(this.tipoComprobante == '20'){
          if (!this.isEdit){
          {
            if (this.formularioRetencion.documento_serie) {
              const url = `api/othercpes/siguienteNumero/${this.tipoComprobante}/${this.formularioRetencion.documento_serie}`
              Methods.doGet(this, url).then(numero => {
                this.formularioRetencion.documento_numero = numero
              })

            }
          }
        }
        }else if(this.tipoComprobante == '40'){
          if (!this.isEdit){
          {
            if (this.formularioPercepcion.documento_serie) {
              const url = `api/othercpes/siguienteNumero/${this.tipoComprobante}/${this.formularioPercepcion.documento_serie}`
              Methods.doGet(this, url).then(numero => {
                this.formularioPercepcion.documento_numero = numero
              })

            }
          }
        }
        }
        
      },


      showWith2Decimal(number){
        if(parseFloat(number)<0.005 && parseFloat(number)>-0.005)
          return (0).toFixed(2)
        return ((Math.round(parseFloat(number) *100 ))/100).toFixed(2)

      },

    },

    computed: {
      ...mapGetters({'getCompany': 'auth/getCompany'}),
      ...mapGetters({
        'getCatalogo54': 'catalogos/getCatalogo54'
      }),
      ...mapGetters({
        'getCatalogo06': 'catalogos/getCatalogo06'
      }),
      ...mapGetters({
        'getParametros': 'catalogos/getParametros'
      }),
      ...mapGetters({
        'getPuntoVenta': 'punto/getPuntoVenta'
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
      tiposComprobantes() {
        return [
          {value: '01', text: 'Factura'},
          {value: '12', text: 'Ticket maquina reg.'},
          {value: '07', text: 'Nota de crédito'},
          {value: '08', text: 'Nota de débito'},
          {value: '20', text: 'Retención'},
        ]
      },
      titleButtonAction(){
        return `Generar documento`
      },
      existenSeries() {
        return this.seriesDisponibles.length > 0
      },

      isValidAddDr(){
        if(this.tipoComprobante == '20'){
          return this.documentoRelacionadoRetencion.serie && this.documentoRelacionadoRetencion.numero
          && this.documentoRelacionadoRetencion.importe_total && this.documentoRelacionadoRetencion.numero_pago
          && this.documentoRelacionadoRetencion.pago_sin_retencion && this.documentoRelacionadoRetencion.importe_retenido
          && this.documentoRelacionadoRetencion.importe_total_pagar
        }else if(this.tipoComprobante == '40'){
          return this.documentoRelacionadoPercepcion.serie && this.documentoRelacionadoPercepcion.numero
          && this.documentoRelacionadoPercepcion.importe_total && this.documentoRelacionadoPercepcion.numero_cobro
          && this.documentoRelacionadoPercepcion.importe_cobro && this.documentoRelacionadoPercepcion.importe_percibido
          && this.documentoRelacionadoPercepcion.importe_total_cobrar
        }
        
      }
    },
    filters:{
      nombreDocumento(value){
        return Util.getNombreDocumentoByTipo(value)
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
</style>
<style scoped>

  .media-left{
    margin-right: .5rem !important;
  }
  .float-letf{
    float: left;
  }

</style>
