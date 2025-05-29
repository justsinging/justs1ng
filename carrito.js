let carrito = [];

function agregarAlCarrito(nombre, precio) {
  // Verificar si el producto ya está en el carrito
  const productoExistente = carrito.find(item => item.nombre === nombre);
  
  if (productoExistente) {
    mostrarNotificacion('Este producto ya está en tu carrito (solo disponible una unidad)');
    return; // Detener la función si ya existe
  }
  
  // Si no existe, agregarlo al carrito
  carrito.push({
    nombre: nombre,
    precio: precio,
    cantidad: 1 // Siempre será 1
  });
  
  actualizarCarrito();
  mostrarNotificacion('Producto agregado al carrito');
}

function mostrarNotificacion(mensaje) {
  const notificacion = document.getElementById('notificacion');
  notificacion.textContent = mensaje;
  notificacion.classList.add('mostrar');
  
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
  }, 3000);
}

function actualizarCarrito() {
  const contador = document.getElementById('contadorCarrito');
  contador.textContent = carrito.length;
  
  // Actualizar lista de productos en el modal
  const itemsCarrito = document.getElementById('itemsCarrito');
  itemsCarrito.innerHTML = '';
  
  carrito.forEach(item => {
    const elemento = document.createElement('div');
    elemento.className = 'item-carrito';
    elemento.innerHTML = `
      <span>${item.nombre}</span>
      <span>$${item.precio.toLocaleString()}</span>
      <button onclick="eliminarDelCarrito('${item.nombre}')">X</button>
    `;
    itemsCarrito.appendChild(elemento);
  });
  
  // Actualizar total
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  document.getElementById('totalCarrito').textContent = `$${total.toLocaleString()}`;
}

function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  actualizarCarrito();
}
