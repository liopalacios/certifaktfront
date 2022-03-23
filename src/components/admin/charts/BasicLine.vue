<template>
  <div>
    <highcharts v-if="diames" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import {Chart} from 'highcharts-vue'
export default {
    components: {
        highcharts: Chart 
    },
    props: ['titulo', 'serie', 'anio','mes','diames','intervalo'],
    data () {
        return {
            fecini:'',
            chartOptions: {
                title: {
                    text: this.titulo
                },
                series: [{
                    name: 'Comprobantes',
                    data: this.serie, // sample data
                    pointStart: Date.UTC(this.anio, this.mes, this.diames),
                    pointInterval: this.intervalo * 24 * 3600 * 1000 // one day
                }],
                
                xAxis: {
                    type: 'datetime',
                    day: '%e. %b'
                    
                }
            }
        }
    },
    watch:{
        anio(newValue, oldValue){            
            this.chartOptions.series[0].pointStart = Date.UTC(this.anio, this.mes, this.diames)
            this.chartOptions.series[0].data = this.serie
        }
    },
    computed: {
        viewseriesdata(){
            return this.serie
        }
       
    },
    methods: {
        mescomp(){
            return this.mes
        },
        diamescomp(){
            return this.diames
        },
        aniocomp(){
            this.anio
        }
    }

}
</script>

<style>

</style>