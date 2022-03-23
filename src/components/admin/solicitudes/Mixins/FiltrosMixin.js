import  {mapMutations,mapGetters} from 'vuex'

const monthNames = [
  "Enero", "Febrero", "Marzo",
  "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Setiembre", "Octubre",
  "Noviembre", "Diciembre"
];


var mixin= {
  data() {
    return {
      typeOptions: [
        { value: null, text: 'Filtrar por tipo' },
        { value: '01', text: 'Factura electrónica' },
        { value: '03', text: 'Boleta electrónica' },
        { value: '07', text: 'Nota de crédito electrónica' },
        { value: '08', text: 'Nota de débito electrónica' },
        { value: '20', text: 'Retención electrónica' },
        { value: '40', text: 'Percepción electrónica' }
      ],
    }
  },
  methods:{
    ...mapMutations({
      'setFiltroDesde':'comprobantes/setFiltroDesde',
      'setFiltroHasta':'comprobantes/setFiltroHasta',
      'setFiltroTipoDocumento':'comprobantes/setFiltroTipoDocumento',
      'setFiltroRuc':'comprobantes/setFiltroRuc',
      'setFiltroSerie':'comprobantes/setFiltroSerie',
      'setFiltroNumero':'comprobantes/setFiltroNumero',
      'setComprobantesEntity':'comprobantes/setComprobantesEntity'
    }),
    formatDate(date) {
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      return `${day} de ${monthNames[monthIndex]} de ${year}`
    },
    formatDateFrom(date) {
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      return `Desde ${day} de ${monthNames[monthIndex]} de ${year}`
    },
    formatDateTo(date) {
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      return `Hasta ${day} de ${monthNames[monthIndex]} de ${year}`
    }
  },
  computed:{
    ...mapGetters({
      'getFiltroDesde':'comprobantes/getFiltroDesde',
      'getFiltroHasta':'comprobantes/getFiltroHasta',
      'getFiltroTipoDocumento':'comprobantes/getFiltroTipoDocumento',
      'getFiltroRuc':'comprobantes/getFiltroRuc',
      'getFiltroSerie':'comprobantes/getFiltroSerie',
      'getFiltroNumero':'comprobantes/getFiltroNumero',
      'getComprobantesEntity':'comprobantes/getComprobantesEntity'
    }),
    filtroDesde: {
      get () { return this.getFiltroDesde },
      set (value) { this.setFiltroDesde(value) }
    },
    filtroHasta: {
      get () { return this.getFiltroHasta },
      set (value) { this.setFiltroHasta(value) }
    },
    filtroTipoComprobante: {
      get () { return this.getFiltroTipoDocumento },
      set (value) { this.setFiltroTipoDocumento(value) }
    },
    filtroRuc: {
      get () { return this.getFiltroRuc },
      set (value) { this.setFiltroRuc(value) }
    },
    filtroSerie: {
      get () { return this.getFiltroSerie },
      set (value) { this.setFiltroSerie(value) }
    },
    filtroNumero: {
      get () { return this.getFiltroNumero },
      set (value) { this.setFiltroNumero(value) }
    },
    comprobantesEntity: {
      get () {return this.getComprobantesEntity},
      set (value) {this.setComprobantesEntity(value)}
    },
  },
}


export default mixin
