import { Router } from "express";
import {
  addProductToUserBasket,
  createComment,
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  removeProductToUserBasket,
  searchProducts,
} from "../controller/productControler.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import isAdminCheck from "../middlewares/isAdmin.js";

const productRouter = Router();

productRouter.post("/create", authenticateToken, isAdminCheck, createProduct);
productRouter.get("/all", getAllProducts);
productRouter.post("/add-comment/:productId", authenticateToken, createComment);
productRouter.get("/search", searchProducts);
productRouter.delete("/delete-product/:productId", authenticateToken, isAdminCheck, deleteProduct);
productRouter.put("/edit-product/:productId", authenticateToken, isAdminCheck, editProduct);
productRouter.post("/add-product-to-basket/:productId", authenticateToken, addProductToUserBasket);
productRouter.delete("/remove-product-from-basket/:productId", authenticateToken, removeProductToUserBasket);

export default productRouter;
