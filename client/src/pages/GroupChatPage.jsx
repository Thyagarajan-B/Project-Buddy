// src/pages/GroupChatPage.jsx
import React, { useEffect, useState } from "react";
import socket from "../socket";
import ChatBox from "../components/chatBox";
import axios from "axios";
import { useParams } from "react-router-dom";

const GroupChatPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        socket.emit("join-group", groupId); // join socket room
        return () => {
            socket.emit("leave-group", groupId); // leave on unmount
        };
    }, [groupId]);

    useEffect(() => {
        const fetchGroup = async () => {
            const res = await axios.get(`/api/group/${groupId}`);
            setGroup(res.data.group);
        };
        fetchGroup();
    }, [groupId]);

    if (!group) return <div>Loading group chat...</div>;

    return <ChatBox group={group} />;
};

export default GroupChatPage;
