# Sistema de Facturación Smartek

## Descripción
Sistema completo de facturación desarrollado en React que permite gestionar clientes, productos y facturas con soporte para múltiples monedas y cálculo automático de IVA.

## Características Principales
- **Gestión de Clientes**: Crear, editar y eliminar información de clientes
- **Gestión de Productos**: Administrar catálogo de productos con precios, stock y moneda
- **Facturación Multi-moneda**: Crear facturas en Dólares (USD) o Bolívares (VES)
- **Cálculo Automático de IVA**: IVA configurable por factura con desglose detallado
- **Dashboard**: Vista general con estadísticas y facturas recientes
- **Base de Datos**: Utiliza Trickle Database para persistencia de datos

## Estructura del Proyecto
```
/
├── index.html              # Página principal
├── app.js                  # Aplicación principal y navegación
├── components/
│   ├── Sidebar.js          # Navegación lateral
│   ├── Header.js           # Encabezado de página
│   ├── Dashboard.js        # Panel de control
│   ├── ClientManager.js    # Gestión de clientes
│   ├── ProductManager.js   # Gestión de productos
│   ├── InvoiceManager.js   # Gestión de facturas
│   └── InvoiceForm.js      # Formulario de nueva factura
├── utils/
│   └── database.js         # Utilidades de base de datos
└── trickle/
    └── notes/
        └── README.md       # Documentación del proyecto
```

## Uso
1. **Inicio**: El dashboard muestra estadísticas generales del sistema
2. **Clientes**: Registrar y gestionar información de clientes
3. **Productos**: Agregar productos con precios, stock y moneda (USD/VES)
4. **Facturas**: Crear facturas seleccionando cliente, productos, moneda e IVA
5. **Gestión**: Ver, filtrar y actualizar estado de facturas con información de moneda

## Características Avanzadas
- **Soporte Multi-moneda**: Dólares (USD) y Bolívares (VES)
- **Conversión Automática**: Tasa de cambio del BCV actualizada cada 30 minutos
- **Conversor en Tiempo Real**: Herramienta de conversión USD/VES integrada
- **IVA Configurable**: Porcentaje de IVA ajustable por factura
- **Desglose Detallado**: Subtotal, IVA y total claramente separados
- **Visualización Dual**: Precios mostrados en ambas monedas automáticamente

## Base de Datos
El sistema utiliza tres tipos de objetos principales:
- `client`: Información de clientes
- `product`: Catálogo de productos con moneda
- `invoice`: Facturas con desglose de IVA y moneda

## Fecha de Creación
Diciembre 2025