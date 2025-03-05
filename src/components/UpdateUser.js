import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateUser = () => {
  const [formData, setFormData] = useState({ username: "", age: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user information from the API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true, // Đảm bảo gửi cookies với yêu cầu
        });
        setFormData({
          username: response.data.user.username,
          age: response.data.user.age,
        });
        setLoading(false);
      } catch (error) {
        setMessage("Lỗi khi lấy thông tin người dùng.");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message trước khi gửi yêu cầu

    try {
      await axios.post(
        "http://localhost:8080/api/user/update",
        formData,
        {
          withCredentials: true, // Đảm bảo gửi cookies với yêu cầu
        }
      );
      setMessage("Cập nhật thông tin thành công!");
      setTimeout(() => {
        // Sau khi cập nhật thành công, chuyển hướng về trang chủ hoặc trang hồ sơ
        window.location.href = "/home2";  // Hoặc bạn có thể thay đổi URL tùy ý
      }, 2000); // Chờ 2 giây trước khi chuyển hướng
    } catch (error) {
      setMessage("Lỗi khi cập nhật thông tin.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Cập nhật thông tin người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên người dùng:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Tuổi:</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateUser;
