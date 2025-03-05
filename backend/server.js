import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo"; 
import { fileURLToPath } from "url";
import productRouter from "./product/router.js";
import authRouter from "./user/router.js";
import { connectDB } from "./config/db.js";
import homeRouter from "./home/router.js";
import logoutRouter from "./logout/router.js";
import updateUserRouter from "./updateuser/router.js"; 
import adminRouter from "./admin/router.js";
import cartRouter from './cart/router.js';
import transactionRoutes from './transaction/router.js';
import checkoutGuestRoutes from './guest/routercheckout.js';
import guestCartRouter from './guest/routerCart.js';
import forgotPasswordRouter from "./forgotpassword/router.js";
import cors from 'cors';  // Cài đặt CORS

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB(process.env.DB_URI);

// Cấu hình CORS - Đảm bảo các yêu cầu từ frontend được chấp nhận
app.use(cors({
  origin: 'http://localhost:3000',  // Chỉ cho phép frontend tại http://localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Các phương thức cho phép
  credentials: true,  // Cho phép gửi cookies với các yêu cầu
}));

// Cấu hình session - Đảm bảo session được tạo và quản lý đúng cách
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecretKey",  // Mã bí mật cho session
  resave: false,  // Không lưu lại session nếu không thay đổi
  saveUninitialized: false,  // Không lưu session mới nếu không có gì thay đổi
  cookie: {
    secure: false,  // Nếu dùng HTTPS thì đặt true
    httpOnly: true,  // Cookie không thể truy cập qua JavaScript
    maxAge: 1000 * 60 * 60 * 24,  // Cookie sống 1 ngày
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URI,
    collectionName: "sessions", // Lưu session vào collection "sessions"
  }),
}));

// Các route
app.use("/api", authRouter); // Người dùng
app.use("/api", productRouter); // Sản phẩm
app.use("/", logoutRouter); // Đăng xuất
app.use("/api", updateUserRouter); // Cập nhật thông tin người dùng
app.use("/admin", adminRouter); // Quản trị viên
app.use("/api/cart", cartRouter); // Giỏ hàng
app.use('/transactions', transactionRoutes); // Lịch sử giao dịch
app.use('/checkout/guest', checkoutGuestRoutes); // Thanh toán khách hàng chưa đăng nhập
app.use('/guest-cart', guestCartRouter); // Giỏ hàng khách hàng chưa đăng nhập
app.use("/", forgotPasswordRouter); // Quên mật khẩu

// Trang home (nếu có)
app.use("/", homeRouter);

// Cấu hình serve các file tĩnh (frontend React)
app.use(express.static(path.join(__dirname, 'public')));

// Khởi chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);

export default app;
export const viteNodeApp = app;
