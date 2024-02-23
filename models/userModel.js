import { Schema, model } from "mongoose";

// Create a user schema
const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

// Create a User model
const User = model("User", userSchema);

export default User;
