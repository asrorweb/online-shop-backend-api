import express from "express";
import connectToDatabase from "./config/server.js";
import userRouter from "./routes/user.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import dotenv from "dotenv";
import productRouter from "./routes/product-route.js";

// Create an Express application
const app = express();
app.use(express.json());

dotenv.config();

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(ErrorHandler);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  // connect to DB
  await connectToDatabase();
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
