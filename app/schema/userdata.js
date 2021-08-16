const mongoose = require('mongoose');

const userdataSchema = new mongoose.Schema();

module.exports = mongoose.model('Userdata', userdataSchema, 'userdatatest');