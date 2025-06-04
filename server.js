const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configura MP (usa tu ACCESS_TOKEN)
mercadopago.configure({
  access_token: 'APP_USR-6749756929605397-052312-3fefdcf7d53b1ac7f95928e293a7ba4e-2429370643'
});

app.use(cors());
app.use(express.json());

// Endpoint para crear preferencia
app.post('/create-payment', async (req, res) => {
  try {
    const preference = {
      items: req.body.items,
      back_urls: {
        success: 'https://tudominio.com/success',
        failure: 'https://tudominio.com/failure',
        pending: 'https://tudominio.com/pending'
      },
      auto_return: 'approved',
      binary_mode: true // Evita pagos pendientes
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error MP:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
