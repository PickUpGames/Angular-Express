var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
	hostName: String,
	location: String,
	eventType: String,
	eventDescription: String,
	guests: Number,
	maxGuests: Number,
});

var Event = mongoose.model('Event',eventSchema);

module.exports = Event;