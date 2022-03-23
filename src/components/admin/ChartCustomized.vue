<template>
  <div class="default-container container-main">
    <h3 class="title is-4 is-spaced has-text-centered">Diagrama personalizado</h3>
    <div class="columns is-multiline">
        <div class="column is-6">
            <basicline titulo="Traza personalizada"></basicline>
        </div>
        <div class="column is-6">
            <pie-legend titulo="Tipos de comprobante"></pie-legend>
        </div>
        <div class="column is-6">
            <bar-stacked titulo="Tipos y estados de comprobante"></bar-stacked>
        </div>
        <div class="column is-6">
            <chart-combo titulo="Tipo y estado de comprobantes"></chart-combo>
        </div>
        <div class="column is-12">
            <heat-map></heat-map>
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
export default {
  components: {
    basicline : BasicLine,
    pieLegend : PieLegend,
    barStacked : BarStacked,
    chartCombo : ChartCombo,
    HeatMap
  }
}
</script>

<style>

</style>