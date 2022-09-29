var express = require('express');
var TeamsController = require('../controllers/team');

var router = express.Router();
var teamsController = new TeamsController();


router.delete('/', (req, res) => {
	/* 
		#swagger.tags = ['TeamManagement']
		#swagger.description = '刪除隊伍資訊'
	*/
	var filter = {};

	teamsController.deleteAll(filter, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['TeamManagement']
        #swagger.description = '更新隊伍資訊'
	*/
	var teams = req.body;
		
	teamsController.update(teams, function(docs){
	
		res.json(docs);
	});
});

module.exports = router;
