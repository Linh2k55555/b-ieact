// src/components/MessageAlert.js
import React, { useEffect, useState } from 'react';
import '../css/MessageAlert.css';

const MessageAlert = ({ message }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show || !message) return null;

  return (
    <div className="message show" id="message-alert">
      <i className="fas fa-check-circle message-icon"></i>
      <span>{message}</span>
    </div>
  );
};

export default MessageAlert;
