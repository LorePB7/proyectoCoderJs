// Variable global para el menú de productos
let menu = [];

// Si hay un carrito guardado, lo traigo. Si no, arranco con uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Historial de pedidos
let historialPedidos = JSON.parse(localStorage.getItem("historialPedidos")) || [];

// Referencias a los elementos del HTML
const menuContainer = document.getElementById("menu-container");
const carritoContainer = document.getElementById("carrito-container");
const totalContainer = document.getElementById("total-container");
const mensajeDiv = document.getElementById("mensaje");
const confirmarBtn = document.getElementById("confirmar-btn");
const vaciarBtn = document.getElementById("vaciar-btn");
const historialBtn = document.getElementById("historial-btn");

// Cargar productos desde JSON usando fetch
async function cargarProductos() {
  try {
    const response = await fetch('js/data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    menu = data.productos;
    renderMenu();
  } catch (error) {
    console.error('Error cargando productos:', error);
    mostrarSweetAlert("Error cargando el menú", "Usando datos por defecto.", "error");
    // Datos por defecto en caso de error
    menu = [
      { 
        id: 1, 
        nombre: "Hamburguesa Clásica", 
        descripcion: "Hamburguesa de carne con lechuga, tomate, cebolla y queso cheddar",
        precio: 8000,
        imagen: "🍔"
      },
      { 
        id: 2, 
        nombre: "Papas Fritas", 
        descripcion: "Papas fritas crujientes con sal marina",
        precio: 3000,
        imagen: "🍟"
      },
      { 
        id: 3, 
        nombre: "Gaseosa", 
        descripcion: "Bebida gaseosa de 500ml a elección (Coca-Cola, Sprite, Fanta)",
        precio: 2500,
        imagen: "🥤"
      },
      { 
        id: 4, 
        nombre: "Postre Helado", 
        descripcion: "Helado de vainilla con salsa de chocolate y granas",
        precio: 2000,
        imagen: "🍦"
      },
      { 
        id: 5, 
        nombre: "Combo Completo", 
        descripcion: "Hamburguesa + Papas + Bebida + Postre (Ahorrás $1500)",
        precio: 12000,
        imagen: "🍽️"
      },
    ];
    renderMenu();
  } finally {
    // Siempre renderizar el carrito al final
    renderCarrito();
  }
}

// Muestra el menú de productos en pantalla con cards completas
function renderMenu() {
  menuContainer.innerHTML = "";
  menu.forEach(producto => {
    const prodDiv = document.createElement("div");
    prodDiv.className = "producto-card";
    prodDiv.innerHTML = `
      <div class="producto-imagen">${producto.imagen}</div>
      <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <p class="precio">$${producto.precio.toLocaleString()}</p>
        <button class="agregar-btn" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    `;
    // Botón para agregar el producto al carrito
    prodDiv.querySelector(".agregar-btn").addEventListener("click", () => agregarAlCarrito(producto.id));
    menuContainer.appendChild(prodDiv);
  });
}

// Agrega un producto al carrito con manejo de unidades
function agregarAlCarrito(id) {
  const producto = menu.find(p => p.id === id);
  if (producto) {
    // Busco si el producto ya existe en el carrito
    const productoEnCarrito = carrito.find(item => item.id === id);
    
    if (productoEnCarrito) {
      // Si ya existe, incremento la cantidad
      productoEnCarrito.cantidad++;
    } else {
      // Si no existe, lo agrego con cantidad 1
      carrito.push({
        ...producto,
        cantidad: 1
      });
    }
    
    guardarCarrito();
    renderCarrito();
    mostrarSweetAlert("¡Producto agregado!", `${producto.nombre} agregado al carrito`, "success");
  }
}

// Muestra el contenido del carrito en pantalla con manejo de unidades
function renderCarrito() {
  carritoContainer.innerHTML = "";
  if (carrito.length === 0) {
    carritoContainer.innerHTML = "<em>El carrito está vacío.</em>";
    totalContainer.textContent = "";
    return;
  }
  
  carrito.forEach((producto, i) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "carrito-item";
    itemDiv.innerHTML = `
      <div class="item-info">
        <div class="item-imagen">${producto.imagen}</div>
        <div class="item-details">
          <h4>${producto.nombre}</h4>
          <p class="item-precio">$${producto.precio.toLocaleString()}</p>
        </div>
      </div>
      <div class="item-controles">
        <button class="cantidad-btn" data-index="${i}" data-action="restar">-</button>
        <span class="cantidad">${producto.cantidad}</span>
        <button class="cantidad-btn" data-index="${i}" data-action="sumar">+</button>
        <button class="eliminar-btn" data-index="${i}">🗑️</button>
      </div>
    `;
    
    // Event listeners para los botones de cantidad
    itemDiv.querySelectorAll(".cantidad-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        const action = e.target.dataset.action;
        if (action === "sumar") {
          incrementarCantidad(index);
        } else if (action === "restar") {
          decrementarCantidad(index);
        }
      });
    });
    
    // Event listener para el botón de eliminar
    itemDiv.querySelector(".eliminar-btn").addEventListener("click", () => quitarDelCarrito(i));
    
    carritoContainer.appendChild(itemDiv);
  });
  
  totalContainer.textContent = `Total: $${calcularTotal().toLocaleString()}`;
}

