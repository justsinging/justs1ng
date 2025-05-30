// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const MERCADOPAGO_KEY = 'APP_USR-0aa95e81-e09e-42d7-95ea-540547141761';
let mp;

// Inicializar MercadoPago solo si está disponible
if (typeof MercadoPago !== 'undefined') {
    mp = new MercadoPago(MERCADOPAGO_KEY, { locale: 'es-AR' });
} else {
    console.warn('MercadoPago no está disponible');
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, imagen, idProducto) {
    // Validar parámetros
    if (!nombre || isNaN(precio) || precio <= 0) {
        console.error('Parámetros inválidos para agregar al carrito');
        mostrarNotificacion('Error al agregar el producto');
        return;
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === idProducto);
    
    if (productoExistente) {
        mostrarNotificacion('Este producto ya está en tu carrito (solo disponible una unidad)');
        return;
    }
    
    // Agregar producto al carrito
    carrito.push({
        id: idProducto || Date.now().toString(), // ID único si no se proporciona
        nombre: nombre,
        precio: Number(precio),
        imagen: imagen || 'img/default-product.jpg',
        cantidad: 1
    });
    
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion('Producto agregado al carrito');
    
    // Deshabilitar el botón del producto agregado
    document.querySelectorAll(`[data-id="${idProducto}"]`).forEach(boton => {
        boton.disabled = true;
        boton.textContent = 'En tu carrito';
        boton.classList.add('en-carrito');
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.getElementById('notificacion');
    if (!notificacion) {
        console.error('Elemento de notificación no encontrado');
        return;
    }
    
    notificacion.textContent = mensaje;
    notificacion.className = esError ? 'notificacion error' : 'notificacion';
    notificacion.classList.add('mostrar');
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const contador = document.getElementById('contadorCarrito');
    if (contador) {
        contador.textContent = carrito.length;
        contador.style.display = carrito.length > 0 ? 'block' : 'none';
    }
    
    // Actualizar lista de productos en el modal
    const listaCarrito = document.getElementById('listaCarrito');
    if (listaCarrito) {
        listaCarrito.innerHTML = '';
        
        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<div class="carrito-vacio"><p>Tu carrito está vacío</p></div>';
            document.getElementById('finalizar-compra').style.display = 'none';
        } else {
            carrito.forEach(item => {
                const elemento = document.createElement('div');
                elemento.className = 'item-carrito';
                elemento.innerHTML = `
                    <img src="${item.imagen}" alt="${item.nombre}" width="80" height="80" loading="lazy">
                    <div class="info-item">
                        <h4>${item.nombre}</h4>
                        <p>$${item.precio.toLocaleString('es-AR')}</p>
                    </div>
                    <button class="eliminar-item" onclick="eliminarDelCarrito('${item.id}')" aria-label="Eliminar ${item.nombre}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                listaCarrito.appendChild(elemento);
            });
            document.getElementById('finalizar-compra').style.display = 'block';
        }
    }
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalElement = document.getElementById('totalCarrito');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('es-AR');
    }
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(idProducto) {
    const productoEliminado = carrito.find(item => item.id === idProducto);
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
    
    // Reactivar el botón del producto eliminado
    if (productoEliminado) {
        document.querySelectorAll(`[data-id="${idProducto}"]`).forEach(boton => {
            boton.disabled = false;
            boton.textContent = 'Agregar al carrito';
            boton.classList.remove('en-carrito');
        });
    }
}

// Configuración de Mercado Pago
async function configurarMercadoPago(total) {
    if (!mp) {
        mostrarNotificacion('Error al configurar el pago', true);
        return;
    }

    try {
        const response = await fetch('/crear-preferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: carrito.map(item => ({
                    id: item.id,
                    title: item.nombre,
                    unit_price: item.precio,
                    quantity: item.cantidad,
                    picture_url: item.imagen
                })),
                back_urls: {
                    success: window.location.href,
                    failure: window.location.href,
                    pending: window.location.href
                },
                auto_return: 'approved'
            })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        
        // Limpiar contenedor antes de renderizar
        const container = document.getElementById('mercadopago-boton-container');
        if (container) {
            container.innerHTML = '';
            
            mp.checkout({
                preference: {
                    id: data.id
                },
                render: {
                    container: '#mercadopago-boton-container',
                    label: 'Pagar con Mercado Pago',
                    type: 'wallet'
                }
            });
        }
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        mostrarNotificacion('Error al configurar el pago', true);
    }
}

// Evento para finalizar compra
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrito desde localStorage
    actualizarCarrito();

    const finalizarBtn = document.getElementById('finalizar-compra');
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (carrito.length === 0) {
                mostrarNotificacion('Tu carrito está vacío', true);
                return;
            }
            
            if (!validarFormularioEnvio()) {
                return;
            }
            
            document.getElementById('listaCarrito').style.display = 'none';
            document.getElementById('paso-pago').style.display = 'block';
            
            // Configurar listeners para métodos de pago
            document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    const mpContainer = document.getElementById('mercadopago-boton-container');
                    const datosTransferencia = document.getElementById('datos-transferencia');
                    
                    if (this.value === 'mercadopago') {
                        datosTransferencia.style.display = 'none';
                        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
                        configurarMercadoPago(total);
                    } else {
                        if (mpContainer) mpContainer.innerHTML = '';
                        datosTransferencia.style.display = 'block';
                    }
                });
            });
        });
    }
    
    // Volver al carrito
    const volverBtn = document.getElementById('volver-carrito');
    if (volverBtn) {
        volverBtn.addEventListener('click', function() {
            document.getElementById('paso-pago').style.display = 'none';
            document.getElementById('listaCarrito').style.display = 'block';
        });
    }
});

// Función para validar el formulario de envío
function validarFormularioEnvio() {
    const nombre = document.getElementById('nombreCliente').value.trim();
    const email = document.getElementById('emailCliente').value.trim();
    const telefono = document.getElementById('telefonoCliente').value.trim();
    const direccion = document.getElementById('direccionCliente').value.trim();
    const ciudad = document.getElementById('ciudadCliente').value.trim();
    
    if (!nombre || !email || !telefono || !direccion || !ciudad) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', true);
        return false;
    }
    
    if (!/^\d{8,15}$/.test(telefono)) {
        mostrarNotificacion('El teléfono debe tener entre 8 y 15 dígitos', true);
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarNotificacion('Por favor ingresa un email válido', true);
        return false;
    }
    
    return true;
}

// Envío del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactoForm = document.getElementById('formularioContacto');
    if (contactoForm) {
        contactoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombreContacto').value.trim();
            const email = document.getElementById('emailContacto').value.trim();
            const mensaje = document.getElementById('mensajeContacto').value.trim();
            
            if (!nombre || !email || !mensaje) {
                mostrarNotificacion('Por favor completa todos los campos', true);
                return;
            }
            
            try {
                // Usar Fetch API como alternativa a EmailJS
                const response = await fetch('/enviar-consulta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, email, mensaje })
                });
                
                if (response.ok) {
                    mostrarNotificacion('Consulta enviada con éxito');
                    contactoForm.reset();
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                console.error('Error al enviar la consulta:', error);
                mostrarNotificacion('Error al enviar la consulta', true);
            }
        });
    }
});

// Vaciar carrito después de una compra exitosa
function vaciarCarrito() {
    // Reactivar todos los botones de productos
    document.querySelectorAll('.en-carrito').forEach(boton => {
        boton.disabled = false;
        boton.textContent = 'Agregar al carrito';
        boton.classList.remove('en-carrito');
    });
    
    carrito = [];
    actualizarCarrito();
    guardarCarrito();
}
