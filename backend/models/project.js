'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SprintSchema = Schema({
	name: String,
	description: String,
	duration: Number,
	team: String
});

module.exports = mongoose.model('Sprint', SprintSchema);
// projects  --> guarda los documents en la coleccion