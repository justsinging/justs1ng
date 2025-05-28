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

// In carrito.js, enhance the product object structure:
function agregarAlCarrito(nombre, precio) {
    const existeEnCarrito = carrito.some(item => item.nombre === nombre);
    
    if (existeEnCarrito) {
        mostrarNotificacion('⚠️ Este producto es único, ya está en tu carrito');
        return;
    }
    
    // Add more product details to cart
    carrito.push({ 
        nombre, 
        precio,
        imagen: obtenerImagenProducto(nombre),
        sku: generarSKU(nombre) // Add this function
    });
    
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion('✔️ Producto agregado al carrito');
}

function generarSKU(nombre) {
    return 'JS-' + nombre.replace(/\s+/g, '').substring(0, 3).toUpperCase() + 
           Math.floor(100 + Math.random() * 900);
}
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

// Función para crear preferencia de pago
async function crearPreferenciaMercadoPago() {
    const nombre = document.getElementById('nombreCliente').value;
    const email = document.getElementById('emailCliente').value;
    const telefono = document.getElementById('telefonoCliente').value;
    const direccion = document.getElementById('direccionCalle').value;
    const codigoPostal = document.getElementById('codigoPostal').value;
    const localidad = document.getElementById('localidad').value;
    const provincia = document.getElementById('provincia').value;
    
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked').value;
    const costoEnvio = envioSeleccionado === 'express' ? 4000 : 3000;
    
    const subtotal = carrito.reduce((sum, item) => sum + item.precio, 0);
    const total = subtotal + costoEnvio;
    
    const preferenceData = {
        items: carrito.map(item => ({
            title: item.nombre,
            unit_price: item.precio,
            quantity: 1,
            description: "Producto único de JustSing",
            picture_url: obtenerImagenProducto(item.nombre)
        })),
        payer: {
            name: nombre,
            email: email,
            phone: {
                number: telefono
            },
            address: {
                street_name: direccion,
                zip_code: codigoPostal
            }
        },
        shipments: {
            cost: costoEnvio,
            mode: 'not_specified'
        },
        back_urls: {
            success: window.location.href,
            failure: window.location.href,
            pending: window.location.href
        },
        auto_return: 'approved'
    };
    
    try {
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST-6749756929605397-052312-3fefdcf7d53b1ac7f95928e293a7ba4e-2429370643'
            },
            body: JSON.stringify(preferenceData)
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        mostrarNotificacion('❌ Error al iniciar el pago');
        return null;
    }
}

// Función auxiliar para obtener imagen del producto
function obtenerImagenProducto(nombreProducto) {
    const productos = {
        'Totebag Florero': 'https://i.postimg.cc/66cjFV71/IMG-9268.jpg',
        'Totebag Mujer': 'https://i.postimg.cc/VkrKS3K3/IMG-9274.jpg',
        'Totebag Lavanda': 'https://i.postimg.cc/qR0w5gpT/IMG-9276.jpg',
        'Totebag 13': 'https://i.imgur.com/L8VFmta.jpeg'
    };
    return productos[nombreProducto] || '';
}

// Función para mostrar botón de Mercado Pago
async function mostrarBotonMercadoPago() {
    const preference = await crearPreferenciaMercadoPago();
    if (!preference) return;
    
    const bricksBuilder = mp.bricks();
    document.getElementById('mercadopago-boton').innerHTML = '';
    
    bricksBuilder.create('wallet', 'mercadopago-boton', {
        initialization: {
            preferenceId: preference.id,
        },
        customization: {
            visual: {
                buttonBackground: '#9a031e',
                borderRadius: '6px',
                height: '48px'
            }
        }
    });
    
    document.getElementById('mercadopago-boton-container').style.display = 'block';
}
    ];
    function validarFormulario() {
    const email = document.getElementById('emailCliente').value;
    const telefono = document.getElementById('telefonoCliente').value;

    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  mostrarNotificacion("Email inválido");
  return false;
}
    // Add phone validation
    if (!/^[0-9]{10,15}$/.test(telefono)) {
        mostrarNotificacion('📱 Por favor ingresa un teléfono válido');
        return false;
    }
    
    // Rest of existing validation...
}
    for (const fieldId of requiredFields) {
        if (!document.getElementById(fieldId).value) {
            mostrarNotificacion(`📝 Completa el campo: ${fieldId.replace(/([A-Z])/g, ' $1').trim()}`);
            return false;
        }
    }
    
    if (carrito.length === 0) {
        mostrarNotificacion('🛒 Tu carrito está vacío');
        return false;
    }
    
    return true;
}

// Función para finalizar compra
async function finalizarCompra() {
    if (!validarFormulario()) return;
    
    const metodoPago = document.querySelector('input[name="pago"]:checked').value;
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked').value;
    const costoEnvio = envioSeleccionado === 'express' ? 4000 : 3000;
    const subtotal = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    if (metodoPago === 'transferencia') {
        const total = (subtotal + costoEnvio) * 0.9; // 10% descuento
        
        mostrarNotificacion('✅ Compra finalizada (Transferencia Bancaria)');
        alert(`Por favor realiza una transferencia de $${total.toLocaleString('es-AR')} a:\n\nCVU: 0000003100093480929286\nAlias: JustSing\n\nEnvíanos el comprobante a just.sin.g0706@gmail.com`);
        
        // Vaciar carrito
        carrito = [];
        actualizarCarrito();
        localStorage.removeItem('carrito');
        modalCarrito.style.display = 'none';
    } 
    else if (metodoPago === 'mercadopago' || metodoPago === 'tarjeta') {
        mostrarNotificacion('⌛ Redirigiendo a Mercado Pago...');
        await mostrarBotonMercadoPago();
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
    
    // Verificar si viene de una redirección de Mercado Pago
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('preference_id')) {
        mostrarNotificacion('✅ Pago procesado con éxito');
        carrito = [];
        actualizarCarrito();
        localStorage.removeItem('carrito');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
    
    window.addEventListener('click', (event) => {
        if (event.target === modalCarrito) {
            modalCarrito.style.display = 'none';
        }
    });
async function finalizarCompra() {
    if (!validarFormulario()) return;
    
    const btn = document.getElementById('finalizar-compra');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    try {
        // Existing payment logic...
    } catch (error) {
        mostrarNotificacion('❌ Error al procesar el pago');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
    // Add to finalizarCompra function after successful payment:
function enviarConfirmacionPedido(datosCliente) {
    // Here you would typically send this to your backend
    console.log('Pedido confirmado:', {
        productos: carrito,
        cliente: datosCliente,
        total: calcularTotal(),
        fecha: new Date().toISOString()
    });
    
    // For demo purposes, just show in console
    return Promise.resolve();
}
// Configuración de MercadoPago (SOLO frontend)
const mp = new MercadoPago('APP_USR-0aa95e81-e09e-42d7-95ea-540547141761'); // Public key

// Función para crear preferencia (ahora llama a tu backend)
async function crearPreferenciaMercadoPago() {
  try {
    const response = await fetch('http://localhost:3000/crear-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: carrito,
        cliente: obtenerDatosCliente() // Implementa esta función
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion("❌ Error al procesar el pago");
  }
}
 document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
});
