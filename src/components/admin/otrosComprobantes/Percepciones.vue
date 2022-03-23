<template>
    <div>
        <emitir-otro-comprobante  tipoComprobante="40"
            :isEdit="isEdit"
            :idEdit="idEdit">

        </emitir-otro-comprobante>
    </div>
</template>

<script>
    import EmitirOtroComprobante from './EmitirOtroComprobante';
    export default {
      props: ['isEdit'],
      components: {EmitirOtroComprobante},
    data() {
        return {
            idEdit: null
            }
        },
    watch: {
        "$route": "cambioRuta"
    },
    methods: {
      cambioRuta(){
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
