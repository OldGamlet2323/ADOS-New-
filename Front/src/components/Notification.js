import React, { useEffect } from 'react';
import './Notification.css'; // We will create this CSS file next

const Notification = ({ message, onClose }) => {
    // Optional: Automatically close the notification after some time
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 8000); // The notification will disappear after 8 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="notification-banner">
            <p>{message}</p>
            <button className="close-notification-btn" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};

export default Notification;