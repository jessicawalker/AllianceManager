const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema({
    member_username: {
        type: String,
        required: true
    },
    member_role: {
        type: String,
        required: false
    },
    member_notes: {
        type: String,
        required: false
    },
    current_member: {
        type: Boolean,
        required: true
    },
    member_added_date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Members', membersSchema, 'members');