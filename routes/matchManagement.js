var express = require('express');
var MatchController = require('../controllers/match');

var router = express.Router();
var matchController = new MatchController();

router.delete('/', (req, res) => {
	/* 
		#swagger.tags = ['MatchManagement']
		#swagger.description = '刪除比賽資料'
	*/
	matchController.delete({}, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['MatchManagement']
        #swagger.description = '更新比賽資料'
    */
	var matches = req.body;
		
	matchController.update(matches, function(docs){

		res.json(docs);
	}, true);
	
});


module.exports = router;