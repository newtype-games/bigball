var express = require('express');
var StageGuessController = require('../controllers/stageGuess');

var router = express.Router();
var stageGuessController = new StageGuessController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['StageGuess']
		#swagger.description = '查詢比賽階段猜測資料'
	*/
	var filter = {};

	stageGuessController.get(filter, function(docs){
		
		res.json(docs);
	});
});

module.exports = router;
