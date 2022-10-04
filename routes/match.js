var express = require('express');
var MatchController = require('../controllers/match');

var router = express.Router();
var matchController = new MatchController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Match']
		#swagger.description = '取得賽事資訊'
	*/
	/*	
		#swagger.query['id'] = {
			in: 'query',
			description: '賽事ID'
			required: false,
		}
		#swagger.query['homeTeam'] = {
			in: 'query',
			description: '地主隊伍縮寫, e.g. jp, 為空則查詢所有隊伍'
			required: false,
		}
		#swagger.query['visitorTeam'] = {
			in: 'query',
			description: '客場隊伍縮寫, e.g. jp, 為空則查詢所有隊伍'
			required: false,
		}
	*/
	/*
		#swagger.responses[200] = { 
			schema: { "$ref": "#/definitions/Match" },
			description: "成功取得賽事資訊" 
		} 
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
