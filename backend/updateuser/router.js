// router.js (Updated)
import express from "express";
import { getUserInfo, updateUser } from "./controller.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Endpoint to fetch user info (GET)
router.get("/user", isAuthenticated, getUserInfo); // Fetch user info

// Endpoint to update user info (POST)
router.post("/user/update", isAuthenticated, updateUser); // Update user info

export default router;
