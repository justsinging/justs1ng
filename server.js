const express = require('express');
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());

// Configura MercadoPago (usa variables de entorno en producción)
mercadopago.configure({
  access_token: 'TEST-6749756929605397-052312-3fefdcf7d53b1ac7f95928e293a7ba4e-2429370643'
});

// Endpoint para crear pagos
app.post('/crear-pago', async (req, res) => {
  try {
    const preference = await mercadopago.preferences.create({
      items: req.body.items.map(item => ({
        title: item.nombre,
        unit_price: item.precio,
        quantity: 1
      })),
      payer: {
        email: req.body.cliente.email
      },
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure"
      }
    });
    res.json({ id: preference.body.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
