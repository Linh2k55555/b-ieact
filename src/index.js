import React from 'react';
import ReactDOM from 'react-dom/client';  // Sử dụng 'react-dom/client'
import App from './App';

// Tạo root mới và render ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
