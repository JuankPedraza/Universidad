'use strict'

var express = require('express');
var ProjectController = require('../controllers/project');

var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

router.post('/create-sprint', ProjectController.createSprint);
router.post('/create-team', ProjectController.createTeam);
router.post('/create-history', ProjectController.createHistory);
router.get('/sprint/:id?', ProjectController.getSprint);
router.get('/history/:id?', ProjectController.getHistory);
router.get('/sprints', ProjectController.getSprints);
router.get('/histories/:id', ProjectController.getHistories);
router.get('/teams', ProjectController.getTeams);
router.put('/sprint/:id', ProjectController.updateSprint);
router.put('/history/:id', ProjectController.updateHistory);
router.delete('/sprint/:id', ProjectController.deleteSprint);
router.delete('/history/:id', ProjectController.deleteHistory);
router.post('/upload-image/:id', multipartMiddleware, ProjectController.uploadImage);
router.get('/get-image/:image', ProjectController.getImageFile);

module.exports = router;