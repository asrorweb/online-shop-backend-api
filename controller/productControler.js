import slugify from "slugify";
import Product from "../models/product-model.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";

export const createProduct = async (req, res, next) => {
  const { name } = req.body;
  try {
    //Uz: maxsulot nomini bo'shemasligini tekshiramiz
    // Eng: we check that the product name is not empty
    if (!name) return res.status(404).send({ message: "Product name is required" });

    // create a slug ex: apple-macbook-256-gb
    req.body.slug = slugify(name, { lower: true });

    // create a new product
    const newProduct = new Product(req.body);

    // save the new product
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    // find all products
    const products = await Product.find();

    res.status(200).json({ products });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;

    // Agar name parametri berilgan bo'lsa va uning qiymati ham mavjud bo'lsa
    if (name) {
      const regex = new RegExp(name, "i");
      const products = await Product.find({ name: { $regex: regex } }).populate({
        path: "comments.author",
        select: "email avatar", // Kerakli fildlar
      });

      res.status(200).json({ products });
    } else {
      // Agar name parametri berilmagan bo'lsa, barcha productlarni olib keladi
      const products = await Product.find();
      res.status(200).json({ products });
    }
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

export const createComment = async (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;
  const { comment } = req.body;
  try {
    // Yangi comment obyekti yaratish
    //  create a new comment
    const newComment = {
      author: new mongoose.Types.ObjectId(_id),
      comment,
    };

    // Productga yangi comment qo'shish
    // Add a new product review
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { comments: newComment } },
      { new: true }
    );

    // maxsulot borligini tekshirish
    // product availability check
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: "Comment added" });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

// UZ: productni o'chirish uchun funksiya
// ENG: function to delete a product
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    // Find the product by ID and delete
    const deletedPoduct = await Product.findByIdAndDelete(productId);

    if (!deletedPoduct) return res.status(404).json({ message: "Product not found" });

    // Remove the deleted product from the basketProducts array in all users
    // hamma user larning savatidan product ni olib tashlash agar u bo'lsa
    await User.updateMany({ basketProducts: productId }, { $pull: { basketProducts: productId } });

    // UZ: Agar muvaffaqiyatli o'chirilgan bo'lsa
    // ENG: If successfully deleted
    return res.status(200).json({ message: "Product deleted successfully", deletedPoduct });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

// UZ: productni taxrir qilish uchun funksiya
// ENG: function to update a product
export const editProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name } = req.body;
  console.log("prpoduct id", productId);

  try {
    if (name) {
      // create a slug ex: apple-macbook-256-gb
      req.body.slug = slugify(name, { lower: true });
    }

    // Find the product by ID and update the fields from req.body
    const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: req.body }, { new: true });

    console.log("updated product", updatedProduct);

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    // UZ: Agar muvaffaqiyatli taxrir qilingan bo'lsa
    // ENG: If successfully updated
    return res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

export const addProductToUserBasket = async (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;

  try {
    // Foydalanuvchini tanlab olish
    // Select a user
    const user = await User.findById(_id);

    // Maxsulotni bor ligini tekshirib olamiz
    // We can check product availability
    const isProduct = await Product.findById(productId);
    if (!isProduct) return res.status(404).json({ message: "Product not found" });

    // Check if the product is already in the basketProducts array
    if (user.basketProducts.includes(productId)) {
      return res.status(400).json({ error: "Product already in the basket" });
    }

    // Mahsulotni savatchaga qo'shish
    user.basketProducts.push(productId);

    // Foydalanuvchi obyektini saqlash
    // Save the user object
    await user.save();

    res.status(200).json({ message: "Product added to the basket successfully" });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

export const removeProductToUserBasket = async (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;

  try {
    // Foydalanuvchini tanlab olish
    // Select a user
    const user = await User.findById(_id);

    // Mahsulotni savatdan olib tashlash
    // Remove the product from the basket
    user.basketProducts.pull(productId);

    // Foydalanuvchi obyektini saqlash
    // Save the user object
    await user.save();

    res.status(200).json({ message: "Product remove from the basket successfully" });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};
