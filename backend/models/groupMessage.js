const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupChat",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true 
});

const GroupMessage = mongoose.model("GroupMessage", messageSchema);

module.exports = GroupMessage;
