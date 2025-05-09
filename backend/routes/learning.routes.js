import express from "express";
import { generateLearningContent } from "../controllers/learning.controller.js";
import { handleLogin } from "../controllers/login.controller.js";
import getHistory from "../controllers/histroy.controller.js";

const router = express.Router();

router.post("/learn", generateLearningContent);
router.post("/login", handleLogin);
router.post("/history", getHistory);

export default router;
