import Cart from './model.js';
import mongoose from 'mongoose';

// Lấy giỏ hàng
export const getCart = async (req, res) => {
    const { userId } = req.session; // Lấy userId từ session
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            // Nếu giỏ hàng không tồn tại, trả về giỏ hàng rỗng
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy giỏ hàng", error });
    }
};  

export const updateCart = async (req, res) => {
    const { userId } = req.session; // Lấy userId từ session
    const { items } = req.body; // Lấy danh sách sản phẩm từ body

    if (!userId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
    }

    try {
        // Kiểm tra dữ liệu
        if (!items || !Array.isArray(items) || items.some(item => !item.productId)) {
            return res.status(400).json({ message: "Dữ liệu sản phẩm không hợp lệ" });
        }

        const normalizedItems = items.map(item => ({
            productId: mongoose.Types.ObjectId(item.productId),
            quantity: item.quantity || 1,
        }));

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: normalizedItems });
        } else {
            cart.items = normalizedItems;
        }

        await cart.save();
        res.json({ message: "Cập nhật giỏ hàng thành công", cart });
    } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error });
    }
};

export const removeFromCart = async (req, res) => {
    const { userId } = req.session; // ✅ Lấy userId từ session
    const { productId } = req.params; // ✅ Lấy productId từ URL params

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });
        }

        // Kiểm tra nếu sản phẩm có trong giỏ hàng không
        const itemExists = cart.items.some(item => item.productId.toString() === productId);
        if (!itemExists) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng.' });
        }

        // Lọc bỏ sản phẩm cần xóa
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Lưu lại giỏ hàng sau khi xóa
        await cart.save();

        return res.json({ message: 'Sản phẩm đã được xoá khỏi giỏ hàng.' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau.' });
    }
};

export const addToCart = async (req, res) => {
    const { productId, price } = req.body;
    const userId = req.session.userId;  // Lấy ID người dùng từ session

    console.log("Session hiện tại:", req.session);  // Debug xem session có lưu userId không

    if (!userId) {
        if (!req.session.cart) {
            req.session.cart = { items: [] };
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = req.session.cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            req.session.cart.items.push({
                productId,
                price,
                quantity: 1,
            });
        }

        req.session.save((err) => {
            if (err) {
                console.error("Lỗi khi lưu session giỏ hàng:", err);
                return res.status(500).json({ message: "Không thể lưu giỏ hàng tạm thời." });
            }
            return res.status(200).json({ message: "Sản phẩm đã được thêm vào giỏ hàng tạm thời!" });
        });

        return;
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, price, quantity: 1 }],
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ productId, price, quantity: 1 });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
    }
};

