// Variables globales
let carrito = [];
const mp = new MercadoPago('APP_USR-0aa95e81-e09e-42d7-95ea-540547141761', {
    locale: 'es-AR'
});

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, imagen) {
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
        imagen: imagen || 'img/default-product.jpg', // Imagen por defecto si no se proporciona
        cantidad: 1 // Siempre será 1
    });
    
    actualizarCarrito();
    mostrarNotificacion('Producto agregado al carrito');
    
    // Deshabilitar el botón del producto agregado
    document.querySelectorAll('.btn-carrito').forEach(boton => {
        if (boton.textContent.includes('Agregar al carrito') && boton.onclick.toString().includes(nombre)) {
            boton.disabled = true;
            boton.textContent = 'En tu carrito';
            boton.style.backgroundColor = '#5a5a5a';
        }
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    if (!notificacion) {
        console.error('Elemento de notificación no encontrado');
        return;
    }
    
    notificacion.textContent = mensaje;
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
    }
    
    // Actualizar lista de productos en el modal
    const listaCarrito = document.getElementById('listaCarrito');
    if (listaCarrito) {
        listaCarrito.innerHTML = '';
        
        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<div class="carrito-vacio"><p>Tu carrito está vacío</p></div>';
        } else {
            carrito.forEach(item => {
                const elemento = document.createElement('div');
                elemento.className = 'item-carrito';
                elemento.innerHTML = `
                    <img src="${item.imagen}" alt="${item.nombre}" width="80" height="80">
                    <div class="info-item">
                        <h4>${item.nombre}</h4>
                        <p>$${item.precio.toLocaleString()}</p>
                    </div>
                    <button class="eliminar-item" onclick="eliminarDelCarrito('${item.nombre}')">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                listaCarrito.appendChild(elemento);
            });
        }
    }
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalElement = document.getElementById('totalCarrito');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString();
    }
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
    
    // Reactivar el botón del producto eliminado
    document.querySelectorAll('.btn-carrito').forEach(boton => {
        if (boton.textContent.includes('En tu carrito') && boton.onclick.toString().includes(nombre)) {
            boton.disabled = false;
            boton.textContent = 'Agregar al carrito';
            boton.style.backgroundColor = '#9a031e';
        }
    });
}

// Configuración de Mercado Pago
function configurarMercadoPago(total) {
    // Verificar si MercadoPago está disponible
    if (typeof mp === 'undefined') {
        console.error('MercadoPago no está cargado correctamente');
        return;
    }

    // Aquí deberías hacer una llamada a tu backend para crear la preferencia
    // Esto es solo un ejemplo, necesitas implementar el backend
    fetch('/crear-preferencia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: carrito.map(item => ({
                title: item.nombre,
                unit_price: item.precio,
                quantity: item.cantidad,
            })),
            total: total
        })
    })
    .then(response => response.json())
    .then(data => {
        // Renderizar el botón de pago
        mp.checkout({
            preference: {
                id: data.id // ID de preferencia devuelto por tu backend
            },
            render: {
                container: '#mercadopago-boton-container',
                label: 'Pagar con Mercado Pago',
                type: 'wallet'
            }
        });
    })
    .catch(error => {
        console.error('Error al crear preferencia:', error);
        mostrarNotificacion('Error al configurar el pago');
    });
}

// Evento para finalizar compra
document.addEventListener('DOMContentLoaded', function() {
    const finalizarBtn = document.getElementById('finalizar-compra');
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (carrito.length === 0) {
                mostrarNotificacion('Tu carrito está vacío');
                return;
            }
            
            // Validar formulario antes de proceder al pago
            const formularioValido = validarFormularioEnvio();
            if (!formularioValido) {
                return;
            }
            
            document.getElementById('listaCarrito').style.display = 'none';
            document.getElementById('paso-pago').style.display = 'block';
            
            // Mostrar u ocultar opciones según selección
            document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'mercadopago') {
                        document.getElementById('datos-transferencia').style.display = 'none';
                        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
                        configurarMercadoPago(total);
                    } else {
                        document.getElementById('datos-transferencia').style.display = 'block';
                        const mpContainer = document.getElementById('mercadopago-boton-container');
                        if (mpContainer) mpContainer.style.display = 'none';
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
        mostrarNotificacion('Por favor completa todos los campos obligatorios');
        return false;
    }
    
    if (!/^\d{10}$/.test(telefono)) {
        mostrarNotificacion('El teléfono debe tener 10 dígitos');
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarNotificacion('Por favor ingresa un email válido');
        return false;
    }
    
    return true;
}

// Envío del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactoForm = document.getElementById('formularioContacto');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombreContacto').value;
            const email = document.getElementById('emailContacto').value;
            const mensaje = document.getElementById('mensajeContacto').value;
            
            if (!nombre || !email || !mensaje) {
                mostrarNotificacion('Por favor completa todos los campos');
                return;
            }
            
            // Aquí iría el código para enviar el email (necesitarías un backend)
            // Ejemplo con EmailJS (debes configurarlo primero):
            if (typeof emailjs !== 'undefined') {
                emailjs.send("service_tuServicio", "template_tuTemplate", {
                    from_name: nombre,
                    from_email: email,
                    message: mensaje
                }).then(function() {
                    mostrarNotificacion('Consulta enviada con éxito');
                }, function(error) {
                    console.error('Error al enviar:', error);
                    mostrarNotificacion('Error al enviar la consulta');
                });
            } else {
                console.warn('EmailJS no está cargado');
                // Simular éxito para desarrollo
                mostrarNotificacion('Consulta enviada con éxito (modo desarrollo)');
            }
            
            this.reset();
        });
    }
});
