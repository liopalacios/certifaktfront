<template>
  <div>
    <emitir-comprobante
              :id="idComprobante"
              :isEdit="isEdit"
              :idEdit="idEdit"
              tipoComprobante="08"></emitir-comprobante>
  </div>
</template>

<script>
  import EmitirComprobante from './EmitirComprobante';

  export default {
    props: ['isEdit'],
    components: {
      EmitirComprobante
    },
    data() {
      return {
        tipoboleta:false,
        idComprobante: null,
        idEdit: null
      }
    },
    watch: {
      "$route": "cambioRuta"
    },
    methods: {
      cambioRuta(){
        if(this.$route.params.id){
          this.idComprobante = this.$route.params.id;
        }

        if(this.$route.params.idEdit){
          this.idEdit = this.$route.params.idEdit;
        }
      }
    },
    beforeMount() {
      this.cambioRuta();
    }
  }
</script>
<style scoped>
  .table .celdadelete{
    background: #007bea !important;

  }
</style>
