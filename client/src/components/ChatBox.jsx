// src/components/Chat/ChatBox.jsx
import React, { useEffect, useState } from "react";
import MessageInput from "./messageInput";
import MessageBubble from "./MessageBubble";
import socket from "../socket";
import axios from "axios";

const ChatBox = ({ group }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await axios.get(`/api/messages/${group._id}`);
      setMessages(res.data);
    };
    loadMessages();
  }, [group._id]);

  useEffect(() => {
    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new-message");
    };
  }, []);

  const sendMessage = async (content) => {
    const res = await axios.post(`/api/messages/${group._id}`, { content });

  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;
