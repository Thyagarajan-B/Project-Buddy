const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    rolesNeeded: {
        type: [String],
        required: true
    },
    teamSize: {
        type: Number,
        require: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: String,   
            email: String,
            portfolio: String,
            message: String,
            status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
        }
    ],
    team: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    leaveRequests: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            message: String,
            status: {
                type: String,
                enum: ["pending", "approved", "rejected"],
                default: "pending"
            }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
