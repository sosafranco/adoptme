import { petsService, usersService } from "../services/index.js"
import __dirname from "../utils/index.js";
import { generateUsers, generatePets } from '../utils/mocks.js';
import CustomError from "../services/errors/custom.error.js";
import generateInfoError from "../services/errors/info.js";
import Errors from "../services/errors/enums.js";
import { createHash } from "../utils/index.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

const getMockingUsers = async (req, res) => {
    try {
        const users = [];
        for (let i = 0; i < 50; i++) {
            const user = generateUsers();
            user.password = await createHash(user.password);
            users.push(user);
        }

        const savedUsers = await usersService.insert(users);
        return res.status(201).json(savedUsers);
    } catch (error) {
        console.error('Error saving users:', error);
        return res.status(500).json({ error: 'Failed to save users', details: error });
    }
};

const postMockingUsers = async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        if (!first_name || !last_name || !email || !password) {
            throw CustomError.crearError({
                nombre: "Usuario nuevo",
                causa: generateInfoError({ first_name, last_name, email, password }),
                mensaje: "Error al intentar agregar un usuario",
                codigo: Errors.TIPO_INVALIDO
            });
        }

        const existingUser = await usersService.getBy({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email ya está registrado" });
        }

        const hashedPassword = await createHash(password);

        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
        };

        const savedUser = await usersService.create(user);

        res.status(201).json({ message: "Usuario agregado exitosamente", user: savedUser });
    } catch (error) {
        next(error);
    }
};

const generateData = async(req, res) => {
    try {
        const { users = 0, pets = 0 } = req.query;

        const petsList = [];
        for (let i = 0; i < Number(pets); i++) {
            const pet = generatePets();
            petsList.push(pet);
        }

        const savedPets = await petsService.insert(petsList);
        console.log(`${petsList.length} pets generated and saved.`);

        const usersList = [];
        for (let i = 0; i < Number(users); i++) {
            const user = generateUsers();
            user.password = await createHash(user.password);
            usersList.push(user);
        }

        const savedUsers = await usersService.insert(usersList);
        console.log(`${usersList.length} users generated and saved.`);

        return res.status(201).json({
            message: "Data generated successfully",
            generated: {
                users: savedUsers.length,
                pets: savedPets.length,
            },
        });
    } catch (error) {
        console.error("Error generating data:", error);
        return res.status(500).json({ error: "Failed to generate data" });
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    getMockingUsers,
    postMockingUsers,
    generateData
}