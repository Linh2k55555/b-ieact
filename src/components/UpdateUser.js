import React, { useState } from 'react';

const UpdateUser = ({ user, errors }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    age: user.age || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission goes here (e.g., API call to update user)
    console.log('Form submitted', formData);
  };

  return (
    <div className="container">
      <h1>Cập nhật thông tin</h1>
      
      {errors && errors.length > 0 && (
        <div className="errors">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Tên người dùng"
            required
          />
        </div>
      
        <div className="input-group">
          <i className="fas fa-calendar"></i>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Tuổi"
            required
          />
        </div>
      
        <button type="submit">Cập nhật thông tin</button>
      </form>
      
      <div className="extra-links">
        <p><a href="/home2">Quay lại trang chủ</a></p>
      </div>
    </div>
  );
};

export default UpdateUser;
