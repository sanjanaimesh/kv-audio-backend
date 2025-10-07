import express  from "express";
import { blockUnblockUser, getAllUsers, logingUser, registerUser } from "../controllers/userController.js";
import User from "../models/user.js";

const UserRouter = express.Router();

UserRouter.post("/",registerUser)

UserRouter.post("/login",logingUser)

UserRouter.get("/all" , getAllUsers)
UserRouter.put("/block/:email" , blockUnblockUser)



export default UserRouter;