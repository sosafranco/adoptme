import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from "./routes/mocks.router.js";
import manejadorError from "./middleware/error.middleware.js";

// Config
const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "localhost";
const connection = mongoose.connect(`mongodb+srv://francososa:estoesboca12@cluster0.5txnf.mongodb.net/ecommerce?retryWrites=true&w=majority`);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/api/mocks", mocksRouter);

// Error Middleware
app.use(manejadorError);

// Server
app.listen(PORT,() => console.log(`Listening on http://${HOST}:${PORT}`));
