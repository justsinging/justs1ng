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
// Configuración de Mercado Pago
const mp = new MercadoPago('APP_USR-0aa95e81-e09e-42d7-95ea-540547141761', {
    locale: 'es-AR'
});

document.getElementById('finalizar-compra').addEventListener('click', function() {
    document.getElementById('itemsCarrito').style.display = 'none';
    document.getElementById('paso-pago').style.display = 'block';
    
    // Mostrar u ocultar opciones según selección
    document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if(this.value === 'mercadopago') {
                document.getElementById('datos-transferencia').style.display = 'none';
                // Aquí iría la generación del botón de Mercado Pago
            } else {
                document.getElementById('datos-transferencia').style.display = 'block';
                document.getElementById('mercadopago-boton-container').style.display = 'none';
            }
        });
    });
});

// Volver al carrito
document.getElementById('volver-carrito').addEventListener('click', function() {
    document.getElementById('paso-pago').style.display = 'none';
    document.getElementById('itemsCarrito').style.display = 'block';
});

// Envío del formulario de contacto
document.getElementById('formularioContacto').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombreContacto').value;
    const email = document.getElementById('emailContacto').value;
    const mensaje = document.getElementById('mensajeContacto').value;
    
    // Aquí iría el código para enviar el email (necesitarías un backend)
    // Ejemplo con EmailJS (debes configurarlo primero):
    emailjs.send("service_tuServicio", "template_tuTemplate", {
        from_name: nombre,
        from_email: email,
        message: mensaje
    }).then(function() {
        alert('Consulta enviada con éxito');
    }, function(error) {
        alert('Error al enviar: ' + JSON.stringify(error));
    });
    
    this.reset();
});
// En carrito.js
function configurarMercadoPago(total) {
    const mp = new MercadoPago('APP_USR-0aa95e81-e09e-42d7-95ea-540547141761', {
        locale: 'es-AR'
    });

    mp.checkout({
        preference: {
            id: 'TU_PREFERENCE_ID' // Debes generar esto desde tu backend
        },
        render: {
            container: '#mercadopago-boton-container',
            label: 'Pagar con Mercado Pago',
            type: 'wallet'
        }
    });
}
