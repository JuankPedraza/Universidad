'use strict'

var Sprint = require('../models/project');
var History = require('../models/history');
var Team = require('../models/team');
var Team = require('../models/team');
var fs = require('fs');
var path = require('path');

var controller = {

	createSprint: function (req, res) {
		var sprint = new Sprint();

		var params = req.body;
		sprint.name = params.name;
		sprint.description = params.description;
		sprint.duration = params.duration;
		sprint.team = params.team;
		sprint.image = null;

		sprint.save((err, sprintStored) => {
			if (err) return res.status(500).send({ message: 'Error al guardar el sprint.' });

			if (!sprintStored) return res.status(404).send({ message: 'No se ha podido guardar el sprint.' });

			return res.status(200).send({ sprint: sprintStored });
		});
	},

	createHistory: function (req, res) {
		var history = new History();
		var sprint = new Sprint();

		var params = req.body;
		var idSprint = params.sprintId;
		history.title = params.title;
		history.description = params.description;
		history.estimation = params.estimation;
		history.assigned = params.assigned;
		history.sprintId = params.sprintId;

		Sprint.findById({ _id: idSprint }, (err, sprint) => {

			if (err) return res.status(500).send(
				{ message: 'Error al devolver los datos.' }
			)
			if (!sprint) {
				return res.status(404).send({ message: 'El sprint no existe.' });
			}
			history.save((err, historyStored) => {
				if (err) return res.status(500).send({ message: 'Error al guardar la historia.' });

				if (!historyStored) return res.status(404).send({ message: 'No se ha podido guardar la historia.' });

				return res.status(200).send({ history: historyStored });
			});

		});
	},

	createTeam: function (req, res) {
		var team = new Team();

		var params = req.body;
		team.name = params.name;
		team.description = params.description;

		team.save((err, teamStored) => {
			if (err) return res.status(500).send({ message: 'Error al guardar el team.' });

			if (!teamStored) return res.status(404).send({ message: 'No se ha podido guardar el team.' });

			return res.status(200).send({ sprint: teamStored });
		});
	},

	getSprint: function (req, res) {
		var sprintId = req.params.id;

		if (sprintId == null) return res.status(404).send({ message: 'El sprint no existe.' });

		Sprint.findById(sprintId, (err, sprint) => {

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!sprint) return res.status(404).send({ message: 'El sprint no existe.' });

			return res.status(200).send({
				sprint
			});

		});
	},

	getHistory: function (req, res) {
		var historyId = req.params.id;

		if (historyId == null) return res.status(404).send({ message: 'La historia no existe.'});

		History.findById({ _id: historyId }, (err, history) => {

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!history) return res.status(404).send({ message: 'La historia no existe.'});

			return res.status(200).send({
				history
			});

		});
	},

	getSprints: function (req, res) {

		Sprint.find({}).exec((err, sprints) => {

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!sprints) return res.status(404).send({ message: 'No hay sprint que mostrar.' });

			return res.status(200).send({ sprints });
		});

	},

	getHistories: function (req, res) {
		var sprintId = req.params.id;

		History.find({ sprintId: sprintId }).exec((err, histories) => {

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!histories) return res.status(404).send({ message: 'No hay historias que mostrar.' });

			return res.status(200).send({ histories });
		});

	},

	getTeams: function (req, res) {
		var teamId = req.params.id;

		Team.find({}).exec((err, teams) => {

			if (err) return res.status(500).send({ message: 'Error al devolver los datos.' });

			if (!teams) return res.status(404).send({ message: 'No hay teams que mostrar.' });

			return res.status(200).send({ teams });
		});

	},

	updateSprint: function (req, res) {
		var sprintId = req.params.id;
		var update = req.body;

		Sprint.findByIdAndUpdate(sprintId, update, { new: true }, (err, sprintUpdated) => {
			if (err) return res.status(500).send({ message: 'Error al actualizar' });

			if (!sprintUpdated) return res.status(404).send({ message: 'No existe el sprint para actualizar' });

			return res.status(200).send({
				sprint: sprintUpdated
			});
		});
	},

	updateHistory: function (req, res) {
		var historyId = req.params.id;
		var update = req.body;

		History.findByIdAndUpdate(historyId, update, { new: true }, (err, historyUpdated) => {
			if (err) return res.status(500).send({ message: 'Error al actualizar' });

			if (!historyUpdated) return res.status(404).send({ message: 'No existe la historia para actualizar' });

			return res.status(200).send({
				history: historyUpdated
			});
		});
	},

	deleteSprint: function (req, res) {
		var sprintId = req.params.id;

		Sprint.findByIdAndRemove(sprintId, (err, sprintRemoved) => {
			if (err) return res.status(500).send({ message: 'No se ha podido borrar el sprint' });

			if (!sprintRemoved) return res.status(404).send({ message: "No se puede eliminar ese sprint." });

			return res.status(200).send({
				sprint: sprintRemoved
			});
		});
	},

	deleteHistory: function (req, res) {
		var historyId = req.params.id;

		History.findByIdAndRemove(historyId, (err, historyRemoved) => {
			if (err) return res.status(500).send({ message: 'No se ha podido borrar la historia' });

			if (!historyRemoved) return res.status(404).send({ message: "No se puede eliminar esa historia." });

			return res.status(200).send({
				history: historyRemoved
			});
		});
	},

	uploadImage: function (req, res) {
		var projectId = req.params.id;
		var fileName = 'Imagen no subida...';

		if (req.files) {
			var filePath = req.files.image.path;
			var fileSplit = filePath.split('\\');
			var fileName = fileSplit[1];
			var extSplit = fileName.split('\.');
			var fileExt = extSplit[1];

			if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {

				Project.useFindAndModify(projectId, { image: fileName }, { new: true }, (err, projectUpdated) => {
					if (err) return res.status(500).send({ message: 'La imagen no se ha subido' });

					if (!projectUpdated) return res.status(404).send({ message: 'El proyecto no existe y no se ha asignado la imagen' });

					return res.status(200).send({
						project: projectUpdated
					});
				});

			} else {
				fs.unlink(filePath, (err) => {
					return res.status(200).send({ message: 'La extensión no es válida' });
				});
			}

		} else {
			return res.status(200).send({
				message: fileName
			});
		}

	},

	getImageFile: function (req, res) {
		var file = req.params.image;
		var path_file = './uploads/' + file;

		fs.exists(path_file, (exists) => {
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(200).send({
					message: "No existe la imagen..."
				});
			}
		});
	}

};

module.exports = controller;