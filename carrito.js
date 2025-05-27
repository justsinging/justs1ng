 // Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const modalCarrito = document.getElementById('modalCarrito');
const abrirCarrito = document.getElementById('abrirCarrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const itemsCarrito = document.getElementById('itemsCarrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const costoEnvioElement = document.getElementById('costo-envio');
const totalCarritoElement = document.getElementById('totalCarrito');

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    const existeEnCarrito = carrito.some(item => item.nombre === nombre);
    
    if (existeEnCarrito) {
        mostrarNotificacion('⚠️ Este producto es único, ya está en tu carrito');
        return;
    }
    
    carrito.push({ nombre, precio });
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion('✔️ Producto agregado al carrito');
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion('🗑️ Producto eliminado');
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar vista del carrito
function actualizarCarrito() {
    itemsCarrito.innerHTML = '';
    let subtotal = 0;
    
    carrito.forEach((item, index) => {
        subtotal += item.precio;
        itemsCarrito.innerHTML += `
            <div class="item-carrito">
                <span>${item.nombre} - $${item.precio.toLocaleString('es-AR')}</span>
                <button onclick="eliminarDelCarrito(${index})">X</button>
            </div>
        `;
    });
    
    contadorCarrito.textContent = carrito.length;
    actualizarCostosEnvio();
}

// Actualizar costos de envío
function actualizarCostosEnvio() {
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked').value;
    let costoEnvio = 0;
    
    switch(envioSeleccionado) {
        case 'estandar': costoEnvio = 3000; break;
        case 'express': costoEnvio = 4000; break;
        default: costoEnvio = 0;
    }
    
    costoEnvioElement.textContent = `$${costoEnvio.toLocaleString('es-AR')}`;
    
    const subtotal = carrito.reduce((sum, item) => sum + item.precio, 0);
    const total = subtotal + costoEnvio;
    totalCarritoElement.textContent = `$${total.toLocaleString('es-AR')}`;
}

// Inicialización del carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarCarrito();
    
    // Eventos para cambios en método de envío
    document.querySelectorAll('input[name="envio"]').forEach(radio => {
        radio.addEventListener('change', actualizarCostosEnvio);
    });
    
    // Eventos para abrir/cerrar modal
    abrirCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'block';
    });
    
    cerrarCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modalCarrito) {
            modalCarrito.style.display = 'none';
        }
    });
});

// Configuración de Mercado Pago (simplificada)
const mp = new MercadoPago('APP_USR-0aa95e81-e09e-42d7-95ea-540547141761', {
    locale: 'es-AR'
});

// Función para finalizar compra
async function finalizarCompra() {
    // Validar formulario
    const requiredFields = ['nombreCliente', 'emailCliente', 'telefonoCliente', 
                          'direccionCalle', 'codigoPostal', 'localidad', 'provincia'];
    
    for (const fieldId of requiredFields) {
        if (!document.getElementById(fieldId).value) {
            mostrarNotificacion('📝 Completa todos los campos oblig
