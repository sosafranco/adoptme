// Instalar: npm i @faker-js/faker
import { faker } from "@faker-js/faker/locale/es"; // Configurar Faker para español
import { createHash } from "../utils/index.js";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";

class MockingService {
    static async generateMockingUsers(num) {
        const users = [];
        for (let i = 0; i < num; i++) {
            const user = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: await createHash("coder123"),
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: [], // Relación con mascotas, puedes agregar mascotas aquí si deseas
            };
            // Inserta el usuario en la base de datos
            const savedUser = await User.create(user); // Guarda en la base de datos
            users.push(savedUser); // Agrega el usuario guardado a la lista
        }
        return users; // Retorna los usuarios generados y guardados
    }

    static async generateMockingPets(num) {
        const pets = [];
        const allowedSpecies = [
            { name: "Perro", image: "https://placekitten.com/300/200" },
            { name: "Gato", image: "https://placekitten.com/300/200" },
            { name: "Hurón", image: "https://placekitten.com/300/200" },
            { name: "Gecko", image: "https://placekitten.com/300/200" },
            { name: "Lagarto", image: "https://placekitten.com/300/200" },
            { name: "Hámster", image: "https://placekitten.com/300/200" },
            { name: "Cobaya", image: "https://placekitten.com/300/200" },
            { name: "Pájaro", image: "https://placekitten.com/300/200" },
            { name: "Pez", image: "https://placekitten.com/300/200" }
        ]; // Lista de especies permitidas con imagen

        for (let i = 0; i < num; i++) {
            const species = faker.helpers.arrayElement(allowedSpecies); // Elegir una especie
            const pet = {
                name: faker.helpers.arrayElement([faker.animal.dog(), faker.animal.cat()]),
                specie: species.name,
                adopted: false,
                image: species.image
            };
            // Inserta la mascota en la base de datos
            const savedPet = await Pet.create(pet); // Guarda en la base de datos
            pets.push(savedPet); // Agrega la mascota guardada a la lista
        }
        console.log(pets);
        return pets; // Retorna las mascotas generadas y guardadas
    }
}

export default MockingService;