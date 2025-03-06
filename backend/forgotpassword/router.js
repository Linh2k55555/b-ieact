import express from "express";
import { forgotPassword, verifyResetToken, resetPassword } from "./controller.js";

const router = express.Router();

// Gửi email quên mật khẩu
router.post("/forgot-password", forgotPassword);

// Kiểm tra token reset mật khẩu
router.get("/reset-password/:token", verifyResetToken);

// Cập nhật mật khẩu mới
router.post("/reset-password/:token", resetPassword);

export default router;
