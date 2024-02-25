import { Schema, model } from "mongoose";

// Create a user schema
const userSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, require: true, default: false },
    avatar: {
      type: String,
      require: true,
      default: "https://www.svgrepo.com/show/452030/avatar-default.svg",
    },
    basketProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a User model
const User = model("User", userSchema);

export default User;