// Incrementa la cantidad de un producto
function incrementarCantidad(index) {
  carrito[index].cantidad++;
  guardarCarrito();
  renderCarrito();
}

// Decrementa la cantidad de un producto
function decrementarCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    // Si la cantidad llega a 0, elimino el producto
    quitarDelCarrito(index);
    return;
  }
  guardarCarrito();
  renderCarrito();
}

// Saca un producto del carrito según su posición
function quitarDelCarrito(index) {
  const productoEliminado = carrito[index];
  carrito.splice(index, 1);
  guardarCarrito();
  renderCarrito();
  mostrarSweetAlert("Producto eliminado", `${productoEliminado.nombre} eliminado del carrito`, "warning");
}

// Suma los precios de todos los productos del carrito considerando cantidades
function calcularTotal() {
  return carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
}

// Guarda el carrito en el localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Guarda el historial de pedidos en el localStorage
function guardarHistorial() {
  localStorage.setItem("historialPedidos", JSON.stringify(historialPedidos));
}

// Función para mostrar SweetAlert2
function mostrarSweetAlert(titulo, mensaje, tipo = "info") {
  const iconos = {
    success: "success",
    error: "error", 
    warning: "warning",
    info: "info"
  };
  
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: iconos[tipo] || "info",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
}

// Función para mostrar opciones de pago
async function mostrarOpcionesPago() {
  const { value: metodoPago } = await Swal.fire({
    title: 'Método de Pago',
    text: 'Seleccioná cómo querés pagar:',
    icon: 'question',
    input: 'radio',
    inputOptions: {
      'efectivo': '💵 Efectivo',
      'transferencia': '🏦 Transferencia'
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Tenés que seleccionar un método de pago'
      }
    },
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar'
  });

  if (metodoPago) {
    return metodoPago;
  }
  return null;
}

