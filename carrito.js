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

// Configuración de Mercado Pago
const mp = new MercadoPago('APP_USR-0aa95e81-e09e-42d7-95ea-540547141761', {
    locale: 'es-AR'
});

async function finalizarCompra() {
    // ... (código previo de validación)
    
    const metodoPago = document.querySelector('input[name="pago"]:checked').value;
    
    if (metodoPago === 'transferencia') {
        // Lógica para transferencia bancaria
        const total = (subtotal + costoEnvio) * 0.9; // 10% descuento
        alert(`Por favor realiza una transferencia de $${total.toLocaleString('es-AR')}...`);
    } 
    else if (metodoPago === 'mercadopago' || metodoPago === 'tarjeta') {
        // Ambas opciones usan Mercado Pago
        mostrarNotificacion('⌛ Redirigiendo a Mercado Pago...');
        await mostrarBotonMercadoPago();
    }
    
    // ... (resto del código)
}
    for (const fieldId of requiredFields) {
        if (!document.getElementById(fieldId).value) {
            mostrarNotificacion('📝 Completa todos los campos obligatorios');
            return;
        }
    }
    
    const metodoPago = document.querySelector('input[name="pago"]:checked').value;
    
    if (metodoPago === 'transferencia') {
        const envioSeleccionado = document.querySelector('input[name="envio"]:checked').value;
        const costoEnvio = envioSeleccionado === 'express' ? 4000 : 3000;
        const subtotal = carrito.reduce((sum, item) => sum + item.precio, 0);
        const total = (subtotal + costoEnvio) * 0.9; // 10% descuento
        
        mostrarNotificacion('✅ Compra finalizada (Transferencia Bancaria)');
        alert(`Por favor realiza una transferencia de $${total.toLocaleString('es-AR')} a:\n\nCVU: 0000003100093480929286\nAlias: JustSing\n\nEnvíanos el comprobante a just.sin.g0706@gmail.com`);
        
        // Vaciar carrito
        carrito = [];
        actualizarCarrito();
        localStorage.removeItem('carrito');
        modalCarrito.style.display = 'none';
    } else if (metodoPago === 'mercadopago') {
        mostrarNotificacion('⌛ Redirigiendo a Mercado Pago...');
        // Lógica de Mercado Pago aquí
    }
}

// Inicialización al cargar la página
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
    
    // Asignar evento al botón de finalizar compra
    document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
});
