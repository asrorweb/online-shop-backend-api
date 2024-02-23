import { Router } from "express";
import { loginUser, registerUser } from "../controller/userControler.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
