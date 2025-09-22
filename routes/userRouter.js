import express  from "express";
import { logingUser, registerUser } from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.post("/",registerUser)

UserRouter.post("/login",logingUser)

export default UserRouter;