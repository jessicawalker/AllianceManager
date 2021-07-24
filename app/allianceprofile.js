const mongoose = require('mongoose');

const allianceSchema = new mongoose.Schema({
    alliance_name: {
        type: String
    },
    game_name: {
        type: String
    }
});

module.exports = mongoose.model('AllianceProfile', allianceSchema, 'allianceprofile');