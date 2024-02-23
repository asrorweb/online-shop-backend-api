import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/online-shop");
    console.log("Connected to database");
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
};

export default connectToDatabase;
