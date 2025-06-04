<!DOCTYPE html>
<html lang="es">
    // Cambia esta URL en cart.js
const response = await fetch('http://localhost:3001/create-payment', {
  method: 'POST',
  // ... resto del código
});
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bolsas Premium</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Header -->
    <header>
        <h1>Bolsas Premium</h1>
        <div class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        </div>
    </header>

    <!-- Product Grid -->
    <main class="products-container">
        <!-- Los productos se generarán dinámicamente con JS -->
    </main>

    <!-- Cart Sidebar -->
    <div class="cart-sidebar">
        <div class="cart-header">
            <h2>Tu Carrito</h2>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items">
            <!-- Los items del carrito aparecerán aquí -->
        </div>
        <div class="cart-total">
            <div class="total-row">
                <span>Subtotal:</span>
                <span class="subtotal">$0</span>
            </div>
            <div class="total-row">
                <span>Envío:</span>
                <span class="shipping">$0</span>
            </div>
            <div class="total-row grand-total">
                <span>Total:</span>
                <span class="total">$0</span>
            </div>
            <button class="checkout-btn">Continuar compra</button>
        </div>
    </div>
    <div class="overlay"></div>

    <!-- Checkout Form -->
    <div class="checkout-modal">
        <div class="checkout-container">
            <button class="close-checkout">&times;</button>
            <h2>Envío</h2>
            <form id="shipping-form">
                <div class="form-group shipping-option">
                <label>
                    <input type="radio" name="shipping" value="domicilio" checked>
                    Correo Argentino (domicilio) - $5000
                </label>
                <label>
                    <input type="radio" name="shipping" value="sucursal">
                    Correo Argentino (sucursal) - $4000
                </label>
                </div>

                <div class="form-group" id="domicilio-fields">
                <input type="text" placeholder="Provincia" required>
                <input type="text" placeholder="Localidad" required>
                <input type="text" placeholder="Calle y Número" required>
                <input type="text" placeholder="Código Postal" required>
                <input type="text" placeholder="Piso y Dpto (opcional)">
                <input type="text" placeholder="Nombre y Apellido" required>
                <input type="email" placeholder="Correo Electrónico" required>
                <input type="tel" placeholder="Teléfono" required>
                </div>

                <div class="form-group" id="sucursal-fields" style="display:none">
                <input type="text" placeholder="Provincia" required>
                <input type="text" placeholder="Localidad" required>
                <input type="text" placeholder="Calle y Número" required>
                <input type="text" placeholder="Nombre y Apellido" required>
                <input type="email" placeholder="Correo Electrónico" required>
                <input type="tel" placeholder="Teléfono" required>
                </div>

                <h2 class="payment-title">Método de Pago</h2>
                <div class="payment-methods">
                <div class="payment-option active" data-method="mercadopago">
                    <img src="assets/mercadopago-logo.png" alt="Mercado Pago">
                    <div class="payment-fields" id="mercadopago-fields">
                    <!-- Aquí iría la integración con la API de Mercado Pago -->
    // ======================
// 1. Inicialización MP
// ======================
const mp = new MercadoPago('TU_PUBLIC_KEY', {
  locale: 'es-AR'
});

// ======================
// 2. Botón "Finalizar compra"
// ======================
document.querySelector('.complete-order').addEventListener('click', async (e) => {
  e.preventDefault();
  
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const shippingCost = document.querySelector('input[name="shipping"]:checked').value === 'domicilio' ? 5000 : 4000;

  // Preparamos los items para MP
  const items = cartItems.map(item => ({
    title: item.name,
    unit_price: parseFloat(item.price),
    quantity: item.quantity,
    picture_url: item.image
  }));

  // Añadimos costo de envío como ítem adicional
  items.push({
    title: 'Envío',
    unit_price: shippingCost,
    quantity: 1
  });

  // ======================
  // 3. Crear preferencia
  // ======================
  try {
    const response = await fetch('https://tu-backend.com/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items })
    });

    const { id } = await response.json();
    
    // Abrir checkout de MP
    mp.checkout({
      preference: {
        id: id
      },
      autoOpen: true // Abre automáticamente el modal
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al procesar el pago');
  }
});
                    </div>
                </div>
                <div class="payment-option" data-method="transferencia">
                    <img src="assets/bank-transfer-icon.png" alt="Transferencia Bancaria">
                    <div class="payment-fields" id="transferencia-fields" style="display:none">
                    <p>Por favor realiza la transferencia a:</p>
                    <p><strong>CVU:</strong> 0000003100093480929286</p>
                    <p><strong>Alias:</strong> JustSing</p>
                    <p><strong>Titular:</strong> Just Sing</p>
                    </div>
                </div>
                </div>
                <button type="submit" class="complete-order">Finalizar compra</button>
            </form>
        </div>
    </div>

    <!-- Notification -->
    <div class="notification">Producto agregado a tu carrito</div>
// En cart.js reemplaza esto con tu API key:
const MERCADOPAGO_API_KEY = 'APP_USR-0aa95e81-e09e-42d7-95ea-540547141761';
    <script src="js/main.js"></script>
    <script src="js/cart.js"></script>
</body>
</html>
