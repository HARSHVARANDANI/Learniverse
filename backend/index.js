import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import learningRoutes from "./routes/learning.routes.js";
import connectDB from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", learningRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
