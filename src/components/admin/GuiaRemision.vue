<template>
    <div class="default-container container-main">
      <!--
        <div class="columns">
          <router-link to="/admin/guiaRemision/ver-guias" class="column has-text-centered">Ver guías de remisión</router-link>
          <router-link to="/admin/guiaRemision/guia-remitente" class="column has-text-centered">Emitir Guía de Remisión Remitente</router-link>
        </div>-->

      <h3 class="title is-4 is-spaced has-text-centered">{{titulo}}</h3>

      <hr>

      <router-view>
      </router-view>


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
</style>

