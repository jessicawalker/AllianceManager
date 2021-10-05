const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
    criteria_name: {
        type: String,
        required: true
    },
    criteria_datatype: {
        type: String,
        required: true
    },
    activity_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('TrackingCriteria', criteriaSchema, 'trackingcriteria');