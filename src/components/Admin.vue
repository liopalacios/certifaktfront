<template>
  <div>
    <div class="sidebar-bg"/>
    <section class="section">
      <div class="container is-fullhd template-horizontal">
        <TheSidebar :data="menu"/>
        <router-view/>
      </div>
    </section>
  </div>
</template>

<script>
  import TheSidebar from '../pages/TheSidebar'
  import menu from '../menu'
  import highcharts from 'highcharts'
  import Export from 'highcharts/modules/exporting'
  import Drilldown from 'highcharts/modules/drilldown'
  Drilldown(highcharts)
  Export(highcharts)
    export default {
        components:{TheSidebar},
        data() {
            return {

            }
        },
      computed: {
        menu() {
          return menu
        }
      }
    }
</script>
<style scoped>
.section {
  padding: 10px !important;
}
</style>