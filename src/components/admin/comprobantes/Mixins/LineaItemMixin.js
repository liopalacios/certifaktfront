const mixin= {
    methods:{
      getTypeFieldDescProducto(){
        if(this.$v.producto.descProducto.$error){
            return 'is-danger'
        }
        return ''
      },
      getMensajeFieldDescProducto(){
        if(this.getTypeFieldDescProducto()){
          if(!this.$v.producto.descProducto.required){
            return 'Descripción requerido'
          }else if(this.$v.producto.descProducto.$error){
            return 'Descripción no valido'
          }
        }
        return ''
      },


      getTypeFieldUnidadMedida(){
        if(this.$v.producto.unidadMedida.$error){
          return 'is-danger'
        }
        return ''
      },
      getMensajeFieldUnidadMedida(){
        if(this.getTypeFieldUnidadMedida()){
          if(!this.$v.producto.unidadMedida.required){
            return 'Unidad requerido'
          }else if(this.$v.producto.unidadMedida.$error){
            return 'Unidad no valido'
          }
        }
        return ''
      },

      getTypeFieldCantidad(){
        if(this.$v.producto.cantidad.$error){
            return 'is-danger'
        }
        return ''
      },
      getMensajeFieldCantidad(){
        if(this.getTypeFieldCantidad()){
          if(!this.$v.producto.cantidad.required){
            return 'Cantidad requerido'
          }else if(this.$v.producto.cantidad.$error){
            return 'Cantidad no valido'
          }
        }
        return ''
      },
      getMensajeFieldTipoIGV(){
        if(this.getTypeFieldTipoIGV()){
          if(!this.$v.producto.tigv.required){
            return 'Tipo IGV requerido'
          }else if(this.$v.producto.tigv.$error){
            return 'Tipo IGV no valido'
          }
        }
        return ''
      },
      getTypeFieldPUnitario(){
        if(this.$v.producto.punitario.$error){
            return 'is-danger'
        }
        return ''
      },
      getMensajeFieldPUnitario(){
        if(this.getTypeFieldPUnitario()){
          if(!this.$v.producto.punitario.required || !this.$v.producto.punitario.minValue){
            return 'Prec. Unitario requerido'
          }else if(this.$v.producto.punitario.$error){
            return 'Prec. Unitario no valido'
          }
        }
        return ''
      },
      getTypeFieldTipoIGV(){
        if(this.$v.producto.tigv.$error){
            return 'is-danger'


        }
        return ''
      }

    }

  }

  export default mixin
