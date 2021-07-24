const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema({
    member_username: {
        type: String
    },
    member_role: {
        type: String
    },
    member_notes: {
        type: String
    },
    current_member: {
        type: Boolean
    }
});

module.exports = mongoose.model('Members', membersSchema, 'members');