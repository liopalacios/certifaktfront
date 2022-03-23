<template>
    <footer class="footer">
        <div class="container">
            <div class="columns">
              <div class="column is-4">
                <p>
                  &copy; Desarrollado por
                    <a href="https://twitter.com/lioPalacios" target="_blank">Certicom SAC
                  </a>
                </p>
              </div>
              <div class="column is-4">
                <p>
                    <small>
                      <a href= "">Certifakt</a> {{year}} todos los derechos reservados.
                    </small>
                </p>
              </div>
              <div class="column is-4">
                <b-field>
                    <p class="control">
                        <a
                            class="button"
                            href="https://www.facebook.com/certifakt/"
                            target="_blank">
                            <b-icon icon="facebook"/>
                            <span>Facebook</span>
                        </a>
                    </p>
                  <!--  <p class="control">
                        <a
                            class="button is-twitter"
                            href=""
                            target="_blank">
                            <b-icon icon="twitter"/>
                            <span>Twitter</span>
                        </a>
                    </p>-->
                </b-field>
              </div>
                
                

                
            </div>
        </div>
    </footer>
</template>

<script>
  export default {
    data(){
      return{
        year: null
      }
    },
    beforeMount(){
      this.year=new Date().getFullYear()
    }
  }
</script>
