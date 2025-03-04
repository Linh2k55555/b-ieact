import express from "express";
import multer from "multer";
import {
    addProduct,
    updateProduct,
    deleteProduct,
} from "./controller.js"; // Import controller
import { isAdmin } from "../middleware/authMiddleware.js"; // Middleware kiểm tra quyền admin
import {  getAdminOrders } from "./controller.js";

// Cấu hình lưu tệp tạm thời với Multer
const storage = multer.memoryStorage();
// const upload = multer({ storage });
const upload = multer({ dest: "uploads/" }); 
const router = express.Router();

// Route: Trang quản lý sản phẩm

// Route: Thêm sản phẩm mới
router.post("/products", isAdmin, upload.single("image"), addProduct);

// Route: Cập nhật sản phẩm
router.post("/products/:id", isAdmin, upload.single("image"), updateProduct);

// Route: Xóa sản phẩm
router.get("/products/delete/:id", isAdmin, deleteProduct);

// Route để xem danh sách đơn hàng
router.get('/orders', getAdminOrders);

export default router;
