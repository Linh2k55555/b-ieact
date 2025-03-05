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
        const token = localStorage.getItem("authToken"); // Get the token from local storage or any other storage
        const response = await axios.get("http://localhost:8080/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
          withCredentials: true, // Ensure to send cookies with the request
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

    try {
      const token = localStorage.getItem("authToken"); // Get the token from local storage or any other storage
      await axios.post(
        "http://localhost:8080/api/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
          withCredentials: true,
        }
      );
      setMessage("Cập nhật thông tin thành công!");
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
          />
        </div>
        <div>
          <label>Tuổi:</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
        <button type="submit">Cập nhật</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateUser;