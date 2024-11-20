import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get("/mockingpets", petsController.getMockingPets);
router.post("/mockingpets", petsController.postMockingPets);
router.get("/pets", petsController.getAllPets);
router.get("/mockingusers", usersController.getMockingUsers);
router.post("/mockingusers", usersController.postMockingUsers);
router.get("/users", usersController.getAllUsers);
router.post("/generatedata", usersController.generateData);

export default router;