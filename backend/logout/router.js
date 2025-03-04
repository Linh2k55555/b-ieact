import express from "express";
import { logout } from "../user/controller.js";

const router = express.Router();

router.get("/logout", logout); 

export default router;
