var express = require('express');
var teamRoutes = require('./team');
var teamManagementRoutes = require('./teamManagement')
var worldCupRoutes = require('./worldCup');
var matchRoutes = require('./match');
var guessRoutes = require('./guess');
var guessManagementRoutes = require('./guessManagement');
var stageRoutes = require('./stage');
var stageManagement = require('./stageManagement');
var userRoutes = require('./user');
var userManagementRoutes = require('./userManagement');
var matchGuessRoutes = require('./matchGuess');
var matchGuessManagementRoutes = require('./matchGuessManagement');
var stageGuessRoutes = require('./stageGuess');
var stageGuessManagementRoutes = require('./stageGuessManagement');
var requireLogin = require('../middlewares/requireLogin');
var requireAdminRole = require('../middlewares/requireAdminRole');
var balanceStatistic = require('./balanceStatistic');

module.exports = function(app, redisClient) {

	// should require login?
	app.use('/api/team', teamRoutes);
	app.use('/api/teamManagement', requireAdminRole, teamManagementRoutes);

	app.use('/api/worldCup', requireAdminRole, worldCupRoutes);

	// app.use('/api/player', playerRoutes);

	app.use('/api/guess', requireLogin, guessRoutes);
	app.use('/api/guessManagement', requireAdminRole, guessManagementRoutes);

	app.use('/api/match', matchRoutes);
	app.use('/api/matchManagement', requireAdminRole,matchRoutes);
	// app.use('/api/account', accountRoutes);

	app.use('/api/stage', stageRoutes);
	app.use('/api/stageManagement', requireAdminRole, stageManagement);

	app.use('/api/user', userRoutes(redisClient));
	app.use('/api/userManagement', requireAdminRole, userManagementRoutes(redisClient));

	app.use('/api/matchGuess', matchGuessRoutes(redisClient));
	app.use('/api/matchGuessManagement', requireAdminRole, matchGuessManagementRoutes(redisClient));

	app.use('/api/stageGuess', stageGuessRoutes);
	app.use('/api/stageGuessManagement', requireAdminRole, stageGuessManagementRoutes);

	// app.use('/api/globalGuess', globalGuessRoutes);

	// app.use('/api/ranking', rankingRoutes);

	app.use('/api/balanceStatistic', balanceStatistic(redisClient));
}



