var express = require('express');
var TeamsController = require('../controllers/team');

var router = express.Router();
var teamsController = new TeamsController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Team']
		#swagger.description = '取得隊伍資訊'
		
	*/
	/*	
		#swagger.query['id'] = {
			in: 'query',
			description: '隊伍縮寫, e.g. jp, 為空則查詢所有隊伍'
			required: false,
		}
    */
	/*
		#swagger.responses[200] = { 
			schema: { "$ref": "#/definitions/Team" },
			description: "成功取得隊伍資訊" 
		} 
	*/
	var filter = {};

	if (req.query.id) filter = {_id: req.query.id};

	teamsController.get(filter, function(docs){
		
		res.json(docs);
	});
});


module.exports = router;
