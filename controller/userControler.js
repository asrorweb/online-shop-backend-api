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
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

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

    if (!user) return res.status(401).json({ message: "user not found" });

    res.status(200).json({
      message: "User Verify successful",
    });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};

// get user information
// user malumotini jo'natish
export const getUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).select("-password").populate("basketProducts");

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // const { password, ...userWithOutPassword } = user;

    return res.status(200).json({ user });
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

// UZ: user ni yangilash uchun funksiya
// ENG: function to update a user
export const updateUser = async (req, res, next) => {
  const { _id } = req.user;
  let { email } = req.body;

  try {
    // Check if the request body contains a new email
    if (email) {
      // Check if the email is reserved by another user
      // Uz: Emailni boshqa user band qilganini tekshirish
      const existingUserWithUpdatedEmail = await User.findOne({ email });

      if (existingUserWithUpdatedEmail && existingUserWithUpdatedEmail._id.toString() !== _id) {
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    // Check if the request body contains a new password
    if (req.body.password) {
      // Hash the new password with bCrypt
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Update the password in req.body with the hashed one
      req.body.password = hashedPassword;
    }

    // Find the user by ID and update the fields from req.body
    const updatedUser = await User.findOneAndUpdate({ _id: _id }, { $set: req.body }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const JWTtoken = generateToken({ user: updatedUser });

    // Send a success response
    return res.status(200).json({
      message: "User updated succes",
      token: JWTtoken,
    });
  } catch (error) {
    next(error);
    // work in progress ErrorHandler.js
  }
};
