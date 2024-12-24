import request from 'supertest';
import mongoose from 'mongoose';
import { startServer } from '../src/app.js';
import Adoption from '../src/dao/models/Adoption.js';
import User from '../src/dao/models/User.js';
import Pet from '../src/dao/models/Pet.js';
import chai from 'chai';

const expect = chai.expect;

describe("Adoption Router Functional Tests", function () {
    let server;
    let testUser;
    let testPet;
    let testAdoption;

    before(async function () {
        this.timeout(5000);
        await mongoose.connect(process.env.MONGODB_URI);
        server = await startServer(8081);
    });

    beforeEach(async function () {
        await Adoption.deleteMany({});
        await User.deleteMany({});
        await Pet.deleteMany({});

        testUser = await User.create({
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            password: "password123"
        });

        testPet = await Pet.create({
            name: "TestPet",
            specie: "Dog",
            birthDate: new Date(),
            adopted: false
        });

        testAdoption = await Adoption.create({
            owner: testUser._id,
            pet: testPet._id
        });
    });

    describe("GET /api/adoptions", function () {
        it("should return all adoptions", async function () {
            const response = await request(server)
                .get('/api/adoptions')
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(1);
        });
    });

    describe("GET /api/adoptions/:aid", function () {
        it("should return a specific adoption", async function () {
            const response = await request(server)
                .get(`/api/adoptions/${testAdoption._id}`)
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body.payload).to.have.property('_id', testAdoption._id.toString());
        });

        it("should return 404 for non-existent adoption", async function () {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(server)
                .get(`/api/adoptions/${fakeId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Adoption not found');
        });
    });

    describe("POST /api/adoptions/:uid/:pid", function () {
        it("should create a new adoption", async function () {
            const newPet = await Pet.create({
                name: "NewPet",
                specie: "Cat",
                birthDate: new Date(),
                adopted: false
            });

            const response = await request(server)
                .post(`/api/adoptions/${testUser._id}/${newPet._id}`)
                .expect(200);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Pet adopted');

            const updatedPet = await Pet.findById(newPet._id);
            expect(updatedPet.adopted).to.be.true;
        });

        it("should return 404 for non-existent user", async function () {
            const fakeUserId = new mongoose.Types.ObjectId();
            const response = await request(server)
                .post(`/api/adoptions/${fakeUserId}/${testPet._id}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'user Not found');
        });

        it("should return 404 for non-existent pet", async function () {
            const fakePetId = new mongoose.Types.ObjectId();
            const response = await request(server)
                .post(`/api/adoptions/${testUser._id}/${fakePetId}`)
                .expect(404);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Pet not found');
        });

        it("should return 400 for already adopted pet", async function () {
            const adoptedPet = await Pet.create({
                name: "AdoptedPet",
                specie: "Dog",
                birthDate: new Date(),
                adopted: true
            });

            const response = await request(server)
                .post(`/api/adoptions/${testUser._id}/${adoptedPet._id}`)
                .expect(400);

            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Pet is already adopted');
        });
    });

    describe("POST /api/users", function () {
        it("should create a new user", async function () {
            const newUser = {
                first_name: "New",
                last_name: "User",
                email: "newuser@example.com",
                password: "newpassword123"
            };

            const response = await request(server)
                .post('/api/users')
                .send(newUser)
                .expect(201);

            expect(response.body).to.have.property('status', 'success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.email).to.equal(newUser.email);
        });
    });

    after(async function () {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.disconnect();
    });
});