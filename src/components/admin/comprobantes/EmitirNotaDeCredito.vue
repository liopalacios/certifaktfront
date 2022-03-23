<template>
  <div>
    <emitir-comprobante
              :id="idComprobante"
              :isEdit="isEdit"
              :idEdit="idEdit"
              tipoComprobante="07"></emitir-comprobante>
  </div>
</template>

<script>
  import EmitirComprobante from './EmitirComprobante';

  export default {
    props: ['isEdit'],
    components: {
      EmitirComprobante
    },
    name: "emitir-nota-credito",
    data() {
      return {
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
  .celdadelete{
    display: none;
  }
</style>