// Función para mostrar formulario de envío
async function mostrarFormularioEnvio() {
  const { value: formValues } = await Swal.fire({
    title: 'Datos de Envío',
    html: `
      <div style="text-align: left;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre completo:</label>
          <input id="nombre" class="swal2-input" placeholder="Tu nombre">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Teléfono:</label>
          <input id="telefono" class="swal2-input" placeholder="Tu teléfono">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Dirección:</label>
          <input id="direccion" class="swal2-input" placeholder="Tu dirección">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Referencias:</label>
          <input id="referencias" class="swal2-input" placeholder="Cerca de... (opcional)">
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById('nombre').value;
      const telefono = document.getElementById('telefono').value;
      const direccion = document.getElementById('direccion').value;
      const referencias = document.getElementById('referencias').value;
      
      if (!nombre || !telefono || !direccion) {
        Swal.showValidationMessage('Completá todos los campos obligatorios');
        return false;
      }
      
      return {
        nombre,
        telefono,
        direccion,
        referencias
      };
    }
  });

  return formValues;
}

// Función para generar ID único de pedido
function generarIdPedido() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para mostrar historial de pedidos
async function mostrarHistorial() {
  if (historialPedidos.length === 0) {
    await Swal.fire({
      title: 'Historial Vacío',
      text: 'Aún no tenés pedidos en tu historial',
      icon: 'info',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  const pedidosHTML = historialPedidos.map(pedido => `
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin: 10px 0; background: #f9f9f9;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>Pedido #${pedido.id}</strong><br>
          <small>${new Date(pedido.fecha).toLocaleString('es-AR')}</small>
        </div>
        <div style="text-align: right;">
          <strong>$${pedido.total.toLocaleString()}</strong><br>
          <small>${pedido.metodoPago === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia'}</small>
        </div>
      </div>
      <div style="margin-top: 8px;">
        <small><strong>Cliente:</strong> ${pedido.datosEnvio.nombre}</small><br>
        <small><strong>Dirección:</strong> ${pedido.datosEnvio.direccion}</small>
      </div>
    </div>
  `).join('');

  const { value: pedidoSeleccionado } = await Swal.fire({
    title: 'Historial de Pedidos',
    html: `
      <div style="max-height: 400px; overflow-y: auto;">
        ${pedidosHTML}
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Ver Comprobante',
    cancelButtonText: 'Cerrar',
    input: 'radio',
    inputOptions: historialPedidos.reduce((acc, pedido) => {
      acc[pedido.id] = `Pedido #${pedido.id} - $${pedido.total.toLocaleString()}`;
      return acc;
    }, {}),
    inputValidator: (value) => {
      if (!value) {
        return 'Seleccioná un pedido para ver el comprobante'
      }
    }
  });

  if (pedidoSeleccionado) {
    mostrarComprobante(pedidoSeleccionado);
  }
}

// Función para mostrar comprobante de compra
function mostrarComprobante(idPedido) {
  const pedido = historialPedidos.find(p => p.id === idPedido);
  if (!pedido) return;

  const productosHTML = pedido.productos.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
    </div>
  `).join('');

  Swal.fire({
    title: `Comprobante #${pedido.id}`,
    html: `
      <div style="text-align: left; max-width: 400px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #28a745;">🍔 Comida Rápida</h4>
          <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString('es-AR')}</p>
          <p style="margin: 5px 0;"><strong>Pedido:</strong> #${pedido.id}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <h5 style="margin: 0 0 10px 0;">📋 Productos:</h5>
          ${productosHTML}
        </div>
        
        <div style="background: #d4edda; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
          <h4 style="margin: 0; text-align: center; color: #155724;">
            Total: $${pedido.total.toLocaleString()}
          </h4>
        </div>
        
        <div style="background: #e3f2fd; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
          <h5 style="margin: 0 0 8px 0;">👤 Datos de Envío:</h5>
          <p style="margin: 5px 0;"><strong>Cliente:</strong> ${pedido.datosEnvio.nombre}</p>
          <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${pedido.datosEnvio.telefono}</p>
          <p style="margin: 5px 0;"><strong>Dirección:</strong> ${pedido.datosEnvio.direccion}</p>
          ${pedido.datosEnvio.referencias ? `<p style="margin: 5px 0;"><strong>Referencias:</strong> ${pedido.datosEnvio.referencias}</p>` : ''}
        </div>
        
        <div style="background: #fff3cd; padding: 10px; border-radius: 8px;">
          <h5 style="margin: 0 0 8px 0;">💳 Método de Pago:</h5>
          <p style="margin: 5px 0;">${pedido.metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia'}</p>
        </div>
      </div>
    `,
    width: 500,
    confirmButtonText: 'Descargar PDF',
    showCancelButton: true,
    cancelButtonText: 'Cerrar'
  }).then((result) => {
    if (result.isConfirmed) {
      descargarComprobantePDF(pedido);
    }
  });
}

