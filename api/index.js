import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
dotenv.config({ path: path.resolve("../.env") });
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);
