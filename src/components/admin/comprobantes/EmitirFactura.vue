<template>
  <div>
    <emitir-comprobante
              tipoComprobante="01"
              :idGuia="idGuia"
              :isEdit="isEdit"
              :idEdit="idEdit"
    ></emitir-comprobante>
  </div>
</template>

<script>
  import EmitirComprobante from './EmitirComprobante';

  export default {
    props: ['isEdit'],
    components: {
      EmitirComprobante
    },
    name: "emitir-factura",
    data() {
      return {
        idGuia: null,
        idEdit: null
      }
    },
    watch: {
      "$route": "cambioRuta"
    },
    methods: {
      cambioRuta(){

        if(this.$route.params.idGuia){
          this.idGuia = this.$route.params.idGuia;
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
