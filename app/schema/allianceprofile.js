const mongoose = require('mongoose');

const allianceSchema = new mongoose.Schema({
    alliance_name: {
        type: String,
        required: true
    },
    game_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AllianceProfile', allianceSchema, 'allianceprofile');