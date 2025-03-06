import User from "../user/model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Cấu hình email SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// 📌 Gửi email đặt lại mật khẩu
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại trong hệ thống!" });
        }

        // Tạo token reset
        const token = crypto.randomBytes(20).toString("hex");

        // Lưu token vào database
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Hết hạn sau 1 giờ
        await user.save();

        // Gửi email đặt lại mật khẩu
        const resetUrl = `http://localhost:3000/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Yêu cầu đặt lại mật khẩu",
            text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào link sau để đặt lại mật khẩu:\n\n${resetUrl}\n\nLiên kết này sẽ hết hạn sau 1 giờ.`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư." });
    } catch (error) {
        console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
        res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau!" });
    }
};

// 📌 Kiểm tra token hợp lệ
export const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        res.json({ message: "Token hợp lệ", valid: true });
    } catch (error) {
        console.error("Lỗi khi xác minh token:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
    }
};

// 📌 Cập nhật mật khẩu mới
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu mới không khớp!" });
        }

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        // Cập nhật mật khẩu mới
        user.password = await bcryptjs.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Mật khẩu đã được cập nhật! Vui lòng đăng nhập." });
    } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
    }
};
