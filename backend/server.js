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

// Cấu hình CORS để frontend có thể gửi yêu cầu từ các domain khác (như http://localhost:3000)
app.use(cors({
    origin: "http://localhost:3000",  // Đảm bảo rằng frontend ở đúng địa chỉ này
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true  // Cho phép gửi cookie từ frontend
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình session
app.use(session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        collectionName: "sessions",
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Cookie sống trong 1 ngày
        httpOnly: true, // Không cho phép JavaScript trên client truy cập cookie
        secure: false, // Đảm bảo true khi chạy HTTPS
    },
}));

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB(process.env.DB_URI);

// Các route
app.use("/api", authRouter); // Người dùng
app.use("/api", productRouter); // Sản phẩm
app.use("/", logoutRouter); // Đăng xuất
app.use("/user", updateUserRouter); // Cập nhật thông tin người dùng
app.use("/admin", adminRouter); // Quản trị viên
app.use("/api/cart", cartRouter); // Giỏ hàng
app.use('/transactions', transactionRoutes); // Lịch sử giao dịch
app.use('/checkout/guest', checkoutGuestRoutes); // Thanh toán khách hàng chưa đăng nhập
app.use('/guest-cart', guestCartRouter); // Giỏ hàng khách hàng chưa đăng nhập
app.use("/", forgotPasswordRouter); // Quên mật khẩu

// Đăng ký
app.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});

// Đăng nhập (POST) - xử lý đăng nhập từ frontend
app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra email và password (ví dụ: bạn cần truy vấn database để xác thực người dùng)
    if (email === "admin@example.com" && password === "123456") {
        // Lưu thông tin người dùng vào session
        req.session.user = { email };
        return res.json({ success: true, message: "Đăng nhập thành công!" });
    } else {
        // Trả về lỗi nếu email hoặc password không đúng
        return res.json({ success: false, message: "Email hoặc mật khẩu không đúng!" });
    }
});

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
