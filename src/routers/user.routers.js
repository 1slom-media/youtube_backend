import { Router } from "express";
import { GET, LOGIN, REGISTER } from "../controllers/user.controller.js";
import checkToken from "../middlewares/checkToken.js";
import validation from "../middlewares/validation.js";
const router=Router()

router.get('/users',GET)
router.get('/users/:id',GET)
router.post('/login',validation,LOGIN);
router.post("/register",validation,REGISTER);

export default router;