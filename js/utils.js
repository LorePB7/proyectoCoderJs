// Funciones utilitarias para el simulador de comida rápida

// Función para formatear precios con separadores de miles
export function formatearPrecio(precio) {
  return precio.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  });
}

// Función para validar que un producto existe
export function validarProducto(producto) {
  return producto && 
         producto.id && 
         producto.nombre && 
         producto.precio && 
         producto.precio > 0;
}

// Función para calcular el descuento en combos
export function calcularDescuento(precioOriginal, precioCombo) {
  const descuento = precioOriginal - precioCombo;
  const porcentaje = (descuento / precioOriginal) * 100;
  return {
    descuento: descuento,
    porcentaje: Math.round(porcentaje)
  };
}

// Función para generar un ID único para pedidos
export function generarIdPedido() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para validar el carrito
export function validarCarrito(carrito) {
  if (!Array.isArray(carrito)) {
    return false;
  }
  
  return carrito.every(item => 
    item && 
    item.id && 
    item.cantidad && 
    item.cantidad > 0
  );
}

// Función para obtener estadísticas del carrito
export function obtenerEstadisticasCarrito(carrito) {
  if (!carrito || carrito.length === 0) {
    return {
      totalProductos: 0,
      totalPrecio: 0,
      productosUnicos: 0
    };
  }
  
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const productosUnicos = carrito.length;
  
  return {
    totalProductos,
    totalPrecio,
    productosUnicos
  };
}

// Función para limpiar el localStorage
export function limpiarStorage() {
  try {
    localStorage.removeItem("carrito");
    return true;
  } catch (error) {
    console.error("Error limpiando localStorage:", error);
    return false;
  }
}

// Función para exportar el carrito como JSON
export function exportarCarrito(carrito) {
  try {
    const carritoJSON = JSON.stringify(carrito, null, 2);
    const blob = new Blob([carritoJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `carrito-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exportando carrito:", error);
    return false;
  }
} 