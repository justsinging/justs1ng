require('dotenv').config(); // Para manejar variables de entorno
const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors'); // Para habilitar CORS

const app = express();

// Configuración básica de middleware
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.static('public')); 
// Configuración de MercadoPago (usa variables de entorno)
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN || 'TEST-6749756929605397-052312-3fefdcf7d53b1ac7f95928e293a7ba4e-2429370643'
});

// Endpoint para crear preferencias de pago
app.post('/crear-pago', async (req, res) => {
  try {
    // Validación básica de los datos recibidos
    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({ error: 'Formato de items inválido' });
    }
if (!req.body.items || !Array.isArray(req.body.items)) {
  return res.status(400).json({ error: 'Formato de items inválido' });
}
    // Construir la preferencia
    const preference = {
      items: req.body.items.map(item => ({
        title: item.nombre || 'Producto sin nombre',
        unit_price: Number(item.precio) || 0,
        quantity: Number(item.cantidad) || 1,
        description: item.descripcion || '',
        picture_url: item.imagen || ''
      })),
      payer: {
        email: req.body.cliente?.email || '',
        name: req.body.cliente?.nombre || '',
        phone: {
          number: req.body.cliente?.telefono || ''
        },
        address: {
          street_name: req.body.cliente?.direccion || '',
          zip_code: req.body.cliente?.codigoPostal || ''
        }
      },
      payment_methods: {
        excluded_payment_types: [
          { id: 'atm' } // Excluir métodos no deseados
        ],
        installments: 12 // Máximo de cuotas
      },
      back_urls: {
        success: process.env.MP_SUCCESS_URL || 'http://localhost:3000/pago-exitoso',
        failure: process.env.MP_FAILURE_URL || 'http://localhost:3000/pago-fallido',
        pending: process.env.MP_PENDING_URL || 'http://localhost:3000/pago-pendiente'
      },
      auto_return: 'approved',
      notification_url: process.env.MP_NOTIFICATION_URL || 'https://tudominio.com/notificaciones'
    };

    // Crear la preferencia en MercadoPago
    const response = await mercadopago.preferences.create(preference);
    
    // Respuesta al frontend
    res.json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });

  } catch (error) {
    console.error('Error en /crear-pago:', error);
    res.status(500).json({ 
      error: 'Error al crear el pago',
      details: error.message 
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de pagos funcionando');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
