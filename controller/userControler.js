import generateToken from "../config/generateJWT.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// UZ: user ni registratsiya qilish uchun funksiya
// ENG: function for user registration
export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  // ENG: We lowercase all letters of the email to register correctly
  // Uz: email ni hamma harflarini kichik qilib olamiz to'ri register qilish uchun
  const email_toLower = email.toLowerCase();

  // ENG: Hash the password before storing it
  // UZ: Parolni saqlashdan oldin uni hashlang
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Find the user by email
    const existingUser = await User.findOne({ email: email_toLower });

    // Check if the email already exists
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Create a new user
    const newUser = new User({
      email: email_toLower,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

// UZ: user ni login qilish uchun funksiya
// ENG: function for login user
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // ENG: We lowercase all letters of the email to login correctly
  // Uz: email ni hamma harflarini kichik qilib olamiz to'ri login qilish uchun
  const email_toLower = email.toLowerCase();

  try {
    // Find the user by email
    const user = await User.findOne({ email: email_toLower });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "wrong password" });
    }

    const JWTtoken = generateToken({ user });

    res.status(200).json({
      message: "Login successful",
      token: JWTtoken,
    });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

// Uz: user ni jwt bilan tasdiqlash
// Eng: verify user wiht jwt
export const verifyUserWithToken = async (req, res) => {
  const { email } = req.user;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    res.status(200).json({
      message: "User Verify successful",
    });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

// Uz: user ni o'chirish jwt dan kelgan id bilan
// Eng: delete user with _id
export const deleteUser = async (req, res) => {
  const { _id } = req.user;
  try {
    // Find the user by _id and delete
    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(401).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};