// Función para descargar comprobante como PDF (simulado)
function descargarComprobantePDF(pedido) {
  // En un proyecto real, aquí se generaría un PDF real
  // Por ahora simulamos la descarga
  const contenido = `
    COMPROBANTE DE COMPRA
    =====================
    
    Pedido: #${pedido.id}
    Fecha: ${new Date(pedido.fecha).toLocaleString('es-AR')}
    
    PRODUCTOS:
    ${pedido.productos.map(item => `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}`).join('\n')}
    
    TOTAL: $${pedido.total.toLocaleString()}
    
    DATOS DE ENVÍO:
    Cliente: ${pedido.datosEnvio.nombre}
    Teléfono: ${pedido.datosEnvio.telefono}
    Dirección: ${pedido.datosEnvio.direccion}
    ${pedido.datosEnvio.referencias ? `Referencias: ${pedido.datosEnvio.referencias}` : ''}
    
    MÉTODO DE PAGO: ${pedido.metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia'}
  `;

  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprobante-${pedido.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  mostrarSweetAlert("Comprobante descargado", "El archivo se guardó en tu dispositivo", "success");
}

// Proceso de checkout más elaborado con SweetAlert2
async function procesarCheckout() {
  if (carrito.length === 0) {
    mostrarSweetAlert("Carrito vacío", "Agregá productos antes de confirmar el pedido", "error");
    return;
  }
  
  // Paso 1: Seleccionar método de pago
  const metodoPago = await mostrarOpcionesPago();
  if (!metodoPago) return;
  
  // Paso 2: Completar formulario de envío
  const datosEnvio = await mostrarFormularioEnvio();
  if (!datosEnvio) return;
  
  // Crear resumen del pedido
  const resumen = carrito.map(item => 
    `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}`
  ).join('\n');
  
  const total = calcularTotal();
  
  // Mostrar confirmación final con SweetAlert2
  const result = await Swal.fire({
    title: '¿Confirmar pedido?',
    html: `
      <div style="text-align: left; margin: 20px 0;">
        <h4>Resumen del pedido:</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
          ${resumen.split('\n').map(item => `<div>${item}</div>`).join('')}
        </div>
        <div style="font-weight: bold; font-size: 1.2em; color: #28a745; margin-top: 15px;">
          Total: $${total.toLocaleString()}
        </div>
        <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 8px;">
          <strong>Método de pago:</strong> ${metodoPago === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia'}<br>
          <strong>Enviar a:</strong> ${datosEnvio.nombre}<br>
          <strong>Dirección:</strong> ${datosEnvio.direccion}
        </div>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '¡Confirmar pedido!',
    cancelButtonText: 'Cancelar'
  });
  
  if (result.isConfirmed) {
    // Crear el pedido y agregarlo al historial
    const nuevoPedido = {
      id: generarIdPedido(),
      fecha: new Date().toISOString(),
      productos: [...carrito],
      total: total,
      metodoPago: metodoPago,
      datosEnvio: datosEnvio
    };
    
    historialPedidos.unshift(nuevoPedido); // Agregar al inicio
    guardarHistorial();
    
    // Mostrar mensaje de éxito
    await Swal.fire({
      title: '¡Pedido Confirmado! 🍔',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 3em; margin: 20px 0;">🚀</div>
          <p>Tu pedido está siendo preparado</p>
          <p><strong>Tiempo estimado: 25-30 minutos</strong></p>
          <p style="margin-top: 20px; color: #28a745;">¡Gracias por elegirnos!</p>
          <p style="margin-top: 10px; font-size: 0.9em; color: #6c757d;">
            Pedido #${nuevoPedido.id}
          </p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: '¡Perfecto!'
    });
    
    // Limpiar carrito después de confirmar
    carrito = [];
    guardarCarrito();
    renderCarrito();
  }
}

// Cuando el usuario confirma la compra
confirmarBtn.addEventListener("click", procesarCheckout);

// Botón para vaciar todo el carrito con confirmación
vaciarBtn.addEventListener("click", async () => {
  if (carrito.length === 0) {
    mostrarSweetAlert("Carrito vacío", "No hay productos para vaciar", "info");
    return;
  }
  
  const result = await Swal.fire({
    title: '¿Vaciar carrito?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  });
  
  if (result.isConfirmed) {
    carrito = [];
    guardarCarrito();
    renderCarrito();
    mostrarSweetAlert("Carrito vaciado", "Todos los productos fueron removidos", "success");
  }
});

// Botón para ver historial de pedidos
historialBtn.addEventListener("click", mostrarHistorial);

// Inicializar la aplicación
cargarProductos();
