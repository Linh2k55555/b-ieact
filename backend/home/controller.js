import Product from "../product/model.js";
import Cart from '../cart/model.js';
import nodemailer from 'nodemailer';
import { Transaction } from "../transaction/model.js";
import fs from 'fs';
import path from 'path';

// Định đường dẫn đến ảnh QR
const qrImagePath = path.resolve("./QR/QR.jpg");

export const handleCheckout = async (req, res) => {
    console.log("Dữ liệu từ form:", req.body);
    const { fullName, phoneNumber, address, ward, district, city, paymentMethod } = req.body;
    const { userId } = req.session;

    // Kiểm tra nếu thiếu dữ liệu
    if (!fullName || !phoneNumber || !address || !ward || !district || !city || !paymentMethod) {
        return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán." });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Giỏ hàng trống. Không thể thanh toán." });
        }

        const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        const email = req.user?.email || "";
        if (!email) {
            return res.status(400).json({ error: "Không tìm thấy email người dùng." });
        }

        const orderDate = new Date().toLocaleString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // Cấu hình mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let emailBody = `
            <p>Cửa hàng cafe Coffe House xin chào.</p>
            <p>Cảm ơn bạn đã đặt hàng, <strong>${fullName}</strong>!</p>
            <p>Địa chỉ giao hàng: <strong>${address}, ${ward}, ${district}, ${city}</strong></p>
            <p>Số điện thoại: <strong>${phoneNumber}</strong></p>
            <p>Ngày giờ đặt hàng: <strong>${orderDate}</strong></p>
            <p>Tổng tiền: <strong>${total.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</strong></p>
            <p>Phương thức thanh toán: <strong>${paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}</strong></p>
            <p>Chi tiết đơn hàng:</p>
            <ul>
                ${cart.items
                    .map(
                        (item) =>
                            `<li>${item.productId.name}: ${item.productId.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })} x ${item.quantity}</li>`
                    )
                    .join("")}
            </ul>
            <p>Coffee House xin chân thành cảm ơn vì sự ủng hộ của bạn!</p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Xác nhận đơn hàng của bạn",
            html: emailBody,
            attachments: [],
        };

        if (paymentMethod !== "cod") {
            // Kiểm tra xem file QR có tồn tại không
            if (fs.existsSync(qrImagePath)) {
                mailOptions.html += `<p>Bạn vui lòng quét mã QR sau để thanh toán:</p>
                                     <img src="cid:qrCode" alt="QR Code" style="width:120px; height:120px;"/>`;
                mailOptions.attachments.push({
                    filename: "QR.jpg",
                    path: qrImagePath,
                    cid: "qrCode",
                });
            } else {
                console.warn("⚠️ Lưu ý: File QR không tồn tại.");
            }
        }

        await transporter.sendMail(mailOptions);

        // Lưu giao dịch vào DB
        const transaction = new Transaction({
            userId,
            fullName,
            phoneNumber,
            address,
            ward,
            district,
            city,
            total,
            paymentMethod,
            createdAt: new Date(),
        });
        await transaction.save();

        // Xóa giỏ hàng sau khi thanh toán
        await Cart.deleteOne({ userId });

        // Trả về JSON response thay vì `res.render()`
        res.status(200).json({
            message: "Đặt hàng thành công! Kiểm tra email để biết thêm chi tiết.",
            orderId: transaction._id,
            total,
            paymentMethod,
        });
    } catch (error) {
        console.error("❌ Lỗi khi xử lý thanh toán:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại sau." });
    }
};