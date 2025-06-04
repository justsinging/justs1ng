<!DOCTYPE html>
<html lang="es">
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
                    </div>
                </div>
                <div class="payment-option" data-method="transferencia">
                    <img src="assets/bank-transfer-icon.png" alt="Transferencia Bancaria">
                    <div class="payment-fields" id="transferencia-fields" style="display:none">
                    <p>Por favor realiza la transferencia a:</p>
                    <p><strong>CVU:</strong> 00000031000000000000</p>
                    <p><strong>Alias:</strong> TU.ALIAS.MP</p>
                    <p><strong>Titular:</strong> Tu Nombre</p>
                    </div>
                </div>
                </div>
                <button type="submit" class="complete-order">Finalizar compra</button>
            </form>
        </div>
    </div>

    <!-- Notification -->
    <div class="notification">Producto agregado a tu carrito</div>

    <script src="js/main.js"></script>
    <script src="js/cart.js"></script>
</body>
</html>
