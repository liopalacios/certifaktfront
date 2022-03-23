
const checkAuth = () => {
  var token=localStorage.getItem('token')
  if(!token){
    localStorage.clear()
    return false
  }
  return true
}

const getAuthHeader = () =>{
  if(localStorage.getItem('token')){

    const expiresDate = new Date(parseInt(localStorage.getItem('expires')));
    const now = new Date();
    if (expiresDate > now) {
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    } else {
      localStorage.clear();
      window.location.href = '';
    }
  }
  else return {}

}

const getAuthHeaderJson = () =>{
  if(localStorage.getItem('token')){
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': '*/*'
    }
  }
  else return {}

}

const getToken = () => {
  return localStorage.getItem('token')
}

const getTokenIfExist = () => {
 if (localStorage.getItem('token')) {
   return localStorage.getItem('token')
 } else {
   localStorage.clear()
   window.location.href = "/#/login"
 }

}

const getUser= () =>{
  if(checkAuth()){
    var user=localStorage.getItem('user')
    return JSON.parse(user);
  }
 else return null
}
const getCompany= () =>{
  if(checkAuth()){
    var company=localStorage.getItem('company')
    return JSON.parse(company);
  }
 else return null
}
const showNotification = (context, message, type) => {

  if(type=='success')
  {
    context.$buefy.toast.open({
      duration: 3000,
      message,
      type: 'is-success'
    })
  }

  if(type=='info')
  {
    context.$buefy.toast.open({
      duration: 3000,
      message,
      type: 'is-info'
    })
  }


  if(type=='error')
  {
    context.$buefy.toast.open({
      duration: 3000,
      message,
      type: 'is-danger'
    })
  }


  if(type=='warning')
  {
    context.$buefy.toast.open({
      duration: 3000,
      message,
      type: 'is-warning'
    })
  }

}

const getUnidades = ()=>{
  return JSON.parse(localStorage.getItem('misunidades'))
}

const getNombreDocumentoByTipo=(tipo)=>{
  if (tipo=='01') return 'Factura'
  if (tipo=='03') return 'Boleta'
  if (tipo=='07') return 'Nota de crédito'
  if (tipo=='08') return 'Nota de débito'
  if (tipo=='20') return 'Retención'
  if (tipo=='40') return 'Percepción'
  if (tipo=='09') return 'Guía de Remisión'

  return 'Desconocido'
}

export default {
  checkAuth,
  getAuthHeader,
  getAuthHeaderJson,
  getToken,
  getTokenIfExist,
  getUser,
  getCompany,
  showNotification,
  getUnidades,
  getNombreDocumentoByTipo
}

