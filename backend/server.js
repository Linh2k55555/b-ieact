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
import forgotPasswordRouter from "./forgotpassword/router.js";
import cors from 'cors';  // Cài đặt CORS
import xlsx from "xlsx";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB(process.env.DB_URI);


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // 🔥 Quan trọng để session hoạt động
}));

// Đảm bảo middleware session được khai báo TRƯỚC khi sử dụng route
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecretKey",
  resave: false,
  saveUninitialized: false,
  proxy: true,  
  cookie: {
    secure: false,  // Nếu HTTPS thì đổi thành true
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 ngày
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URI,
    collectionName: "sessions",
  }),
}));


// Middleware để kiểm tra session
app.use((req, res, next) => {
  console.log("✅ Middleware session hiện tại:", req.session);
  next();
});

// Các route
app.use("/api", authRouter); // Người dùng
app.use("/api", productRouter); // Sản phẩm
app.use("/", logoutRouter); // Đăng xuất
app.use("/api", updateUserRouter); // Cập nhật thông tin người dùng
app.use("/admin", adminRouter); // Quản trị viên
app.use("/api/cart", cartRouter); // Giỏ hàng
app.use('/transactions', transactionRoutes); // Lịch sử giao dịch
app.use("/", forgotPasswordRouter); // Quên mật khẩu

// Trang home (nếu có)
app.use("/", homeRouter);

// Cấu hình serve các file tĩnh (frontend React)
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/auth/check", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  console.log("🔍 Kiểm tra session từ Frontend:", req.session);

  if (req.session && req.session.userId) {
    return res.json({ isAuthenticated: true, userId: req.session.userId, username: req.session.username });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

//aapi tỉnh thành
// Đọc dữ liệu từ file Excel
const filePath = "diachi.xlsx"; // Đảm bảo file này nằm trong thư mục của server
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Chuẩn hóa danh sách tỉnh/thành phố
const cities = [];
const districts = [];
const wards = [];

sheetData.forEach((row, index) => {
  let city = cities.find(c => c.name === row["Tỉnh / Thành Phố"]);
  if (!city) {
    city = {
      id: cities.length + 1,
      name: row["Tỉnh / Thành Phố"],
    };
    cities.push(city);
  }

  let district = districts.find(d => d.name === row["Quận Huyện"] && d.cityId === city.id);
  if (!district) {
    district = {
      id: districts.length + 1,
      name: row["Quận Huyện"],
      cityId: city.id,
    };
    districts.push(district);
  }

  wards.push({
    id: wards.length + 1,
    name: row["Tên"],
    districtId: district.id,
  });
});

// API lấy danh sách tỉnh/thành phố
app.get("/api/cities", (req, res) => {
  res.json(cities);
});

// API lấy danh sách quận/huyện theo cityId
app.get("/api/districts/:cityId", (req, res) => {
  const cityId = parseInt(req.params.cityId);
  const filteredDistricts = districts.filter(d => d.cityId === cityId);

  if (filteredDistricts.length === 0) {
    return res.status(404).json({ message: "Không tìm thấy quận/huyện nào cho tỉnh/thành phố này" });
  }

  res.json(filteredDistricts);
});
app.get("/api/wards/:districtId", (req, res) => {
  const districtId = parseInt(req.params.districtId);
  const filteredWards = wards.filter(ward => ward.districtId === districtId);

  if (!filteredWards.length) {
    return res.status(404).json({ message: "Không tìm thấy phường/xã cho quận/huyện này" });
  }

  res.json({ wards: filteredWards });
});

// Khởi chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);

export default app;
export const viteNodeApp = app;
