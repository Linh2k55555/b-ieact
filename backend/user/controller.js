import bcryptjs from 'bcryptjs';
import User from './model.js';

// Đăng ký
export const signup = async (req, res) => {
  const { username, password, confirmPassword, email, age } = req.body;

  try {
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return res.status(400).json({ errors: ["Mật khẩu chỉ được chứa chữ và số."] });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ errors: ["Mật khẩu và Xác nhận mật khẩu không khớp."] });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ errors: ["Tên người dùng đã tồn tại, vui lòng chọn tên khác."] });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ errors: ["Email đã được sử dụng, vui lòng chọn email khác."] });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      age,
    });

    res.status(201).json({ message: "Đăng ký thành công! Vui lòng đăng nhập." });
  } catch (err) {
    console.error("Lỗi trong quá trình đăng ký:", err);
    if (err.code === 11000) {
      let errorMsg = "Đã xảy ra lỗi, vui lòng thử lại.";
      if (err.keyPattern.username) {
        errorMsg = "Tên người dùng đã tồn tại, vui lòng chọn tên khác.";
      } else if (err.keyPattern.email) {
        errorMsg = "Email đã được sử dụng, vui lòng chọn email khác.";
      }
      return res.status(400).json({ errors: [errorMsg] });
    }
    res.status(500).json({ errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."] });
  }
  
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Nhận dữ liệu đăng nhập:", { email, password });

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu không được để trống." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại." });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu không chính xác." });
    }

    req.session.userId = user._id;
req.session.username = user.username;
req.session.role = user.role;
req.session.save(); // 🔥 Đảm bảo lưu session vào MongoDB

    // 🔥 Thêm log để kiểm tra session
    console.log("Session sau đăng nhập:", req.session);

    // Kiểm tra ngay lập tức nếu session có được lưu không
    req.session.save(err => {
      if (err) {
        console.error("Lỗi khi lưu session:", err);
        return res.status(500).json({ message: "Lỗi khi lưu session." });
      }
      
      console.log("Session đã được lưu:", req.session);
      res.json({
        message: "Đăng nhập thành công!",
        redirectUrl: user.role === "admin" ? "/admin" : "/home2",
      });
    });

  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
  }
};


// Thay đổi mật khẩu
export const updatePassword = async (req, res) => {
  const { oldPassword, password, confirmPassword } = req.body;

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!req.user) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Mật khẩu mới và xác nhận mật khẩu không khớp." });
  }

  try {
    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    // Trả về thông báo thành công
    res.json({ message: "Cập nhật mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
  }
};
// Đăng xuất
export const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Lỗi khi xóa session:", err);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng xuất." });
      }
      res.json({ message: "Bạn đã đăng xuất thành công!" });
    });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
  }
};
