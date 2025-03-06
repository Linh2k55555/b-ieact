import express from "express";
import { addToCart, removeFromCart, getCart } from "./controller.js";
import { isAuthenticated } from "../middleware/authMiddleware.js"; // Import named export

const router = express.Router();

// Lấy giỏ hàng
router.get("/", isAuthenticated, getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", isAuthenticated, addToCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove/:productId", isAuthenticated, removeFromCart);


export default router;