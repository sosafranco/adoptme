import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import { generatePets } from '../utils/mocks.js';
import CustomError from "../services/errors/custom.error.js";
import generateInfoError from "../services/errors/info.js";
import Errors from "../services/errors/enums.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const createPet = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId,petUpdateBody);
    res.send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({status:"success",message:"pet deleted"});
}

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    console.log(file);
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}

const getMockingPets = async(req, res) => {
    try {
        const pets = [];
        for (let i = 0; i < 100; i++) {
            const pet = generatePets();
            pets.push(pet);
        }

        const savedPets = await petsService.insert(pets)
        return res.status(201).json(savedPets);
    } catch (error) {
        console.error('Error saving pets:', error);
        return res.status(500).json({ error: 'Failed to save pets' });
    }
};

const postMockingPets = async(req, res, next) => {
    const { name, specie } = req.body;
    try {
        if (!name || !specie) {
            throw CustomError.crearError({
                nombre: "Mascota nueva",
                causa: generateInfoError({ name, specie }),
                mensaje: "Error al intentar agregar una mascota",
                codigo: Errors.TIPO_INVALIDO
            });
        }

        const pet = PetDTO.getPetInputFrom({ name, specie });
        const savedPet = await petsService.create(pet);
        res.status(201).json({ message: "Mascota agregada exitosamente", pet: savedPet });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
    getMockingPets,
    postMockingPets
}