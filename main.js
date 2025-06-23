// Menú de productos disponibles
const menu = [
  { id: 1, nombre: "Hamburguesa", precio: 8000 },
  { id: 2, nombre: "Papas Fritas", precio: 3000 },
  { id: 3, nombre: "Gaseosa", precio: 2500 },
  { id: 4, nombre: "Postre", precio: 2000 },
  { id: 5, nombre: "Combo Completo (hambur,papas,bebida y postre)", precio: 12000 },
];

// Cantidad de productos en el menú
const cantidadProductosMenu = 5;

// Variable para guardar el pedido del usuario
let pedido = [];

// Muestra el menú al usuario
function mostrarMenu() {
  let mensaje = "Lista de precios:\n";
  for (const item of menu) {
    mensaje += `${item.id}. ${item.nombre} - $${item.precio}\n`;
  }
  mensaje += "0. Finalizar pedido";
  return mensaje;
}

// Agrega un producto al pedido según el id
function agregarProducto(idProducto) {
  let productoEncontrado = null;
  for (const item of menu) {
    if (item.id === idProducto) {
      productoEncontrado = item;
      break;
    }
  }
  
  if (productoEncontrado) {
    pedido.push(productoEncontrado);
    alert(`${productoEncontrado.nombre} agregado al pedido.`);
  } else {
    alert("Producto no encontrado.");
  }
}

// Calcula el total a pagar
function calcularTotal(pedido) {
  let total = 0;
  for (const producto of pedido) {
    total += producto.precio;
  }
  return total;
}

// Muestra un resumen del pedido
function mostrarResumen() {
  if (!pedido[0]) {
    alert("No has agregado productos al pedido.");
    return;
  }

  let resumen = "Resumen de tu pedido:\n";
  let contador = 1;
  for (const producto of pedido) {
    resumen += `${contador}. ${producto.nombre} - $${producto.precio}\n`;
    contador++;
  }

  let total = calcularTotal(pedido);
  resumen += `\nTotal a pagar: $${total}`;
  alert(resumen);
}

// Simulador principal
function iniciarSimulador() {
  alert("¡Bienvenido al simulador de comida rápida!");

  let opcion;
  do {
    opcion = parseInt(prompt(mostrarMenu()));
    if (opcion > 0 && opcion <= cantidadProductosMenu) {
      agregarProducto(opcion);
    } else if (opcion === 0 && !pedido[0]) {
      // Si no hay productos, preguntar si quiere volver al menú
      const volver = confirm("No has agregado productos al pedido. ¿Querés volver al menú?");
      if (volver) {
        opcion = -1;
      } else {
        alert("Pedido cancelado.");
        return;
      }
    } else if (opcion !== 0) {
      alert("Opción inválida. Por favor, seleccioná un número del menú.");
    }
  } while (opcion !== 0 || !pedido[0]);

  mostrarResumen();

  if (!pedido[0]) {
    return;
  }

  const confirmar = confirm("¿Deseás confirmar tu pedido?");
  if (confirmar) {
    alert("¡Gracias por tu compra! Tu pedido está en camino 🍔🚀");
  } else {
    alert("Pedido cancelado.");
  }
}

// Inicia el simulador
iniciarSimulador();
