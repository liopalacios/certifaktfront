const mixin = {
    methods: {
      getTypeFieldCodigo() {
        if (this.$v.producto.codigo.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldCodigo() {
        if (this.getTypeFieldCodigo()) {
          if (!this.$v.producto.codigo.required) {
            return 'Codigo requerida'
          } else return 'Codigo invalida'
        }
        return ''
      },
      getTypeFieldCodigoSunat() {
        if (this.$v.producto.codigoSunat.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldCodigoSunat() {
        if (this.getTypeFieldCodigoSunat()) {
          if (!this.$v.producto.codigoSunat.required) {
            return 'Codigo de Sunat requerido'
          } else return 'Codigo de Sunat inválido'
        }
        return ''
      },
      getTypeFieldDescripcion() {
        if (this.$v.producto.descripcion.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldDescripcion() {
        if (this.getTypeFieldDescripcion()) {
          if (!this.$v.producto.descripcion.required) {
            return 'Descripción requerida'
          } else return 'Descripción invalida'
        }
        return ''
      },
      getTypeFieldUnidadMedida() {
        if (this.$v.producto.unidadMedida.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldUnidadMedida() {
        if (this.getTypeFieldUnidadMedida()) {
          if (!this.$v.producto.unidadMedida.required) {
            return 'Unidad de Medida requerida'
          } else return 'Unidad de Medida invalida'
        }
        return ''
      },
      getTypeFieldVVentaSinIGV() {
        if (this.$v.producto.valorVentaSinIgv.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldVVentaSinIGV() {
        if (this.getTypeFieldVVentaSinIGV()) {
          if (!this.$v.producto.valorVentaSinIgv.required) {
            return 'Valor de Venta sin IGV requerida'
          } else return 'Valor de Venta sin IGV invalida'
        }
        return ''
      },
      getTypeFieldVVentaConIGV() {
        if (this.$v.producto.valorVentaConIgv.$error) return 'is-danger'
        return ''
      },
      getMensajeFieldVVentaConIGV() {
        if (this.getTypeFieldVVentaConIGV()) {
          if (!this.$v.producto.valorVentaConIgv.required) {
            return 'Valor de Venta con IGV requerida'
          } else return 'Valor de Venta con IGV invalida'
        }
        return ''
      },
      generarExcel(listado) {
        this.json_fields = {
          'Codigo': 'codigo',
          'Descripción': 'descripcion',
          'Moneda': 'moneda',
          'Unidad de medida': 'umedida',
          'Tipo de afectación': 'tafectacion',
          'Valor venta sin IGV': 'vventasinigv',
          'Valor venta con IGV': 'vventaconigv'
        }
        this.json_data = [];
        listado.forEach(result => {
          const producto = {
            codigo: result.codigo,
            descripcion: result.descripcion,
            moneda: result.moneda,
            umedida: result.unidadMedida,
            vventasinigv: result.valorVentaSinIgv,
            vventaconigv: result.valorVentaConIgv
          }
  
          if(result.tipoAfectacion=='10') producto.tafectacion = 'Gravado - Operación Onerosa'
          if(result.tipoAfectacion=='11') producto.tafectacion = 'Gravado - Retiro por premio'
          if(result.tipoAfectacion=='12') producto.tafectacion = 'Gravado - Retiro por donación'
          if(result.tipoAfectacion=='13') producto.tafectacion = 'Gravado - Retiro'
          if(result.tipoAfectacion=='14') producto.tafectacion = 'Gravado - Retiro por publicidad'
          if(result.tipoAfectacion=='15') producto.tafectacion = 'Gravado - Bonificaciones'
          if(result.tipoAfectacion=='16') producto.tafectacion = 'Gravado - Retiro por entrega a trabajadores'
          if(result.tipoAfectacion=='17') producto.tafectacion = 'Gravado - IVAP'
          if(result.tipoAfectacion=='20') producto.tafectacion = 'Exonerado - Operación Onerosa'
          if(result.tipoAfectacion=='21') producto.tafectacion = 'Exonerado - Transferencia Gratuita'
          if(result.tipoAfectacion=='30') producto.tafectacion = 'Inafecto - Operación Onerosa'
          if(result.tipoAfectacion=='31') producto.tafectacion = 'Inafecto - Retiro por Bonificación'
          if(result.tipoAfectacion=='32') producto.tafectacion = 'Inafecto - Retiro'
          if(result.tipoAfectacion=='33') producto.tafectacion = 'Inafecto - Retiro por Muestras Médicas'
          if(result.tipoAfectacion=='34') producto.tafectacion = 'Inafecto - Retiro por Convenio Colectivo'
          if(result.tipoAfectacion=='35') producto.tafectacion = 'Inafecto - Retiro por premio'
          if(result.tipoAfectacion=='36') producto.tafectacion = 'Inafecto - Retiro por publicidad'
          if(result.tipoAfectacion=='40') producto.tafectacion = 'Exportación'
  
          this.json_data.push(producto);
        })
        this.name_report = `Reporte_productos.xls`
      }
    }
}

export default mixin
