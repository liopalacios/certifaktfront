const mixin = {
  methods: {
    getTypeFieldNumeroDocumento() {
      if (this.$v.cliente.numeroDocumento.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldNumeroDocumento() {
      if (this.getTypeFieldNumeroDocumento()) {
        if (!this.$v.cliente.numeroDocumento.required) {
          return 'Numero de Documento requerida'
        } else return 'Numero de Documento invalida'
      }
      return ''
    },

    getTypeFieldDenominacion() {
      if (this.$v.cliente.razonSocial.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldDenominacion() {
      if (this.getTypeFieldDenominacion()) {
        if (!this.$v.cliente.razonSocial.required) {
          return 'Denominación requerida'
        } else return 'Denominación invalida'
      }
      return ''
    },

    getTypeFieldNombreComercial() {
      if (this.$v.cliente.nombreComercial.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldNombreComercial() {
      if (this.getTypeFieldNombreComercial()) {
        if (!this.$v.cliente.nombreComercial.required) {
          return 'Nombre Comercial requerida'
        } else return 'Nombre Comercial invalida'
      }
      return ''
    },

    getTypeFieldTelefonoFijo() {
      if (this.$v.cliente.telefonoFijo.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldTelefonoFijo() {
      if (this.getTypeFieldTelefonoFijo()) {
        if (!this.$v.cliente.telefonoFijo.required) {
          return 'Telefono Fijo requerida'
        } else return 'Telefono Fijo invalida'
      }
      return ''
    },

    getTypeFieldTelefonoMovil() {
      if (this.$v.cliente.telefonoMovil.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldTelefonoMovil() {
      if (this.getTypeFieldTelefonoMovil()) {
        return 'Telefono Movil invalida'
      }
      return ''
    },

    getTypeFieldDireccionFiscal() {
      if (this.$v.cliente.direccionFiscal.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldDireccionFiscal() {
      if (this.getTypeFieldDireccionFiscal()) {
        if (!this.$v.cliente.direccionFiscal.required) {
          return 'Dirección Fiscal requerida'
        } else return 'Dirección Fiscal invalida'
      }
      return ''
    },

    getTypeFieldCorreo() {
      if (this.$v.cliente.email.$error) return 'is-danger'
      return ''
    },
    getMensajeFieldCorreo() {
      if (this.getTypeFieldCorreo()) {
        if (!this.$v.cliente.email.required) {
          return 'Email requerida'
        } else return 'Email invalida'
      }
      return ''
    },
    generarExcel(listado) {
      this.json_fields = {
        'Tipo Documento': 'tdocumento',
        'Numero Documento': 'ndocumento',
        'Denominación': 'denominacion',
        'Nombre Comercial': 'nombrecomercial',
        'Telefono Fijo': 'telefonofijo',
        'Telefono Movil': 'telefonomovil',
        'Dirección': 'direccion',
        'Correo': 'correo',
        'Condición de Pago': 'condicionPago'
      }
      this.json_data = [];
      listado.forEach(result => {
        const cliente = {
          ndocumento: result.numeroDocumento,
          denominacion: result.razonSocial,
          nombrecomercial: (result.nombreComercial==null?'':result.nombreComercial),
          telefonofijo: (result.telefonoFijo==null?'':result.telefonoFijo),
          telefonomovil: (result.telefonoMovil==null?'':result.telefonoMovil),
          direccion: result.direccionFiscal,
          correo: result.email,
          condicionPago: (result.condicionPago==null?'':result.condicionPago)
        }

        if(result.tipoDocumento=='0') cliente.tdocumento = 'DOC.TRIB.NO.DOM.SIN.RUC'
        else if(result.tipoDocumento=='1') cliente.tdocumento = 'DNI'
        else if(result.tipoDocumento=='4') cliente.tdocumento = 'CARNET DE EXTRANJERIA'
        else if(result.tipoDocumento=='6') cliente.tdocumento = 'RUC'
        else if(result.tipoDocumento=='7') cliente.tdocumento = 'PASAPORTE'
        else if(result.tipoDocumento=='A') cliente.tdocumento = 'CED. DIPLOMATICA DE IDENTIDAD'
        else cliente.tdocumento = 'No asignado'

        this.json_data.push(cliente);
      })
      this.name_report = `Reporte_Clientes.xls`
    }
  }
}

export default mixin
