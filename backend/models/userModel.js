const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        portfolio: { type: String, default: '' }
    },
    profilePic: {
        type: String,
        default: "",
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
