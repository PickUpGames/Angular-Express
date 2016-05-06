var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String, 
	username: String,
	password: String,
	birthday: String,
	rating: {type: Number, default: 5.0},
	location: Number,
	tag: [String],
	regEvents: [String]
});

var User = mongoose.model('User', userSchema);

module.exports = User;

// initializes the User Object for our database