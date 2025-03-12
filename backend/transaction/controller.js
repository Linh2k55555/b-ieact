import { Transaction } from "./model.js";
import { sendEmail } from "../utils/email.js"; 

export const getTransactionHistory = async (req, res) => {
    const { userId } = req.session;

    if (!userId) {
        return res.status(401).json({ error: "Bạn chưa đăng nhập" });
    }

    try {
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.json({ transactions });
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử giao dịch:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại sau." });
    }
};

// ✅ Hủy đơn hàng, KHÔNG thể đổi trạng thái sau khi hủy
export const cancelTransaction = async (req, res) => {
    const { userId } = req.session;
    const { transactionId } = req.params;

    if (!userId) {
        return res.status(401).send("Vui lòng đăng nhập để thực hiện thao tác này.");
    }

    try {
        const transaction = await Transaction.findOne({ _id: transactionId, userId })
            .populate("userId", "email"); 

        if (!transaction) {
            return res.status(404).send("Không tìm thấy đơn hàng.");
        }

        if (["Đang giao", "Đã giao"].includes(transaction.status)) {
            return res.status(400).send("Không thể hủy đơn hàng khi đang giao hoặc đã giao.");
        }

        transaction.status = "Đã huỷ";
        await transaction.save();

        if (transaction.userId?.email) {
            sendEmail(transaction.userId.email, "Đơn hàng đã bị hủy", "Đơn hàng của bạn đã bị hủy thành công.");
        } else {
            console.error("❌ Không tìm thấy email của người dùng để gửi thông báo.");
        }

        res.json({ message: "Đơn hàng đã được hủy thành công!" });
    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        res.status(500).send("Có lỗi xảy ra, vui lòng thử lại.");
    }
};

// ✅ Chặn cập nhật trạng thái nếu đơn đã bị hủy
export const updateTransactionStatus = async (req, res) => {
    const { transactionId } = req.params;
    const { status } = req.body;

    try {
        const transaction = await Transaction.findById(transactionId).populate("userId", "email"); 

        if (!transaction) {
            return res.status(404).send("Không tìm thấy đơn hàng.");
        }

        if (transaction.status === "Đã huỷ") {
            return res.status(400).send("Không thể cập nhật trạng thái vì đơn hàng đã bị hủy.");
        }

        transaction.status = status;
        await transaction.save();

        if (transaction.userId?.email) {
            sendEmail(transaction.userId.email, "Cập nhật trạng thái đơn hàng", 
                `Cửa hàng Cafe House xin chào. Đơn hàng của bạn hiện có trạng thái: ${status}`);
        } else {
            console.error("❌ Không tìm thấy email của người dùng để gửi thông báo.");
        }

        res.json({ message: "Cập nhật trạng thái đơn hàng thành công!" });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        res.status(500).send("Có lỗi xảy ra, vui lòng thử lại.");
    }
};
