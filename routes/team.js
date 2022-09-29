var express = require('express');
var TeamsController = require('../controllers/team');

var router = express.Router();
var teamsController = new TeamsController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Team']
		#swagger.description = '取得隊伍資訊'
	*/
	var filter = {};

	if (req.query.id) filter = {_id: req.query.id};

	teamsController.get(filter, function(docs){
		
		res.json(docs);
	});
});


module.exports = router;
