import { Router } from "express";
import {
  deleteUser,
  loginUser,
  registerUser,
  updateUser,
  verifyUserWithToken,
} from "../controller/userControler.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", authenticateToken, verifyUserWithToken);
userRouter.delete("/delete", authenticateToken, deleteUser);
userRouter.put("/update", authenticateToken, updateUser);

export default userRouter;
