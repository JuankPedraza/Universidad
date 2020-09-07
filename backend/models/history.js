'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = Schema({
	title: String,
	description: String,
	estimation: Number,
    assigned: String,
    sprintId: String
});

module.exports = mongoose.model('History', HistorySchema);
// projects  --> guarda los documents en la coleccion