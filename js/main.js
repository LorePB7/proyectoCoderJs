// Menú de productos disponibles
const menu = [
  { id: 1, nombre: "Hamburguesa", precio: 8000 },
  { id: 2, nombre: "Papas Fritas", precio: 3000 },
  { id: 3, nombre: "Gaseosa", precio: 2500 },
  { id: 4, nombre: "Postre", precio: 2000 },
  { id: 5, nombre: "Combo Completo (hambur,papas,bebida y postre)", precio: 12000 },
];

// Si hay un carrito guardado, lo traigo. Si no, arranco con uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Referencias a los elementos del HTML
const menuContainer = document.getElementById("menu-container");
const carritoContainer = document.getElementById("carrito-container");
const totalContainer = document.getElementById("total-container");
const mensajeDiv = document.getElementById("mensaje");
const confirmarBtn = document.getElementById("confirmar-btn");
const vaciarBtn = document.getElementById("vaciar-btn");

// Muestra el menú de productos en pantalla
function renderMenu() {
  menuContainer.innerHTML = "";
  menu.forEach(producto => {
    const prodDiv = document.createElement("div");
    prodDiv.innerHTML = `
      <span>${producto.nombre} - $${producto.precio}</span>
      <button data-id="${producto.id}">Agregar</button>
    `;
    // Botón para agregar el producto al carrito
    prodDiv.querySelector("button").addEventListener("click", () => agregarAlCarrito(producto.id));
    menuContainer.appendChild(prodDiv);
  });
}

// Agrega un producto al carrito y actualiza todo
function agregarAlCarrito(id) {
  const producto = menu.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
    guardarCarrito();
    renderCarrito();
    // Mensaje eliminado a pedido del usuario
  }
}

// Muestra el contenido del carrito en pantalla
function renderCarrito() {
  carritoContainer.innerHTML = "";
  if (carrito.length === 0) {
    carritoContainer.innerHTML = "<em>El carrito está vacío.</em>";
    totalContainer.textContent = "";
    return;
  }
  carrito.forEach((producto, i) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
      <span>${producto.nombre} - $${producto.precio}</span>
      <button data-index="${i}">Quitar</button>
    `;
    // Botón para quitar el producto del carrito
    itemDiv.querySelector("button").addEventListener("click", () => quitarDelCarrito(i));
    carritoContainer.appendChild(itemDiv);
  });
  totalContainer.textContent = `Total: $${calcularTotal()}`;
}

// Saca un producto del carrito según su posición
function quitarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderCarrito();
}

// Suma los precios de todos los productos del carrito
function calcularTotal() {
  return carrito.reduce((acc, prod) => acc + prod.precio, 0);
}

// Guarda el carrito en el localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Muestra un mensaje en pantalla
function mostrarMensaje(msg) {
  mensajeDiv.textContent = msg;
}

// Cuando el usuario confirma la compra
confirmarBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío.");
    return;
  }
  mostrarMensaje("¡Gracias por tu compra! Tu pedido está en camino 🍔🚀");
  carrito = [];
  guardarCarrito();
  renderCarrito();
});

// Botón para vaciar todo el carrito
vaciarBtn.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  renderCarrito();
});

// Al cargar la página, muestro el menú y el carrito
renderMenu();
renderCarrito();
