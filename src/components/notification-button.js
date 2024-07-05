import React from 'react';
import { FaBell } from 'react-icons/fa';
import './notification-button.css';

const NotificationButton = ({ onClick }) => {
  return (
    <div className="notification-button" onClick={onClick}>
      <FaBell />
      <span className="notification-count">3</span> {/* Example count */}
    </div>
  );
};

export default NotificationButton;
