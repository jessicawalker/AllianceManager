const mongoose = require('mongoose');

const userdataSchema = new mongoose.Schema(/*
    {
        date: {
            type: Date,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        notes: {
            type: String,
            required: false
        }
    }*/
);

module.exports = mongoose.model('Userdata', userdataSchema, 'userdatatest');