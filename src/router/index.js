
import Vue from 'vue'
import Router from 'vue-router'
import Util from '../util'

//PAGES
import DefaultTemplate from '../pages/DefaultTemplate'
import Admin from '../components/Admin'
import Login from '../pages/Login'
import Consulta from '../components/Consulta'

Vue.use(Router)

const route = (path,name,meta, component, props) => {
  return {
    path,
    name,
    meta,
    component: () => import(`../components/${component}`),
    props
  }
}

const routeWithChildren = (path,name,meta, component, redirect, children) => {
  return {
    path,
    name,
    meta,
    component: () => import(`../components/${component}`),
    redirect,
    children
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      component: DefaultTemplate,
      redirect: 'admin/comprobantes',
      children:[
        {
          path: 'admin',
          component: Admin,
          redirect:'admin/comprobantes',
          children: [            
            routeWithChildren('comprobantes','admin.comprobantes', {requiresAuth: true, titulo:'Comprobantes'}, 'admin/Comprobantes','/admin/comprobantes/ver-comprobantes',
                    [
                      route('ver-comprobantes','admin.comprobantes.ver-comprobantes', {requiresAuth: true, titulo: 'Comprobantes electrónicos'}, 'admin/comprobantes/VerComprobantes'),
                      route('emision-masiva','admin.comprobantes.emision-masiva', {requiresAuth: true, titulo: 'Emision masiva'}, 'admin/comprobantes/CargaMasiva'),
                      route('emitir-factura','admin.comprobantes.emitir-factura', {requiresAuth: true, titulo: 'Emitir factura electrónica'}, 'admin/comprobantes/EmitirFactura', {isEdit: false}),
                      //emitir factura x guia---------------
                      route('emitir-factura-guia/:idGuia?','admin.comprobantes.emitir-factura-guia', {requiresAuth: true, titulo: 'Emitir factura electrónica'}, 'admin/comprobantes/EmitirFactura', {isEdit: false}),
                      //------------------------------------
                      //emitir boleta x guia---------------
                      route('emitir-boleta-guia/:idGuia?','admin.comprobantes.emitir-boleta-guia', {requiresAuth: true, titulo: 'Emitir boleta electrónica'}, 'admin/comprobantes/EmitirBoleta', {isEdit: false}),
                      //------------------------------------
                      route('emitir-boleta','admin.comprobantes.emitir-boleta', {requiresAuth: true, titulo: 'Emitir boleta electrónica'}, 'admin/comprobantes/EmitirBoleta', {isEdit: false}),
                      route('emitir-nota-credito/:id?','admin.comprobantes.emitir-nota-credito', {requiresAuth: true, titulo: 'Emitir nota de crédito electrónica'}, 'admin/comprobantes/EmitirNotaDeCredito', {isEdit: false}),
                      route('emitir-nota-debito/:id?','admin.comprobantes.emitir-nota-debito', {requiresAuth: true, titulo: 'Emitir nota de débito electrónica'}, 'admin/comprobantes/EmitirNotaDeDebito', {isEdit: false}),

                      //EDITAR COMPROBANTE
                      route('editar-factura/:idEdit','admin.comprobantes.editar-factura', {requiresAuth: true, titulo: 'Editar factura electrónica'}, 'admin/comprobantes/EmitirFactura', {isEdit: true}),
                      route('editar-boleta/:idEdit','admin.comprobantes.editar-boleta', {requiresAuth: true, titulo: 'Editar boleta electrónica'}, 'admin/comprobantes/EmitirBoleta', {isEdit: true}),
                      route('editar-nota-credito/:idEdit','admin.comprobantes.editar-nota-credito', {requiresAuth: true, titulo: 'Editar nota de crédito electrónica'}, 'admin/comprobantes/EmitirNotaDeCredito', {isEdit: true}),
                      route('editar-nota-debito/:idEdit','admin.comprobantes.editar-nota-debito', {requiresAuth: true, titulo: 'Editar nota de débito electrónica'}, 'admin/comprobantes/EmitirNotaDeDebito',{isEdit: true}),
                    ]
              ),
            routeWithChildren('guiaRemision','admin.guiaRemision', {requiresAuth: true, titulo:'Guías de remisión'}, 'admin/GuiaRemision','/admin/guiaRemision/ver-guias',
                    [
                      route('ver-guias','admin.guiaRemision.ver-guias', {requiresAuth: true, titulo: 'Guías de Remisión electrónicos'}, 'admin/guiaRemision/VerGuias'),
                      route('guia-transportista','admin.guiaRemision.guia-transportista', {requiresAuth: true, titulo: 'Emitir Guía de Remisión Transportista'}, 'admin/guiaRemision/GuiaTransportista'),
                      route('guia-remitente','admin.guiaRemision.guia-remitente', {requiresAuth: true, titulo: 'Emitir Guía de Remisión Remitente'}, 'admin/guiaRemision/GuiaRemitente'),
                      route('editar-guia/:idEdit','admin.guiaRemision.editar-guia', {requiresAuth: true, titulo: 'Editar Guia de Remisión'}, 'admin/guiaRemision/GuiaRemitente', {isEdit: true}),
                      route('anular-guia/:idAnula','admin.guiaRemision.anular-guia', {requiresAuth: true, titulo: 'Anular Guia de Remisión'}, 'admin/guiaRemision/GuiaRemitente', {isAnula: true}),
                    ]
              ),

            routeWithChildren('otros-comprobantes','admin.otrosComprobantes', {requiresAuth: true, titulo:'Otros documentos'}, 'admin/OtrosComprobantes','/admin/otros-comprobantes/ver',
              [
                route('ver','admin.otros-comprobantes.ver', {requiresAuth: true, titulo: 'Ver otros documentos'}, 'admin/otrosComprobantes/VerOtrosComprobantes'),
                route('retencion','admin.otros-comprobantes.retencion', {requiresAuth: true, titulo: 'Emitir Retención'}, 'admin/otrosComprobantes/Retenciones'),
                route('percepcion','admin.otros-comprobantes.percepcion', {requiresAuth: true, titulo: 'Emitir Percepción'}, 'admin/otrosComprobantes/Percepciones'),
                route('editar-retencion/:idEdit','admin.otros-comprobantes.editar-retencion', {requiresAuth: true, titulo: 'Editar retención electrónica'}, 'admin/otrosComprobantes/Retenciones', {isEdit: true}),
                route('editar-percepcion/:idEdit','admin.otros-comprobantes.editar-percepcion', {requiresAuth: true, titulo: 'Editar percepción electrónica'}, 'admin/otrosComprobantes/Percepciones', {isEdit: true}),
              ]
            ),

            routeWithChildren('solicitudes-excel','admin.solicitudesExcel',{requiresAuth: true, titulo: 'Solicitudes de descarga de Excels'}, 'admin/Solicitudes','/admin/solicitudes-excel/ver-excels',
              [
                route('ver-excels','admin.solicitudes-excel.ver-excels',{requiresAuth: true, titulo: 'Estados de excels'},'admin/solicitudes/VerSolicitudes')
              ]
            ),


            route('grafica-diaria','admin.chartdia', {requiresAuth: true, titulo:'Grafico Diario'}, 'admin/ChartDia'),  
            route('grafica-mensual','admin.chartmes', {requiresAuth: true, titulo:'Grafico Mensual'}, 'admin/ChartMes'),  
            route('grafica-manual','admin.chartcustomized', {requiresAuth: true, titulo:'Grafico Manual'}, 'admin/ChartCustomized'),  
            route('clientes','admin.clientes', {requiresAuth: true, titulo:'Clientes'}, 'admin/Clientes'),
            route('productos','admin.productos', {requiresAuth: true, titulo:'Productos'}, 'admin/Productos'),
            route('productos/:id/editar','admin.productos.editar', {requiresAuth: true, titulo:'Editar producto'}, 'admin/EditarProducto'),
            route('percepciones','admin.percepciones', {requiresAuth: true, titulo:'Percepciones'}, 'admin/Percepciones'),
            route('retenciones','admin.retenciones', {requiresAuth: true, titulo:'Retenciones'}, 'admin/Retenciones'),
            route('usuarios','admin.usuarios', {requiresAuth: true, titulo:'Usuarios'}, 'admin/Usuarios'),
            route('usuarios/:id/editar','admin.usuarios.editar', {requiresAuth: true, titulo:'Editar usuario'}, 'admin/EditarUsuario'),
            route('datos-principales','admin.datos-principales', {requiresAuth: true, titulo:'Datos principales'}, 'admin/DatosPrincipales'),
            route('puntos-venta','admin.puntos-venta', {requiresAuth: true, titulo:'Puntos de venta'}, 'admin/PuntosVenta'),
            route('mis-emails','admin.mis-emails', {requiresAuth: true, titulo:'Mis Emails'}, 'admin/MisEmails'),
            route('mis-emails/:id/editar','admin.mis-emails.editar', {requiresAuth: true, titulo:'Editar Email'}, 'admin/EditarEmail'),
            route('puntos-venta/:id/editar','admin.puntos-venta.editar', {requiresAuth: true, titulo:'Editar punto de venta'}, 'admin/EditarPuntoVenta'),
            route('cambio-clave','admin.cambio-clave', {requiresAuth: true, titulo:'Cambio clave'}, 'admin/Cambio'),
            route('unidad-medida','admin.unidad-medida', {requiresAuth: true, titulo:'Unidad de medida'}, 'admin/UnidadMedida'),

            route('cuentas-bancarias','admin.cuentas-bancarias', {requiresAuth: true, titulo:'Cuentas Bancarias'}, 'admin/CuentasBancarias'),
          ]
        }
      ]

    },
    {
      path: '/login/:user?/:pass?',
      name: 'login',
      meta: {titulo : 'Iniciar sesión'},
      component:Login
    },
    {
      path: '/consulta-comprobantes/:ruc?',
      name: 'consulta.comprobantes',
      meta: {titulo : 'Consulta tus comprobantes'},
      component: Consulta,
    },
    
    {
      path: '*',
      redirect: '/',
    },


  ],
  linkActiveClass: "is-active customActiveLink",
  //mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
})

router.beforeEach((to, from, next) => {
  if(!Util.checkAuth() && to.meta.requiresAuth){
    next({name:'login'})
    return
  }

  window.document.documentElement.scrollTop = 0
  window.document.title = `${to.meta.titulo} - Certifakt`
  Vue.prototype.$eventBus.$emit('close-menu')


  next()
})

export default router
