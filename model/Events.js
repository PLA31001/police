const mongoose = require('mongoose');
const eventSchema = require('../schemas/event');

const EventsModel = mongoose.model('event', eventSchema);

module.exports = EventsModel;