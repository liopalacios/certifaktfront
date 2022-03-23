
import Vue from 'vue'

Vue.filter('TwoDecimals', function (number) {
  if(number==null || number==undefined) return "0.00"
  if (isNaN(parseInt(number))) return "0.00"
  return parseFloat(number).toFixed(2)
  return 'Error'
})

Vue.filter('FiltroTipoDocumento', function (status) {
  if(status=='01') return 'Factura'
  if(status=='03') return 'Boleta'
  if(status=='07') return 'Nota de crédito'
  if(status=='08') return 'Nota de débito'
  if(status=='09') return 'Guía de Remisión'
  if(status=='20') return 'Retención'
  if(status=='40') return 'Percepción'
  return 'Error'
})

Vue.filter('TipoUsuario', function (status) {
  if(status=='01') return 'Administrador'
  if(status=='02') return 'Normal'
  return 'No asignado'
})

Vue.filter('TipoDocumento', function (status) {
  if(status=='1') return 'Administrador'
  if(status=='2') return 'Normal'
  return 'No asignado'
})

Vue.filter('FiltroNTipoDocumento', function (status) {
  if(status=='0') return 'DOC.TRIB.NO.DOM.SIN.RUC'
  if(status=='1') return 'DNI'
  if(status=='4') return 'CARNET DE EXTRANJERIA'
  if(status=='6') return 'RUC'
  if(status=='7') return 'PASAPORTE'
  if(status=='A') return 'CED. DIPLOMATICA DE IDENTIDAD'
  return 'No asignado'
})

Vue.filter('FiltroEstComprobante', function (status) {
  if(status=='01') return 'Registrado'
  if(status=='02') return 'Aceptado'
  if(status=='03') return 'Aceptado por verificar'
  if(status=='04') return 'Aceptado con advertencia'
  if(status=='05') return 'Rechazado'
  if(status=='06') return 'Error'
  if(status=='07') return 'Proceso envio'
  if(status=='08') return 'Anulado'
  if(status=='09') return 'Anulación Pendiente'
  return 'Error'
})

Vue.filter('FiltroModalidadTraslado', function (status) {
  if(status=='01') return 'PUBLICO'
  if(status=='02') return 'PRIVADO'
  return 'Error'
})

Vue.filter('FiltroEstSunat', function (status) {
  if(status=='ACEPT') return 'Aceptado'
  if(status=='RECHA') return 'Rechazado'
  if(status=='ANULA') return 'Anulado'
  if(status=='N_ENV') return 'No enviado'
  return 'Error'
})

Vue.filter('FiltroTipoAfectacion', function (status) {
  if(status=='10') return 'Gravado - Operación Onerosa'
  if(status=='11') return 'Gravado - Retiro por premio'
  if(status=='12') return 'Gravado - Retiro por donación'
  if(status=='13') return 'Gravado - Retiro'
  if(status=='14') return 'Gravado - Retiro por publicidad'
  if(status=='15') return 'Gravado - Bonificaciones'
  if(status=='16') return 'Gravado - Retiro por entrega a trabajadores'
  if(status=='17') return 'Gravado - IVAP'
  if(status=='20') return 'Exonerado - Operación Onerosa'
  if(status=='21') return 'Exonerado - Transferencia Gratuita'
  if(status=='30') return 'Inafecto - Operación Onerosa'
  if(status=='31') return 'Inafecto - Retiro por Bonificación'
  if(status=='32') return 'Inafecto - Retiro'
  if(status=='33') return 'Inafecto - Retiro por Muestras Médicas'
  if(status=='34') return 'Inafecto - Retiro por Convenio Colectivo'
  if(status=='35') return 'Inafecto - Retiro por premio'
  if(status=='36') return 'Inafecto - Retiro por publicidad'
  if(status=='40') return 'Exportación'
  return 'Error'
})
