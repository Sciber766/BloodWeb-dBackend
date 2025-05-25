const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    userId: {               // Unique user who created the request
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',        // Assuming you have a User model
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    urgency: {
        type: Number,
        required: true,
        min: 1,
        max: 5            // assuming urgency ranges from 1 to 5
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    pendingAccepts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
