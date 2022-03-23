<template>
  <div>
    <highcharts v-if="serie" :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import {Chart} from 'highcharts-vue'
export default {
    components: {
        highcharts: Chart 
    },
    props: ['titulo','serie'],
    data () {
        return {
            chartOptions: {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: this.titulo
                },
                xAxis: {
                    categories: ['Factura', 'Boleta', 'N. Credito', 'N. Debito']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total de comprobantes'
                    }
                },
                legend: {
                    reversed: false
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: this.serie
            }
        }
    },
    watch: {
        serie(newValue, oldValue){            
            this.chartOptions.series = this.serie            
        }
        
    }
}
</script>

<style>

</style>