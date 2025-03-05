import User from "../user/model.js";

// Middleware xác thực người dùng
export const isAuthenticated = async (req, res, next) => {
  // Kiểm tra session để xác định người dùng đã đăng nhập chưa
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });  // Trả về JSON thay vì chuỗi văn bản
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên session.userId
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng." }); // Trả về JSON
    }

    req.user = user; // Gắn thông tin người dùng vào request
    next();  // Tiếp tục xử lý nếu người dùng hợp lệ
  } catch (error) {
    console.error("Lỗi trong middleware isAuthenticated:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi." });  // Trả về JSON
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.session || req.session.role !== "admin") {
    return res.status(403).send("Bạn không có quyền truy cập.");
  }
  next();
};