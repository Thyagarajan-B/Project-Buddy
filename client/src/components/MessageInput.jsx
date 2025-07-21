// src/components/Chat/MessageInput.jsx
import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content);
    setContent("");
  };

  return (
    <div className="input-area">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
