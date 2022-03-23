import Methods from '../../../../api/methods';
import qs from 'qs';
import dateformat from 'dateformat';
import {
  mapGetters
} from 'vuex';

var mixin = {
  methods: {

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
          perPage: this.searchOptions.perPage
        })

        const url = `api/othercpes?${params}`

        Methods.doGet(this, url).then(data => {
          console.log("Datossss", data)
          this.comprobantesList = data.otherCpeList.content
          this.total = data.total
          resolve(true)
          this.setIntervalUpdateEstados()
        }).catch(error => {
          this.comprobantesList = []
          this.total = 0
          reject(error)
        })

      })
    },

    descargarPDF(tipoDocumeto, serie, numero) {
      const url = `api/descargapdf-othercpe/${tipoDocumeto}/${serie}/${numero}`
      Methods.doGetGetBlob(this, url).then(data => {
        this.isModalPdf = true
        this.urlPDF = data
      })
    },
    descargarXML(invoice) {
      console.log(invoice.idOtroCPE)
      const url = `api/descargaxmluuidothercpe/${invoice.idOtroCPE}/${invoice.uuid}/${invoice.identificadorDocumento}`
      Methods.doGetDonwload(this, url, `${invoice.identificadorDocumento}.zip`).then()
    },
    descargarCDR(invoice) {
      const url = `api/descargacdruuidothercpe/${invoice.idOtroCPE}/${invoice.uuid}/${invoice.identificadorDocumento}`
      Methods.doGetDonwload(this, url, `R-${invoice.identificadorDocumento}.zip`).then()
    }
  },
  computed: {
    ...mapGetters({
      'getPuntoVenta': 'punto/getPuntoVenta'
    })
  }

}


export default mixin
