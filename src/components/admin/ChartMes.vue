<template>
  <div class="default-container has-text-centered container-main">
    <h3 class="title is-4 is-spaced has-text-centered">Diagrama mensual</h3>
    <div class="columns is-multiline">
        <div class="column is-6">
            <basicline titulo="Traza mensual" :serie="seriesdata" :intervalo="intervalo"
            :anio="this.getanio()" :mes="this.getmes()" :diames="this.getdia()"></basicline>
        </div>
        <div class="column is-6">
            <chart-combo titulo="Tipo y estado de comprobantes" :totb="totalBoleta" :intervalo="intervalo"
            :totf="totalFactura" :listf="listf" :listb="listb" :listt="listt"></chart-combo>
        </div>
        <div class="column is-6">
            <bar-stacked titulo="Tipos y estados del mes" :serie="seriestypeandestate"></bar-stacked>
        </div>
        <div class="column is-6">
            <pie-legend titulo="Comprobantes por tipo del mes" :serie="seriesdatapie"></pie-legend>
        </div>        
        <div class="column is-12">
            <heat-map titulo="Ventas de los colaboradores" :vendedor="listvendedor" :intervalo="intervalo"
            :arrayventas="arrayv"></heat-map>
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
            seriesdata: [1,2],
            fechaini: '',
            diff: 1,
            seriesdatapie: [],
            intervalo: 30,
            totalFactura:0,
            totalBoleta:0,
            listf:0,
            listb:0,
            listt:0,
            seriesdateandtype: [],
            seriestypeandestate: [],
            listvendedor:[],
            arrayv: [],
        }
    },
    methods: {
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
            var diaint = parseInt(aniosplit[2])
            return parseInt(diaint)
        }  
    },
    mounted () {
        this.getPaymentByMonth( ).then(data => {
            this.seriesdata = []
            this.fechaini = data.fecini
            for (var j=0; j<data.lista.length; j++) {                
                this.seriesdata.push(data.lista[j].cantidad)
            }  
        })
        this.getPaymentByDateAndTypeMonth().then(data => {    
            this.seriesdateandtype = []
            this.seriesdateandtype = data.lista
            this.listf = data.arrayf
            this.listb = data.arrayb
            this.listt = data.arrayt
            this.totalFactura = data.facturas
            this.totalBoleta = data.boletas
        })
        this.getPaymentByTypeAndStateMonth().then(data => {
            this.seriestypeandestate = []
            this.seriestypeandestate = data.lista
        })
        this.getPaymentByTypeMonth().then(data => {
            this.seriesdatapie = []
            this.seriesdatapie = data.lista
        })
        this.getPaymentByUserAndMonth().then(data => {
            this.listvendedor = data.listvendedor
            this.arrayv = data.arrayventas
        })
    }

}
</script>

<style>

</style>