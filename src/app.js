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
const app = express();
const PORT = process.env.PORT || 8080;
const HOST = 'localhost';
const connection = mongoose.connect(process.env.MONGO_URL);

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

// Manejador de errores
app.use(manejadorError);

// Inicialización del servidor
app.listen(PORT, () => console.log(`Listening on http://${HOST}:${PORT}`));
