const express = require("express");
const Message = require("../models/groupMessage");
const protect = require('../middleware/authMiddleware');
const Group = require("../models/groupChat");

const messageRouter = express.Router()

messageRouter.post("/send", protect, async (req, res) => {
    try {
        const { groupId, content } = req.body;

        // Validate
        if (!groupId || !content) {
            return res.status(400).json({ message: "groupId and content are required" });
        }

        // Check if user is part of group
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (
            !group.members.includes(req.user._id) &&
            group.admin.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized to send message in this group" });
        }

        // Create message
        const newMessage = await Message.create({
            chatId: groupId,
            sender: req.user._id,
            content,
            timestamp: new Date(),
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
});

messageRouter.get("/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;

        // Check if group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is in the group
        if (
            !group.members.includes(req.user._id) &&
            group.admin.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized to view messages in this group" });
        }

        // Get messages
        const messages = await Message.find({ chatId: groupId })
            .populate("sender", "username profilePic") // Optional: to show sender info
            .sort({ timestamp: 1 }); // Sort oldest to newest

        res.status(200).json(messages);
    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

messageRouter.delete("/:messageId", protect, async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const group = await Group.findById(message.chatId);
        if (!group) {
            return res.status(404).json({ message: "Associated group not found" });
        }

        const isSender = message.sender.toString() === req.user._id.toString();
        const isAdmin = group.admin.toString() === req.user._id.toString();

        if (!isSender && !isAdmin) {
            return res.status(403).json({ message: "Only sender or group admin can delete this message" });
        }

        await message.deleteOne();

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Delete Message Error:", error);
        res.status(500).json({ message: "Failed to delete message" });
    }
});


module.exports = messageRouter;