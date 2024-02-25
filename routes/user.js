import { Router } from "express";
import {
  deleteUser,
  loginUser,
  registerUser,
  verifyUserWithToken,
} from "../controller/userControler.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", authenticateToken, verifyUserWithToken);
userRouter.delete("/delete", authenticateToken, deleteUser);

export default userRouter;
