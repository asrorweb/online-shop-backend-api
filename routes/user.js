import { Router } from "express";
import {
  deleteUser,
  getUser,
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
userRouter.get("/get-user", authenticateToken, getUser);
userRouter.delete("/delete", authenticateToken, deleteUser);
userRouter.put("/update", authenticateToken, updateUser);

export default userRouter;
