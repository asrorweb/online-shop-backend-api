import { Router } from "express";
import { registerUser } from "../controller/userControler.js";

const userRouter = Router();

userRouter.post("/register", registerUser);

export default userRouter;
