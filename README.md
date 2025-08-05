# Simulador de Pedido de Comida Rápida

## Descripción
Simulador interactivo de pedido de comida rápida desarrollado con JavaScript vanilla. Permite a los usuarios seleccionar productos, gestionar cantidades en el carrito y realizar pedidos con una experiencia de usuario moderna y atractiva.

## Características Implementadas

### ✅ Cards de Productos Completas
- **Título**: Nombre descriptivo del producto
- **Imagen**: Emoji representativo del producto
- **Descripción**: Información detallada de cada producto
- **Precio**: Formateado con separadores de miles
- **Botón de agregar**: Posicionado debajo de toda la información
- **Diseño compacto**: Cards más pequeñas y eficientes

### ✅ Manejo de Unidades en el Carrito
- **Botones + y -**: Para incrementar/decrementar cantidades
- **Control de cantidades**: Evita carritos infinitos
- **Eliminación completa**: Botón de eliminar para quitar productos
- **Cálculo correcto**: Total considera cantidades de cada producto
- **Carrito compacto**: Diseño más pequeño y eficiente

### ✅ Proceso de Checkout Completo
- **Resumen detallado**: Muestra todos los productos con cantidades
- **Cálculo de totales**: Precio por cantidad de cada producto
- **Mensaje informativo**: Tiempo estimado de entrega
- **Limpieza automática**: Carrito se vacía después de confirmar

### ✅ Opciones de Pago
- **💵 Efectivo**: Pago en efectivo al recibir el pedido
- **🏦 Transferencia**: Pago por transferencia bancaria
- **Validación**: Selección obligatoria del método de pago

### ✅ Formulario de Envío
- **Nombre completo**: Campo obligatorio
- **Teléfono**: Campo obligatorio para contacto
- **Dirección**: Campo obligatorio para entrega
- **Referencias**: Campo opcional para ubicación
- **Validación**: Verificación de campos obligatorios

### ✅ SweetAlert2 Integrado
- **Alertas modernas**: Reemplaza los mensajes básicos del navegador
- **Confirmaciones interactivas**: Para acciones importantes como vaciar carrito
- **Notificaciones toast**: Para acciones rápidas como agregar productos
- **Diseño atractivo**: Alertas con iconos, colores y animaciones
- **Formularios integrados**: Para datos de pago y envío

### ✅ Requisitos del Curso Cumplidos
- **2 archivos JS**: `main.js` y `utils.js`
- **JSON y fetch**: Carga de datos desde `data.json`
- **Arrays de objetos**: Conversión a JSON
- **Estructura de archivos**: Organización en carpetas
- **DOM y Eventos**: Manipulación completa del DOM
- **Circuito de información**: Flujo completo de datos
- **Try-catch-finally**: Manejo de errores en fetch
- **Sin prompts/alerts**: Interfaz moderna con SweetAlert2

## Estructura del Proyecto
```
Javascript/
├── index.html          # Página principal
├── js/
│   ├── main.js        # Lógica principal de la aplicación
│   ├── utils.js       # Funciones utilitarias
│   └── data.json      # Datos de productos
├── styles/
│   └── styles.css     # Estilos de la aplicación
└── README.md          # Documentación
```

## Funcionalidades

### Menú de Productos
- Cards informativas con imagen, título, descripción y precio
- Botones de agregar al carrito
- Diseño responsive y compacto

### Carrito de Compras
- Manejo de unidades con botones + y -
- Eliminación individual de productos
- Cálculo automático del total
- Persistencia en localStorage
- Diseño compacto y eficiente

### Proceso de Compra Completo
1. **Validación de carrito**: Verifica que haya productos
2. **Selección de pago**: Efectivo o transferencia
3. **Formulario de envío**: Datos de contacto y dirección
4. **Resumen final**: Confirmación con todos los datos
5. **Confirmación**: Mensaje de éxito con tiempo de entrega

### Alertas y Notificaciones
- **SweetAlert2**: Librería para alertas modernas
- **Notificaciones toast**: Para acciones rápidas
- **Confirmaciones**: Para acciones importantes
- **Formularios integrados**: Para datos de pago y envío
- **Mensajes de error**: Con manejo de errores

## Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsive
- **JavaScript ES6+**: Lógica de la aplicación
- **Fetch API**: Carga de datos JSON
- **LocalStorage**: Persistencia de datos
- **SweetAlert2**: Alertas y notificaciones modernas

## Instalación y Uso
1. Clonar o descargar el proyecto
2. Abrir `index.html` en un navegador web
3. Seleccionar productos del menú
4. Gestionar cantidades en el carrito
5. Confirmar el pedido con las alertas interactivas
6. Seleccionar método de pago
7. Completar datos de envío
8. Confirmar pedido final

## Librerías Externas
- **[SweetAlert2](https://sweetalert2.github.io/)**: Para alertas y notificaciones modernas

## Autor
**Lorenzo Píccolo** - Proyecto para curso de JavaScript

## Notas de Desarrollo
- Proyecto desarrollado siguiendo las mejores prácticas de JavaScript
- Interfaz intuitiva y fácil de usar
- Código modular y mantenible
- Cumple con todos los requisitos del curso
- Integración de librerías externas para mejorar UX
- Proceso de checkout completo y profesional
