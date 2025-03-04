import Product from "../product/model.js";
import { Transaction } from "../transaction/model.js";

import fs from "fs";
// Xử lý thêm sản phẩm mới
export const addProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        let image = "";

        // Nếu có file được tải lên, chuyển file thành Base64
        if (req.file) {
            const imageBuffer = fs.readFileSync(req.file.path); // Đọc file từ thư mục tạm
            image = imageBuffer.toString("base64"); // Chuyển thành chuỗi Base64
        }

        // Tạo sản phẩm mới
        const newProduct = new Product({ name, price, description, image });
        await newProduct.save();

        res.redirect("/admin/products?message=Sản phẩm đã được thêm thành công!");
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        res.status(500).send("Lỗi khi thêm sản phẩm.");
    }
};

// Xử lý cập nhật sản phẩm
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        let imageBase64;
        if (req.file) {
            const imageBuffer = fs.readFileSync(req.file.path); // Đọc file từ thư mục tạm
            imageBase64 = imageBuffer.toString("base64"); // Chuyển thành chuỗi Base64
        }

        await Product.findByIdAndUpdate(id, {
            name,
            price,
            description,
            ...(req.file && { image: imageBase64 }), // Chỉ cập nhật ảnh nếu có file mới
        });

        res.redirect("/admin/products?message=Sản phẩm đã được cập nhật!");
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        res.status(500).send("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
};


// Xử lý xóa sản phẩm
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect("/admin/products?message=Sản phẩm đã được xóa!");
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).send("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
};
// Lấy danh sách đơn hàng cho Admin
export const getAdminOrders = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('userId', 'email').sort({ createdAt: -1 });
        res.render('admin-orders', { transactions });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};