<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>
<script>
import {Chart} from 'highcharts-vue'
import SeriesLabel from 'highcharts/modules/series-label'
import Highcharts from 'highcharts'

SeriesLabel(Highcharts)
export default {
    components: {
        highcharts: Chart 
    },
    props: ['titulo','listf','listb','listt','totb','totf','intervalo'],
    data () {
        return {
            dias: ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],
            meses: ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Set.','Oct.','Nov.','Dic.'],
            chartOptions: {
                title: {
                    text: this.titulo
                },
                xAxis: {
                    categories: []
                },
                labels: {
                    items: [
                    {
                        html: "Total tipos de comprobante",
                        style: {
                        left: "50px",
                        top: "18px",
                        color: (Highcharts.theme && Highcharts.theme.textColor) || "black"
                        }
                    }
                    ]
                },
                series: [
                    {
                        type: "column",
                        name: "Facturas",
                        data: this.listf
                    },
                    {
                        type: "column",
                        name: "Boletas",
                        data: this.listb
                    },                    
                    {
                        type: "spline",
                        name: "Total",
                        data: this.listt,
                        marker: {
                            lineWidth: 2,
                            lineColor: Highcharts.getOptions().colors[3],
                            fillColor: "white"
                        }
                    },
                    {
                    type: "pie",
                    name: "Total consumption",
                    data: [
                        {
                        name: "Factura",
                        y: this.totf,
                        color: Highcharts.getOptions().colors[0] // Jane's color
                        },
                        {
                        name: "Boleta",
                        y: this.totb,
                        color: Highcharts.getOptions().colors[1] // John's color
                        }
                        
                    ],
                    center: [100, 80],
                    size: 100,
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                    }
                ]
            }
        }
    },
    mounted(){
        this.createdias()
    },
    methods: {
        createdias(){
            var dia = new Date()
            if(this.intervalo == 1){
                var diasemana = dia.getDay()            
                this.chartOptions.xAxis.categories = []
                for(var i = 0; i< this.dias.length; i++){
                    if(diasemana==6){
                        diasemana=0
                    }else{
                        diasemana ++                    
                    }                
                    this.chartOptions.xAxis.categories.push(this.dias[diasemana])
                }
            }else if(this.intervalo == 30){
                var mesact = dia.getMonth()
                this.chartOptions.xAxis.categories = []
                for( var i = 0; i <= mesact; i++){
                    this.chartOptions.xAxis.categories.push(this.meses[i])
                }
            }
            
            
        }
    },
    watch: {
        listf(newValue, oldValue){            
            this.chartOptions.series[0].data = newValue
            this.chartOptions.series[1].data = this.listb
            this.chartOptions.series[2].data = this.listt
            this.chartOptions.series[3].data[0].y = this.totf
            this.chartOptions.series[3].data[1].y = this.totb
        }
    }
    /*
    data () {
        return {
            /*chartOptions: {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Average Monthly Temperature and Rainfall in Tokyo'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: [{
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}°C',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Temperature',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Rainfall',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mm',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || // theme
                        'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Rainfall',
                    type: 'column',
                    yAxis: 1,
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    tooltip: {
                        valueSuffix: ' mm'
                    }

                }, {
                    name: 'Temperature',
                    type: 'spline',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                    tooltip: {
                        valueSuffix: '°C'
                    }
                }]
            }
        }
    }*/
}
</script>

<style>

</style>