var express = require('express');
var MatchController = require('../controllers/match');

var router = express.Router();
var matchController = new MatchController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Match']
		#swagger.description = '取得比賽資料'
	*/
	var filter = {};

	if (req.query.id) filter._id = req.query.id;
	if (req.query.homeTeam) filter.homeTeam = req.query.homeTeam;
	if (req.query.visitorTeam) filter.visitorTeam = req.query.visitorTeam;

	matchController.get(filter, function(docs){
		
		res.json(docs);
	});
});

module.exports = router;
