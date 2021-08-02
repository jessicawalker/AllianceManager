const mongoose = require('mongoose');

const userdataSchema = new mongoose.Schema(
    /*{
        date: {
            type: Date,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        claimedSSWar: {
            type: Boolean,
            required: true
        },
        activeDeclare: {
            type: Boolean,
            required: true
        },
        defenseEarly: {
            type: Boolean,
            required: true
        },
        defenseLive: {
            type: Boolean,
            required: true
        },
        offense: {
            type: Boolean,
            required: true
        },
        notes: {
            type: String,
            required: false
        }
    }*/
);

module.exports = mongoose.model('Userdata', userdataSchema, 'userdata');