const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
    criteria_name: {
        type: String
    },
    criteria_datatype: {
        type: String
    }
});

module.exports = mongoose.model('TrackingCriteria', criteriaSchema, 'trackingcriteria');