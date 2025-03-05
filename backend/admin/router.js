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
router.get("/products", isAdmin, async (req, res) => {
    try {
        const products = await Product.find(); // Lấy tất cả sản phẩm
        res.render("admin-products", { products });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).send("Đã xảy ra lỗi khi lấy sản phẩm.");
    }
});


export default router;
