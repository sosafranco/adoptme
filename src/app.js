import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import manejadorError from './middleware/error.middleware.js';

// Configuración
dotenv.config();

// Verificar si las variables de entorno se están cargando correctamente
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('PORT:', process.env.PORT);

const app = express();
// const PORT = process.env.PORT || 8080;
// const HOST = '0.0.0.0'; // Cambiado de 'localhost' para permitir conexiones externas en Docker

export const startServer = (port) => {
  return new Promise((resolve) => {
      const server = app.listen(port, () => {
          console.log(`Servidor escuchando en http://localhost:${port}/`);
          resolve(server);
      });
  });
};

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello from AdoptMe API!');
});

// Manejador de errores
app.use(manejadorError);

// Inicialización del servidor
// app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

export default app;

