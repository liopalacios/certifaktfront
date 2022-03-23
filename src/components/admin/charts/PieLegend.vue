<template>
  <div>      
    <highcharts v-if="serie.length>0" :options="chartOptions"></highcharts>
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
            seriedata: [],
            chartOptions: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: this.titulo
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: this.serie
                }]
            }
        }
    },
    watch: {
        serie(newValue, oldValue){            
            this.chartOptions.series[0].data = this.serie            
        }
        
    },
    methods: {
        setserie(){            
            this.chartOptions.series[0].data = this.serie            
        }
    },
    computed: {
        seriecomp(){
            return this.serie
        }
    },
    mounted(){
        this.setserie()
    }

}
</script>

<style>

</style>