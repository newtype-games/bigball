var express = require('express');
var WorldCupController = require('../controllers/worldCup');

var router = express.Router();
var worldCupController = new WorldCupController();

router.post('/clear', (req, res) => {
	/* 
		#swagger.tags = ['WorldCup']
		#swagger.description = '清除所有賽事資料'
	*/
	worldCupController.clear(function(doc){
		res.json(doc);
	});

});

router.post('/seed', (req, res) => {
	/* 
		#swagger.tags = ['WorldCup']
		#swagger.description = '注入賽事資料'
	*/
	worldCupController.seed(function(docs){
		res.json(docs);
	});
});

module.exports = router;
