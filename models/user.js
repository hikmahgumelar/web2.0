
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	path: String,
	email: String,
	firstName: String,
	lastName: String
});