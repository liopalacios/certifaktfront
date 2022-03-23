export default  [
  {
    category: 'Visualizacion',
    icon: 'format-align-justify',
    expand: true,
    pages: [
      { name: 'Comprobantes', path: '/admin/comprobantes', roles: ['02','01'], icon: 'chevron-double-right' },
      { name: 'Guías', path: '/admin/guiaRemision', roles: ['02','01'], icon: 'clipboard-text' },
      { name: 'Otros', path: '/admin/otros-comprobantes', roles: ['02','01'], icon: 'file-multiple' },
      { name: 'Lista de Excels', path: '/admin/solicitudes-excel', roles: ['02','01'], icon: 'file-multiple' }
    ],
    roles: ['02','01']
  },
  {
    category: 'Emisión',
    icon: 'cards-variant',
    expand: false,
    pages: [
      { name: 'Factura', path: '/admin/comprobantes/emitir-factura', roles: ['02','01'], icon: 'playlist-plus' },
      { name: 'Boleta', path: '/admin/comprobantes/emitir-boleta', roles: ['02','01'], icon: 'playlist-plus' },
      { name: 'Nota de crédito', path: '/admin/comprobantes/emitir-nota-credito', roles: ['02','01'], icon: 'playlist-plus' },
      { name: 'Nota de débito', path: '/admin/comprobantes/emitir-nota-debito', roles: ['02','01'], icon: 'playlist-plus' },
      { name: 'Emision masiva', path: '/admin/comprobantes/emision-masiva', roles: ['02','01'], icon: 'playlist-plus' },
      { name: 'Guía de Remisión', path: '/admin/guiaRemision/guia-remitente', roles: ['02','01'], icon: 'playlist-plus' },
      /*{ name: 'Retenciones', path: '/admin/otros-comprobantes/retencion', roles: ['02','01'], icon: 'playlist-plus' },
      { name: 'Percepciones', path: '/admin/otros-comprobantes/percepcion', roles: ['02','01'], icon: 'playlist-plus' }*/
    ],
    roles: ['02','01']
  },
  {
    category: 'Graficos',
    icon: 'chart-areaspline',
    expand: false,
    pages: [
      { name: 'Diario', path: '/admin/grafica-diaria', roles: ['02','01'], icon: 'clock' },
      { name: 'Mensual', path: '/admin/grafica-mensual', roles: ['02','01'], icon: 'calendar' },
      { name: 'Manual', path: '/admin/grafica-manual', roles: ['02','01'], icon: 'cursor-pointer' }
    ],
    roles: ['02','01']
  },
  {
    category: 'Registro',
    icon: 'buffer',
    expand: false,
    pages: [
      { name: 'Productos', path: '/admin/productos', roles: ['01'], icon: 'barcode-scan' },
      { name: 'Clientes', path: '/admin/clientes', roles: ['01'], icon: 'camera-front-variant' }
    ],
    roles: ['01']
  },
  {
    category: 'Administración',
    icon: 'dns',
    expand: false,
    pages: [
      { name: 'Usuarios', path: '/admin/usuarios', roles: ['01'], icon: 'account' }
    ],
    roles: ['01']
  }
]
