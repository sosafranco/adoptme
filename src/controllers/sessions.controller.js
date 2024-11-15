import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import customError from "../utils/errors/customError.js";
import { errorsEnum } from "../utils/errors/errorsEnum.js";

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Validación de datos
        if (!first_name || !last_name || !email || !password) {
            customError.createError({
                name: "ValidationError",
                cause: "Datos incompletos en el registro",
                message: errorsEnum.MISSING_DATA,
                code: 400
            });
        }

        // Verificar usuario existente
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            customError.createError({
                name: "UserError",
                cause: "Email ya registrado",
                message: errorsEnum.USER_ALREADY_EXISTS,
                code: 400
            });
        }

        // Crear usuario
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }

        const result = await usersService.create(user);
        res.status(201).send({ status: "success", payload: result._id });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            customError.createError({
                name: "ValidationError",
                cause: "Email o contraseña faltantes",
                message: errorsEnum.MISSING_DATA,
                code: 400
            });
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            customError.createError({
                name: "AuthError",
                cause: "Usuario no encontrado",
                message: errorsEnum.INVALID_CREDENTIALS,
                code: 404
            });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            customError.createError({
                name: "AuthError",
                cause: "Contraseña incorrecta",
                message: errorsEnum.INVALID_CREDENTIALS,
                code: 400
            });
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('coderCookie', token, { maxAge: 3600000 })
            .send({ status: "success", message: "Logged in" });

    } catch (error) {
        next(error);
    }
}

const current = async (req, res) => {
    const cookie = req.cookies['coderCookie'];
    const user = jwt.verify(cookie, 'tokenSecretJWT');

    if (user) {
        return res.send({ status: "success", payload: user });
    }
};

const unprotectedLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            status: "error",
            error: "Incomplete values"
        });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
        return res.status(404).send({
            status: "error",
            error: "User doesn't exist"
        });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
        return res.status(400).send({
            status: "error",
            error: "Incorrect password"
        });
    }

    const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });
    res.cookie('unprotectedCookie', token, { maxAge: 3600000 })
        .send({ status: "success", message: "Unprotected Logged in" });
};

const unprotectedCurrent = async (req, res) => {
    const cookie = req.cookies['unprotectedCookie'];
    const user = jwt.verify(cookie, 'tokenSecretJWT');

    if (user) {
        return res.send({ status: "success", payload: user });
    }
};

export default {
    register,
    login,
    current,
    unprotectedLogin,
    unprotectedCurrent
}