// src/components/Chat/MessageBubble.jsx
import React from "react";

const MessageBubble = ({ message }) => {
  return (
    <div className={`bubble ${message.sender.role === "admin" ? "admin" : ""}`}>
      <strong>{message.sender.username}</strong>: {message.content}
    </div>
  );
};

export default MessageBubble;
