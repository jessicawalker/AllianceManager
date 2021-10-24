const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activity_name: {
        type: String,
        required: true
    },
    log_type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Activity', activitySchema, 'activities');