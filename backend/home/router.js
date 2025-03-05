import express from "express";
import {  handleCheckout } from "../home/controller.js"; 
import { isAuthenticated  } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/checkout', isAuthenticated, handleCheckout);



export default router;
