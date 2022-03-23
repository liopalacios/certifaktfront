import Methods from '../../../../api/methods';
import qs from 'qs';
import dateformat from 'dateformat';
import {
  mapGetters
} from 'vuex';

var mixinchart = {
  methods: {
    getPaymentByMonth( ) {
      return new Promise((resolve, reject) => { 
          const url = `api/get-payments-by-month`
          Methods.doGet(this, url).then(data => {
            console.log(data)
            this.listPaymentByDay = data.lista
            this.seriesdata = []
            for (var j=0; j<data.lista.length; j++) {
              //tarr.push(data[j]);
              this.seriesdata.push(data.lista[j][1])
            }                
            resolve(data)
          }).catch(error => {
            reject(error)
          });
      });

    },
    getPaymentByDay( ) {
      const params = qs.stringify({          
        diff: this.diff
      })
        return new Promise((resolve, reject) => { 
            const url = `api/get-payments-by-day?${params}`
            Methods.doGet(this, url).then(data => {                  
                this.listPaymentByDay = data.lista
                this.seriesdata = []
                for (var j=0; j<data.lista.length; j++) {
                  //tarr.push(data[j]);
                  //this.seriesdata.push(data.lista[j][1])
                }                
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
    },
      getPaymentByType() {
        return new Promise((resolve, reject) => { 
            const url = 'api/get-payments-by-type'
            Methods.doGet(this, url).then(data => {                
                //this.listPaymentByType = data.lista
                
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByTypeMonth() {
        return new Promise((resolve, reject) => { 
            const url = 'api/get-payments-by-type-month'
            Methods.doGet(this, url).then(data => {                
                //this.listPaymentByType = data.lista
                
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByTypeAndState() {
        return new Promise((resolve, reject) => { 
            const url = 'api/get-payments-by-type-state'
            Methods.doGet(this, url).then(data => {
                //this.generarExcel(data.comprobantesList)
                //console.log(data)            
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByTypeAndStateMonth() {
        return new Promise((resolve, reject) => { 
            const url = 'api/get-payments-by-type-state-month'
            Methods.doGet(this, url).then(data => {
                //this.generarExcel(data.comprobantesList)
                //console.log(data)            
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByDateAndType() {
        const params = qs.stringify({          
          diff: this.diff
        })
        return new Promise((resolve, reject) => { 
            const url = `api/get-payments-by-date-and-type?${params}`
            Methods.doGet(this, url).then(data => {
                              
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByDateAndTypeMonth() {        
        return new Promise((resolve, reject) => { 
            const url = `api/get-payments-by-date-and-type-month`
            Methods.doGet(this, url).then(data => {
                              
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByUserAndDay() {
        const params = qs.stringify({          
          diff: this.diff
        })
        return new Promise((resolve, reject) => { 
            const url = `api/get-payments-by-user-and-day?${params}`
            Methods.doGet(this, url).then(data => {
                //this.generarExcel(data.comprobantesList)
                console.log(data)
                //this.listPaymentByUserAndDay = data.lista                
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      },
      getPaymentByUserAndMonth() {        
        return new Promise((resolve, reject) => { 
            const url = `api/get-payments-by-user-and-month`
            Methods.doGet(this, url).then(data => {
                //this.generarExcel(data.comprobantesList)
                console.log(data)
                //this.listPaymentByUserAndDay = data.lista                
                resolve(data)
              }).catch(error => {
                reject(error)
              });
        });
      }
    }
}

export default mixinchart