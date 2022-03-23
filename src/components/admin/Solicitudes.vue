<template>
    <div class="default-container">

   

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

