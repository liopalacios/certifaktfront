import util from "../util";
import axios from 'axios'

const doGet = (context, url, cbResolve)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {
    context.$http.get(url, {headers}).then((response) => {

      if(cbResolve)
        cbResolve()

      resolve(response.data)

    }).catch(error => {
      console.log(error)
      if(error.response)
      {
        util.showNotification(context,error.response.data.mensaje,'error')

        reject(error.response)
      }
      else reject(error)

    });
  })
}


const doPost = (context, url,body, cbResolve)=>{
  const headers = util.getAuthHeader()
  console.log(headers)
  return new Promise((resolve, reject) => {

    context.$http.post(url, body, {headers}).then((response) => {

      if(cbResolve)
        cbResolve()

      resolve(response.data)

    }).catch(error => {
      if(error.response)
      {
        if (error.response.data.mensaje) {
          util.showNotification(context,error.response.data.mensaje,'error')
        }

        if (error.response.data.message) {
          util.showNotification(context,error.response.data.message,'error')
        }

        reject(error.response)
      }
      else reject(error)

    });
  })
}

const doPostJson = (context, url,data, cbResolve)=>{
  const headers = util.getAuthHeaderJson()

  return new Promise((resolve, reject) => {

      axiosJson.post(base+url, data ,{headers}).then((response) => {
        if(cbResolve)
          cbResolve()
          resolve(response.data)
      }).catch(error => {
        console.log(error)
        if(error.response)
        {
          util.showNotification(context,error.response.data.mensaje,'error')
          reject(error.response)
        }
        else reject(error)

      });

  })
}

const base = __API__
const axiosLogin = axios.create({
  baseURL: base,
  timeout: 10000,
})
const axiosJson = axios.create({
  baseURL: base,
  timeout: 180000,
})

const doPostWithHeaders = (context, url,body, headers)=>{

  return new Promise((resolve, reject) => {

    axiosLogin.post(base+url, body ,{headers}).then((response) => {

      if(response)
        resolve(response.data)

    }).catch(error => {
      console.log(error)
      if(error.response)
      {
        if(error.response.data.error=='invalid_grant')
          util.showNotification(context,'Usuario o clave inválidos.','error')

        reject(error.response)
      }
      else reject(error)

    });
  })
}

const doPut = (context, url,body, cbResolve)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {

    context.$http.put(url, body ,{headers}).then((response) => {

      if(cbResolve)
        cbResolve()

      resolve(response.data)

    }).catch(error => {
      console.log(error)
      if(error.response)
      {
        util.showNotification(context,error.response.data.mensaje,'error')
        reject(error.response)
      }
      else reject(error)

    });
  })
}


const doPatch = (context, url,body, cbResolve)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {

    context.$http.patch(url, body ,{headers}).then((response) => {

      if(cbResolve)
        cbResolve()

      resolve(response.data)

    }).catch(error => {
      console.log(error)
      if(error.response)
      {
        util.showNotification(context,error.response.data.mensaje,'error')
        reject(error.response)
      }
      else reject(error)

    });
  })
}


const doDelete = (context, url, cbResolve)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {

    context.$http.delete(url ,{headers}).then((response) => {

      if(cbResolve)
        cbResolve()

      resolve(response.data)

    }).catch(error => {
      console.log(error)
      if(error.response)
      {
        util.showNotification(context,error.response.data.mensaje,'error')
        reject(error.response)
      }
      else reject(error)

    });
  })
}



const doGetDonwload = (context, url, nameFile ,cbResolve)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {

    context.$http.get(url, {headers, responseType: 'blob'}).then((response) => {

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${nameFile}`);
      document.body.appendChild(link);
      link.click();
      resolve()

    }).catch(error => {
      console.log(error)
      if(error.response)
      {

        util.showNotification(context,"Ocurrió un error al descargar el archivo",'error')
        var reader = new FileReader();
        reader.onload = function() {
          util.showNotification(context,reader.result.message,'error')
          console.log(JSON.parse(reader.result));
        }
        reader.readAsText(error.response.data);

        reject(error)
      }
      else reject(error)

    });

  })
}



const doPostGetBlob = (context, url, body)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {

    context.$http.post(url, body, {headers, responseType: 'blob'}).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
      resolve(url)

    }).catch(error => {
      console.log(error)
      if(error.response)
      {

        util.showNotification(context,"Comprobante no encontrado",'error')

        reject(error)
      }
      else reject(error)

    });

  })
}


const doGetGetBlob = (context, url)=>{
  const headers = util.getAuthHeader()
  return new Promise((resolve, reject) => {
    context.$http.get(url, {headers, responseType: 'blob'}).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
      resolve(url)
    }).catch(error => {
      console.log(error)
      if(error.response)
      {
        util.showNotification(context,"Comprobante no encontrado",'error')
        reject(error)
      }
      else reject(error)
    });
  })
}

export default {
  doGet,
  doPost,
  doPostJson,
  doGetDonwload,
  doPostWithHeaders,
  doPut,
  doPatch,
  doDelete,

  doPostGetBlob,
  doGetGetBlob
};
