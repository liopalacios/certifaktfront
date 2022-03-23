<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>    
  </div>
</template>

<script>
import {Chart} from 'highcharts-vue'
import SeriesLabel from 'highcharts/modules/series-label'
import heatmap from 'highcharts/modules/heatmap'
import Highcharts from 'highcharts'
heatmap(Highcharts)
SeriesLabel(Highcharts)
function getPointCategoryName(point, dimension) {
    var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
}
export default {
    components: {
        highcharts: Chart 
    },
    props: ['titulo','vendedor','arrayventas','intervalo'],
    data () {
        return {
            dias: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
            meses: ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Set.','Oct.','Nov.','Dic.'],
            chartOptions: {
                chart: {
                    type: 'heatmap',
                    marginTop: 40,
                    marginBottom: 80,
                    plotBorderWidth: 1
                },


                title: {
                    text: this.titulo
                },

                xAxis: {
                    categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas']
                },

                yAxis: {
                    categories: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes','Sabado','Domingo'],
                    title: 'DIAS',
                    reversed: true
                },

                accessibility: {
                    point: {
                        descriptionFormatter: function (point) {
                            var ix = point.index + 1,
                                xName = getPointCategoryName(point, 'x'),
                                yName = getPointCategoryName(point, 'y'),
                                val = point.value;
                            return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                        }
                    }
                },

                colorAxis: {
                    min: 0,
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },

                legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + getPointCategoryName(this.point, 'x') + '</b> generó <br><b>' +
                            this.point.value + '</b> comprobantes el <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
                    }
                },

                series: [{
                    name: 'Ventas por colaborador',
                    borderWidth: 1,
                    data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [0, 5, 67], [0, 6, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [1, 5, 48], [1, 6, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [2, 5, 52], [2, 6, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [3, 5, 16], [3, 6, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [4, 5, 115], [4, 6, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [5, 5, 120], [5, 6, 120]],
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                }],

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            yAxis: {
                                labels: {
                                    formatter: function () {
                                        return this.value.charAt(0);
                                    }
                                }
                            }
                        }
                    }]
                }
            }
        }
    },
    methods: {
        createdias(){
            var dia = new Date()
            if(this.intervalo == 1){
                var diasemana = dia.getDay()            
                this.chartOptions.yAxis.categories = []
                for(var i = 0; i< this.dias.length; i++){
                    if(diasemana==6){
                        diasemana=0
                    }else{
                        diasemana ++                    
                    }                
                    this.chartOptions.yAxis.categories.push(this.dias[diasemana])
                }
            }else if(this.intervalo == 30){
                var mesact = dia.getMonth()
                this.chartOptions.yAxis.categories = []
                for( var i = 0; i <= mesact; i++){
                    this.chartOptions.yAxis.categories.push(this.meses[i])
                }
            }
            
        }
    },
    watch: {
        vendedor(){
            this.chartOptions.xAxis.categories = []
            this.chartOptions.xAxis.categories = this.vendedor
            
        },
        arrayventas(){
            this.chartOptions.series[0].data = []
            this.chartOptions.series[0].data = this.arrayventas
        }
    },
    mounted(){
        this.createdias()
    }

}
</script>

<style>

</style>