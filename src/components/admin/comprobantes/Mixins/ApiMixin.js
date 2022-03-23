import Methods from '../../../../api/methods';
import qs from 'qs';
import dateformat from 'dateformat';
import {
  mapGetters
} from 'vuex';

var mixin = {
  methods: {
    openInNewTab(url) {
      const win = window.open(url, '_blank');
      win.focus();
    },
    isMobileDevice() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    },
    cargarComprobantescsv(){
      return new Promise((resolve, reject) => {
        const params = qs.stringify({
          filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
          filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
          filtroTipoComprobante: this.filtroTipoComprobante,
          filtroSerie: this.filtroSerie
        })

        const url = `api/allcomprobantescsv?${params}`

        Methods.doGet(this, url).then(data => {
          console.log(data)
          //this.generarExcel(data.comprobantesList)
          this.comprobantesList = data.comprobantesList
          //this.total = data.total
          this.generarExcel(this.comprobantesList)
          resolve(this.comprobantesList)
          this.setIntervalUpdateEstados()
        }).catch(error => {
          this.comprobantesList = []
          this.total = 0
          reject(error)
        })



      })
    },
    cargarComprobantescsvContador(){
      return new Promise((resolve, reject) => {
        const params = qs.stringify({
          filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
          filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
          filtroTipoComprobante: this.filtroTipoComprobante,
          filtroSerie: this.filtroSerie,
          contador:true,
        })

        const url = `api/allcomprobantescsv?${params}`

        Methods.doGet(this, url).then(data => {
          console.log(data)
          //this.generarExcel(data.comprobantesList)
          this.comprobantesList = data.comprobantesList
          this.total = data.total
          this.generarExcelContador(this.comprobantesList)
          resolve(this.comprobantesList)
          this.setIntervalUpdateEstados()
        }).catch(error => {
          this.comprobantesList = []
          this.total = 0
          reject(error)
        })



      })
    },
    cargarCantidadComprobantes(){
      return new Promise((resolve, reject) => {

        const url = `api/cantidadComprobantes`

        Methods.doGet(this, url).then(data => {
          //console.log(data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    cargarComprobantesDetalle() {
      if (!this.idPaymentDetail) {
        return false
      }
      return new Promise((resolve, reject) => {
        const params = qs.stringify({          
          idPayment: this.idPaymentDetail
        })
        console.log(params)
        const url = `api/comprobanteDetail?${params}`

        Methods.doGet(this, url).then(data => {
          this.detailsPaymentVouchersTable = data
          resolve(data)
        }).catch(error => {
          this.detailsPaymentVouchersTable = []
          this.total = 0
          reject(error)
        })



      })

    },
    cargarComprobantes() {
      if (!this.searchOptions.perPage) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Ingrese el número de comprobantes por página.`,
          position: 'is-bottom',
          type: 'is-danger'
        })
        return false;
      }

      return new Promise((resolve, reject) => {
        const params = qs.stringify({
          filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
          filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
          filtroTipoComprobante: this.filtroTipoComprobante,
          filtroRuc: this.filtroRuc,
          filtroSerie: this.filtroSerie,
          filtroNumero: this.filtroNumero,
          pageNumber: this.searchOptions.pageNumber,
          perPage: this.searchOptions.perPage,
          estadoSunat: this.estadoSunatSelect,
        })
        console.log(params)
        const url = `api/comprobantes?${params}`

        Methods.doGet(this, url).then(data => {
          console.log(data)
          //this.generarExcel(data.comprobantesList)
          this.comprobantesList = data.comprobantesList
          this.total = data.total
          this.totalsoles = data.totalsoles
          this.totaldolares = data.totaldolares
          resolve(data)
          this.setIntervalUpdateEstados()
        }).catch(error => {
          this.comprobantesList = []
          this.total = 0
          reject(error)
        })



      })
    },

    cargarExcels(){
      if (!this.searchOptions.perPage) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Ingrese el número de solicitudes por página.`,
          position: 'is-bottom',
          type: 'is-danger'
        })
        return false;
      }

      return new Promise((resolve, reject) => {
        const params = qs.stringify({
          pageNumber: this.searchOptions.pageNumber,
          perPage: this.searchOptions.perPage,
        })

        const url = `api/excels?${params}`

        Methods.doGet(this, url).then(data => {

          this.excelsList = data.excelsList
          console.log(data.excelsList);
          this.total = data.total
          resolve(data)
        }).catch(error => {
          this.excelsList = []
          this.total = 0
          reject(error)
        })



      })
    },
    descargarComprobantes() {
      if (!this.searchOptions.perPage) {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Ingrese el número de comprobantes por página.`,
          position: 'is-bottom',
          type: 'is-danger'
        })
        return false;
      }

        const params = qs.stringify({
          filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
          filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
          filtroTipoComprobante: this.filtroTipoComprobante,
          filtroRuc: this.filtroRuc,
          filtroSerie: this.filtroSerie,
          filtroNumero: this.filtroNumero,
          estadoSunat: this.estadoSunatSelect
        })

        const url = `api/comprobantes-exportar-excel?${params}`

        Methods.doGetDonwload(this, url, "ReporteComprobantes.xlsx").then().catch(error => {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Error al generar excel`,
            position: 'is-bottom',
            type: 'is-danger'
          })
        })
    },
    downloadAllComprobantes() {

          const params = qs.stringify({
            filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
            filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
            filtroTipoComprobante: this.filtroTipoComprobante,
            filtroSerie: this.filtroSerie,
            /*filtroRuc: this.filtroRuc,
            filtroNumero: this.filtroNumero,
            pageNumber: this.searchOptions.pageNumber,
            perPage: this.searchOptions.perPage,
            estadoSunat: this.estadoSunatSelect*/
          });

          const url = `download/generar-descarga-xl?${params}`;

          Methods.doGet(this, url).then(
            () => {
              this.$buefy.toast.open({
                message: 'Se envio excel a la lista de solicitudes',
                type: 'is-success'
            })
            }
          ).catch(error => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Error al enviar excel`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          })

    },

    /*downloadAllComprobantes() {

      this.$buefy.dialog.prompt({
        title: "Escriba su email para enviarle el excel",
        inputAttrs: {
            type: 'email',
            placeholder: 'Email',
        },
        confirmText: "Descargar Listado",
        cancelText: "Cancelar",
        trapFocus: true,
        onConfirm: (filtroEmail) => {
          const params = qs.stringify({
            filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
            filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
            filtroTipoComprobante: this.filtroTipoComprobante,
            filtroSerie: this.filtroSerie,
            filtroEmail: filtroEmail
            /*filtroRuc: this.filtroRuc,
            filtroNumero: this.filtroNumero,
            pageNumber: this.searchOptions.pageNumber,
            perPage: this.searchOptions.perPage,
            estadoSunat: this.estadoSunatSelect*/
          /*});

          const url = `download/generar-descarga-xl?${params}`;

          Methods.doGetDonwload(this, url, "ReporteComprobante"+ dateformat(this.filtroDesde, "dd-mm-yyyy")+"-"+dateformat(this.filtroHasta, "dd-mm-yyyy") + ".xls").then(
            () => {
              this.$buefy.toast.open({
                message: 'Se envio el correo satisfactoriamente',
                type: 'is-success'
            })
            }
          ).catch(error => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Error al generar excel`,
              position: 'is-bottom',
              type: 'is-danger'
            })
          })
        }
    })
    },*/


    downloadAllComprobantesTwo() {

      return new Promise((resolve, reject) => {
        var campos = {
          filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
          filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy")
        }
        if (this.filtroTipoComprobante) {
          campos.filtroTipoComprobante = this.filtroTipoComprobante;
        }
        if (this.filtroRuc) {
          campos.filtroRuc = this.filtroRuc;
        }
        if (this.filtroSerie) {
          campos.filtroSerie = this.filtroSerie;
        }
        if (this.filtroNumero) {
          campos.filtroNumero = this.filtroNumero;
        }
        const params = qs.stringify(campos);

        const url = `api/allcomprobantes?${params}`;

        Methods.doGet(this, url).then()

      })
    },
    cargarComprobantesCancelar() {
      const fechaDesde = new Date();
      fechaDesde.setHours(fechaDesde.getHours() - 72);
      const fechaHasta = new Date();
      const params = qs.stringify({
        filtroDesde: dateformat(fechaDesde, "dd-mm-yyyy"),
        filtroHasta: dateformat(fechaHasta, "dd-mm-yyyy")
      });
      const url = `api/comprobantes?${params}`
      Methods.doGet(this, url).then(data => {
        this.comprobantesList = data
      })
    },
    anularComprobante(fecha, ruc, numero, serie, tipo, razon, tipoComprobanteRelacionado) {
      var request = [{
        "documento_anular_numero": numero,
        "documento_anular_serie": serie,
        "documento_anular_tipo_comprobante": tipo,
        "documento_anular_motivo_anulacion": razon
      }];

      if (tipoComprobanteRelacionado)
        request[0].tipo_comprobante_relacionado = tipoComprobanteRelacionado
      var url = `api/anulacion-comprobantes`;
      return Methods.doPost(this, url, request);
    },
    descargarPDFA4(rucEmisor, tipoDocumeto, serie, numero) {
      const nameFile = `${rucEmisor}-${tipoDocumeto}-${serie}-${numero}.pdf`;
      const url = `api/descargapdf-A4/${tipoDocumeto}/${serie}/${numero}`
      Methods.doGetGetBlob(this, url).then((data) => {

        if (this.isMobileDevice()){
          this.openInNewTab(data)
        } else {
        this.isModalPdf = true
        this.urlPDF = data
        }
      })

    },
    descargareporteexcel() {

      const params = qs.stringify({
        filtroDesde: dateformat(this.filtroDesde, "dd-mm-yyyy"),
        filtroHasta: dateformat(this.filtroHasta, "dd-mm-yyyy"),
        filtroTipoComprobante: this.filtroTipoComprobante,
        filtroRuc: this.filtroRuc,
        filtroSerie: this.filtroSerie,
        filtroNumero: this.filtroNumero
      })

      const url = `api/descargareporteexcel?${params}`


      //const nameFile = `${rucEmisor}-${tipoDocumeto}-${serie}-${numero}.pdf`;
      //const url = `service/descargareporteexcel`
      Methods.doGetGetBlob(this, url).then((data) => {
        if (this.isMobileDevice()){
          this.openInNewTab(data)
        } else {
          this.isModalPdf = true
        this.urlPDF = data
        }

      })

    },
    descargarPDF(tipoDocumeto, serie, numero) {
      const url = `api/descargapdf/${tipoDocumeto}/${serie}/${numero}`
      Methods.doGetGetBlob(this, url).then(data => {
          if (this.isMobileDevice()){
          this.openInNewTab(data)
        } else {
        this.isModalPdf = true
        this.urlPDF = data
        }
      })
    },
    descargarXML(invoice) {
      const url = `api/descargaxmluuid/${invoice.idPaymentVoucher}/${invoice.uuid}/${invoice.identificadorDocumento}`
      Methods.doGetDonwload(this, url, `${invoice.identificadorDocumento}.zip`).then()
    },
    descargarCDR(invoice) {
      const url = `api/descargacdruuid/${invoice.idPaymentVoucher}/${invoice.uuid}/${invoice.identificadorDocumento}`
      Methods.doGetDonwload(this, url, `R-${invoice.identificadorDocumento}.zip`).then()
    },
    descargarCDRBaja(rucUser, identificadorBaja) {
      const nameFile = `R-${rucUser}-${identificadorBaja}.zip`;
      const url = `api/descarga/R-${rucUser}-${identificadorBaja}`
      Methods.doGetDonwload(this, url, nameFile).then()
    },
    generarExcel(listado) {
      console.log("sfgsgss");
      console.log(listado)
      return new Promise((resolve, reject) => {
        var tipodoc = {
          0: 'DTND',
          1: 'DNI',
          4: 'CE',
          6: 'RUC',
          7: 'Pasaporte',
          'A': 'CDI',
          'B': 'DIPR',
          'C': 'TIN',
          'D': 'IN',
          'E': 'TAM',
        };
        this.json_fields = {
          'Fecha': 'fecha',
          'Tipo': 'tipo',
          'Numero': 'numero',
          'Tipo Documento': 'tipoDocumento',
          'Documento': 'documento',
          'Receptor': 'receptor',
          'Moneda': 'moneda',
          'Gravada': 'gravada',
          'Exonerada': 'exonerada',
          'Inafecta': 'inafecta',
          'IGV': 'igv',
          'Descuento Total': 'descuentoTotal',
          'Monto total': 'montoTotal',
          'Estado': 'estado',
          'Estado Sunat': 'estadoSunat',
          'Codigo': 'idproducto',
          'Descripcion Bien o Servicio': 'descripcion',
          'Cantidad': 'cantidad',
          'Valor Unidad': 'valorUnit',
          'Valor venta': 'valorVenta',
          'Descuento': 'descuento',
          'Condiciones': 'valor1',
          'Deposito': 'valor6',
          'Colegiado': 'valor2',
          'Transaccion': 'valor3',
          'Operacion': 'valor4',
          'Especialidad': 'valor5'
        };
        this.json_data = [];

        listado.forEach(result => {
          var campos = [];
          var valor1 = "";
          var valor2 = "";
          var valor3 = "";
          var valor4 = "";
          var valor5 = "";
          var valor6 = "";
          console.log("validar ruc tmperu");
          if(this.getUser.ruc.trim()=="20381032702"){
            console.log("es el ruc tmperu");
              if(typeof result.aditionalFields === 'undefined'){
                console.log("indefinido tmperu");
              }else{
                console.log("no es indefinido ");
                result.aditionalFieldsDto.forEach(resultadd => {
                  console.log(resultadd.typeField)
                  if (`${resultadd.typeFieldId}` == 1) { //CONDICIONES DE PAGO
                    valor1 = `${resultadd.valor}`.replace(null, "")
                  };
                  if (`${resultadd.typeFieldId}` == 273) {//COLEGIADO
                    valor2 = `${resultadd.valor}`.replace(null, "")
                  };
                  if (`${resultadd.typeFieldId}` == 274) {//TRANSACCION
                    valor3 = `${resultadd.valor}`.replace(null, "")
                  };
                  if (`${resultadd.typeFieldId}` == 275) { //n° operacion
                    valor4 = `${resultadd.valor}`.replace(null, "")
                  };
                  if (`${resultadd.typeFieldId}` == 276) { //especialidad
                    valor5 = `${resultadd.valor}`.replace(null, "")
                  };
                  if (`${resultadd.typeFieldId}` == 291) { //fecha deposito
                    valor6 = `${resultadd.valor}`.replace(null, "")
                  };
                });
              }
          }
          const comprobante = {
            fecha: result.fechaEmision,
            tipo: this.$filters.FiltroTipoDocumento(result.tipoComprobante),
            numero: `${result.serie}-${result.numero}`,
            tipoDocumento: tipodoc[`${result.tipoDocIdentReceptor}`],
            documento: `${result.numDocIdentReceptor}`,
            receptor: `${result.denominacionReceptor}`,
            moneda: result.codigoMoneda,
            gravada: Math.round((`${result.totalValorVentaOperacionGravada}`).replace(null, 0) * 100) / 100,
            exonerada: Math.round((`${result.totalValorVentaOperacionExonerada}`).replace(null, 0) * 100) / 100,
            inafecta: Math.round((`${result.totalValorVentaOperacionInafecta}`).replace(null, 0) * 100) / 100,
            montoTotal: result.montoImporteTotalVenta,
            estado: this.$filters.FiltroEstComprobante(result.estado),
            estadoSunat: this.$filters.FiltroEstSunat(result.estadoSunat),
            descuentoTotal: `${result.montoDescuentoGlobal}`.replace(null, ""),
            igv: Math.round((`${result.sumatoriaIGV}`).replace(null, 0) * 100) / 100,
            idproducto: "",
            descripcion: "",
            cantidad: "",
            valorUnit: "",
            valorVenta: "",
            descuento: "",
            valor1: valor1,
            valor2: valor2,
            valor3: valor3,
            valor4: valor4,
            valor5: valor5,
            valor6: valor6
          };
          this.json_data.push(comprobante);
          result.detailsPaymentVouchers.forEach(resultdetail => {
              const detail = {
                fecha: "",
                tipo: "",
                numero: "",
                tipoDocumento: "",
                documento: "",
                receptor: "",
                moneda: "",
                gravada: "",
                exonerada: "",
                inafecta: "",
                montoTotal: "",
                estado: "",
                estadoSunat: "",
                descuentoTotal: "",
                igv: "",
                idproducto: `${resultdetail.codigoProducto}`,
                descripcion: `${resultdetail.descripcion}`,
                cantidad: `${resultdetail.cantidad}`,
                valorUnit: `${resultdetail.valorUnitario}` ,
                valorVenta: Math.round(`${resultdetail.valorVenta}` * 100) / 100,
                descuento: `${resultdetail.descuento}`.replace(null, ""),
                valor1: "",
                valor2: "",
                valor3: "",
                valor4: "",
                valor5: "",
                valor6: ""
              };
              this.json_data.push(detail)
            })
        });
        const fecha1 = dateformat(this.filtroDesde, "yyyymmdd");
        const fecha2 = dateformat(this.filtroHasta, "yyyymmdd");
        this.name_report = `Reporte_comprobantes_${fecha1}_${fecha2}.csv`;
        console.log("TYUIO");
        console.log(this.json_data);
        if (this.json_data.length>0){
          resolve(this.json_data)
        } else {
          reject(this.json_data)
        }

    })
    },
    generarExcelContador(listado) {
      console.log(listado)
      return new Promise((resolve, reject) => {
        var tipodoc = {
          0: 'DTND',
          1: 'DNI',
          4: 'CE',
          6: 'RUC',
          7: 'Pasaporte',
          'A': 'CDI',
          'B': 'DIPR',
          'C': 'TIN',
          'D': 'IN',
          'E': 'TAM',
        };
        this.json_fields_contador = {
          'Fecha': 'fecha',
          'Tipo': 'tipo',
          'Numero': 'numero',
          'Tipo Documento': 'tipoDocumento',
          'Documento': 'documento',
          'Receptor': 'receptor',
          'Moneda': 'moneda',
          'Gravada': 'gravada',
          'Exonerada': 'exonerada',
          'Inafecta': 'inafecta',
          'IGV': 'igv',
          'Descuento Total': 'descuentoTotal',
          'Monto total': 'montoTotal',
          'Estado': 'estado',
          'Estado Sunat': 'estadoSunat',
          /*'Codigo': 'idproducto',
          'Descripcion Bien o Servicio': 'descripcion',
          'Cantidad': 'cantidad',
          'Valor Unidad': 'valorUnit',
          'Valor venta': 'valorVenta',
          'Descuento': 'descuento',
          'Condiciones': 'valor1',
          'Deposito': 'valor6',
          'Colegiado': 'valor2',
          'Transaccion': 'valor3',
          'Operacion': 'valor4',
          'Especialidad': 'valor5'*/
        };
        this.json_data_contador = [];

        var suma=0.0;
        listado.forEach(result => {
          const comprobante = {
            fecha: result.fechaEmision,
            tipo: this.$filters.FiltroTipoDocumento(result.tipoComprobante),
            numero: `${result.serie}-${result.numero}`,
            tipoDocumento: tipodoc[`${result.tipoDocIdentReceptor}`],
            documento: `${result.numDocIdentReceptor}`,
            receptor: `${result.denominacionReceptor}`,
            moneda: result.codigoMoneda,
            gravada: Math.round((`${result.totalValorVentaOperacionGravada}`).replace(null, 0) * 100) / 100,
            exonerada: Math.round((`${result.totalValorVentaOperacionExonerada}`).replace(null, 0) * 100) / 100,
            inafecta: Math.round((`${result.totalValorVentaOperacionInafecta}`).replace(null, 0) * 100) / 100,
            montoTotal: result.montoImporteTotalVenta,
            estado: this.$filters.FiltroEstComprobante(result.estado),
            estadoSunat: this.$filters.FiltroEstSunat(result.estadoSunat),
            descuentoTotal: `${result.montoDescuentoGlobal}`.replace(null, ""),
            igv: Math.round((`${result.sumatoriaIGV}`).replace(null, 0) * 100) / 100,
          };
          suma=suma+parseFloat(result.montoImporteTotalVenta)
          this.json_data_contador.push(comprobante);
        });

        console.log(suma)
        suma = Math.round(suma * 100) / 100
        suma=suma+""
        console.log(suma)
        const resultado = {
          fecha: null,
          tipo: null,
          numero: null,
          tipoDocumento: null,
          documento: null,
          receptor: null,
          moneda: null,
          gravada: null,
          exonerada: null,
          inafecta: null,
          montoTotal: suma.toString(),
          estado: null,
          estadoSunat: null,
          descuentoTotal: null,
          igv: null
        }
        this.json_data_contador.push(resultado);
        const fecha1 = dateformat(this.filtroDesde, "yyyymmdd");
        const fecha2 = dateformat(this.filtroHasta, "yyyymmdd");
        this.name_report = `Contador_${fecha1}_${fecha2}.csv`;
        console.log(this.json_data_contador);
        if (this.json_data_contador.length>0){
          resolve(this.json_data_contador)
        } else {
          reject(this.json_data_contador)
        }

    })
    }
  },

  computed: {
    ...mapGetters({
      'getPuntoVenta': 'punto/getPuntoVenta'
    })
  }

}


export default mixin
