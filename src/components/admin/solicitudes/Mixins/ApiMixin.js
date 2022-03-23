import Methods from '../../../../api/methods';
import qs from 'qs';

var mixin = {
  methods: {
    openInNewTab(url) {
      const win = window.open(url, '_blank');
      win.focus();
    },
    isMobileDevice() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    },
    descargarExcel(invoice){
      const url = `api/descargaexcel/${invoice.idExcelDocument}/${invoice.identificador}`
      Methods.doGetDonwload(this, url, `${invoice.identificador}.zip`).then()
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

}
}


export default mixin