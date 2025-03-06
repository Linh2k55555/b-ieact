import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateUser = () => {
  const [formData, setFormData] = useState({ username: "", age: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setFormData({
          username: response.data.user.username,
          age: response.data.user.age,
        });
      } catch (error) {
        window.alert("Lỗi khi lấy thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/user/update", formData, {
        withCredentials: true,
      });

      window.alert("Cập nhật thông tin thành công!");

      setTimeout(() => {
        window.location.href = "/home2"; 
      }, 2000);
    } catch (error) {
      window.alert("Lỗi khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default UpdateUser;
