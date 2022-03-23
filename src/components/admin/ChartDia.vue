<template>
  <div class="default-container has-text-centered container-main">
    <h2 class="title is-4 is-spaced">Diagrama diario</h2>
    <div class="columns is-multiline">
        <div class="column is-6">
            <basicline titulo="Traza de comprobantes" :serie="seriesdata" :intervalo="intervalo"
            :anio="this.getanio()" :mes="this.getmes()" :diames="this.getdia()"></basicline>
        </div>
        <div class="column is-6">
            <chart-combo titulo="Tipos de comprobante" :totb="totalBoleta" :totf="totalFactura" 
            :listf="listf" :listb="listb" :listt="listt" :intervalo="intervalo"></chart-combo>
        </div>        
        <div class="column is-6">
            <bar-stacked titulo="Tipo y estado de comprobantes" :serie="seriestypeandestate"></bar-stacked>
        </div>
        <div class="column is-6">
            <pie-legend titulo="Comprobantes por tipo del dia" :serie="seriesdatapie"></pie-legend>
        </div>
        <div class="column is-12">
            <heat-map titulo="Ventas de los colaboradores" :vendedor="listvendedor" :arrayventas="arrayv"></heat-map>
        </div>
    </div>
    
    
  </div>
</template>

<script>
import BasicLine from './charts/BasicLine'
import PieLegend from './charts/PieLegend'
import BarStacked from './charts/BarStacked'
import ChartCombo from './charts/ChartCombo'
import HeatMap from './charts/HeatMap'
import ChartMixin from "./charts/Mixins/ChartMixin"
export default {
    mixins: [ChartMixin],
    components: {
        basicline : BasicLine,
        pieLegend : PieLegend,
        barStacked : BarStacked,
        chartCombo : ChartCombo,
        HeatMap
        
    },
    data (){
        return {
            intervalo: 1,
            totalFactura:0,
            totalBoleta:0,
            listf:0,
            listb:0,
            listt:0,
            listvendedor:[],
            arrayv: [],
            diff: 7,
            seriesdata: [1,2],
            fechaini: '',
            seriesdatapie: [],
            seriestypeandestate: [],
            seriesdateandtype: [],
            listPaymentByDay: [],
            listPaymentByType: [],
            listPaymentByDateAndType: [],
            listPaymentByUserAndDay: []
        }
    },
    mounted(){
        this.getPaymentByDay( this.diff ).then(data => {            
            this.seriesdata = []
            this.fechaini = data.fecini
            for (var j=0; j<data.lista.length; j++) {                
                this.seriesdata.push(data.lista[j].cantidad)
            }  
        })
        this.getPaymentByDateAndType().then(data => {    
            this.seriesdateandtype = []
            this.seriesdateandtype = data.lista
            this.listf = data.arrayf
            this.listb = data.arrayb
            this.listt = data.arrayt
            this.totalFactura = data.facturas
            this.totalBoleta = data.boletas
        })
        this.getPaymentByType().then(data => {
            this.seriesdatapie = []
            this.seriesdatapie = data.lista
        })
        this.getPaymentByTypeAndState().then(data => {
            this.seriestypeandestate = []
            this.seriestypeandestate = data.lista
        })        
        this.getPaymentByUserAndDay().then(data => {
            this.listvendedor = data.listvendedor
            this.arrayv = data.arrayventas
        })
    },
    methods: {
        getseriesdatapie(){
            return this.seriesdatapie
        },
        getanio() {
            var aniosplit = this.fechaini.split("-")
            return parseInt(aniosplit[0])
        },
        getmes() {
            var aniosplit = this.fechaini.split("-")
            var mesint = parseInt(aniosplit[1]) - 1
            return parseInt(mesint)
        },
        getdia() {
            var aniosplit = this.fechaini.split("-")            
            var diaint = parseInt(aniosplit[2]) + 1
            return parseInt(diaint)
        }        
    },
    computed: {
        compseriesdata(){
            return this.seriesdata
        }
    }
}
</script>

<style>

</style>