document.addEventListener('DOMContentLoaded', function() {
    // Variables del carrito
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Abrir carrito
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        renderCartItems();
    });

    // Cerrar carrito
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Añadir al carrito
    document.querySelectorAll('.btn-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            const productElement = e.target.closest('.product');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = productElement.querySelector('.precio').textContent.replace('$', '').replace('.', '');
            const productImage = productElement.querySelector('img').src;

            addToCart(productId, productName, productPrice, productImage);
        });
    });

    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price: parseInt(price),
                image,
                quantity: 1
            });
        }

        updateCart();
        showNotification(`${name} agregado al carrito`);
    }

    function updateCart() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${(item.price * item.quantity).toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0; // Aquí puedes agregar lógica de envío
        const total = subtotal + shipping;

        document.querySelector('.subtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.querySelector('.shipping').textContent = `$${shipping.toLocaleString()}`;
        document.querySelector('.total').textContent = `$${total.toLocaleString()}`;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Cargar carrito desde localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
        // Funcionalidades generales del sitio
document.addEventListener('DOMContentLoaded', function() {
    // Puedes añadir aquí otras funcionalidades que necesites
    console.log('Sitio cargado correctamente');
});
    }
});
