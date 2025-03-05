import express from "express";
import User from "../user/model.js";
export const getUserInfo = async (req, res) => {
  try {
    console.log("Session data:", req.session); // Check if session data exists
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateUser = async (req, res) => {
  const { username, email, age } = req.body;
  
  try {
    // Giả sử bạn đã kiểm tra và lấy người dùng qua session
    const user = await User.findById(req.user._id);  // Lấy thông tin người dùng từ session
    
    // Cập nhật thông tin người dùng
    user.username = username || user.username;
    user.email = email || user.email;
    user.age = age || user.age;

    // Lưu thay đổi vào cơ sở dữ liệu
    await user.save();

    // Trả về phản hồi thành công
    res.json({
      message: "Cập nhật thông tin thành công!", 
      redirectUrl: "/home2" // Trang bạn muốn chuyển hướng sau khi cập nhật
    });

  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau." });
  }
};
