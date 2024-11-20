import mongoose from 'mongoose';
import { faker } from "@faker-js/faker";
import { createHash } from './index.js';

const generatePets = () => {
    return {
        name: faker.person.firstName(),
        specie: faker.animal.type(),
        birthDate: faker.date.past(5),
        adopted: false,
        owner: "",
        image: faker.image.url(),
    };
};

const generateUsers = () => {
    const pets = [];
    // let numeroDeMascotas = parseInt(faker.string.numeric({ min: 1, max: 5 }));

    // for (let i = 0; i < numeroDeMascotas; i++) {
    //     pets.push({
    //         _id: new mongoose.Types.ObjectId(), // Simulación de una referencia de mascota
    //     });
    // }
    
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: "coder123",
        role: 'user',
        pets: [],
    };
};

export { generatePets, generateUsers };