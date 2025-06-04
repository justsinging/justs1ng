 <script>
        // Aquí puedes agregar la funcionalidad JavaScript para el carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.parentElement.querySelector('.product-name').textContent;
                alert(`${productName} agregado al carrito`);
           // js/main.js
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('.product-name').textContent;
        alert(`${productName} agregado al carrito`);
        // Lógica del carrito aquí
    });
});
            });
        });
    </script>
