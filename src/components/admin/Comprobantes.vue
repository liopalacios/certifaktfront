<template>
    <div class="default-container container-main">

        <!--<div class="columns">
          <router-link to="/admin/comprobantes/ver-comprobantes" class="column has-text-centered" href="">Ver comprobantes</router-link>
          <router-link to="/admin/comprobantes/emitir-factura" class="column has-text-centered" href="">Emitir factura</router-link>
          <router-link to="/admin/comprobantes/emitir-boleta" class="column has-text-centered" href="">Emitir boleta</router-link>
          <router-link to="/admin/comprobantes/emitir-nota-credito" class="column has-text-centered" href="">Emitir nota de crédito</router-link>
          <router-link to="/admin/comprobantes/emitir-nota-debito" class="column has-text-centered" href="">Emitir nota de débito</router-link>
        </div>-->
      <h3 class="title is-4 is-spaced has-text-centered">{{titulo}}</h3>
      <hr>
      <router-view/>
    </div>
</template>

<script>
  export default {
    components: {

    },
    data() {
      return {
        titulo:''
      }
    },
    methods: {
      setTitulo(){
        this.titulo= this.$route.meta.titulo
      }
    },
    watch:{
      '$route':'setTitulo'
    },
    created(){
      this.setTitulo()
    }

  }
</script>

<style>
  .customActiveLink{
    background-color: #f6f6f6;
  }
  .container-main {
    padding-top: 10px !important;
  }
</style>

