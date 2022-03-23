const monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Setiembre", "Octubre",
    "Noviembre", "Diciembre"
];

const mixin= {
    methods:{
        formatDate(date) {
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            return `${day} de ${monthNames[monthIndex]} de ${year}`
        },
        toShowMessage(campo) {
            if(campo && campo.$error){
                if(campo.numeric!=undefined && !campo.numeric){
                    return `Ingresar número válido`
                }else if(campo.decimal!=undefined && !campo.decimal){
                    return `Ingresar número decimal válido`
                }else if(campo.alphaNum!=undefined && !campo.alphaNum){
                    return `Ingresar valores alfanuméricos`
                }else if(campo.email!=undefined && !campo.email){
                    return `Ingresar correo válido`
                }else if(campo.minLength!=undefined && !campo.minLength){
                    return `Ingresar como mínimo ${campo.$params.minLength.min} caracteres`
                }else if(campo.maxLength!=undefined && !campo.maxLength){
                    return `Ingresar como máximo ${campo.$params.maxLength.max} caracteres`
                }else if(campo.minValue!=undefined && !campo.minValue){
                  return `Valor mínimo ${campo.$params.minValue.min}`
                }else if(campo.maxValue!=undefined && !campo.maxValue){
                  return `Valor máximo ${campo.$params.maxValue.max}`
                }else if(campo.isHour!=undefined && !campo.isHour){
                    return `Ingresar Hora Válida`
                }
            }
            return ""
        },
        toShowType(campo) {
            if(campo && campo.$error)
                return "is-danger"
            return ""
        },
        validarHora(value) {
            if (value==null || value.length != 8) return true;
            const regHora = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
            return regHora.test(value);
        }

    },
}

export default mixin
