var express = require('express');
var StageGuessController = require('../controllers/stageGuess');

var router = express.Router();
var stageGuessController = new StageGuessController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['StageGuessManagement']
		#swagger.description = '查詢比賽階段猜測資料'
	*/
	var filter = {};

	stageGuessController.get(filter, function(docs){
		res.json(docs);
	});
});


router.delete('/', (req, res) => {
	/* 
		#swagger.tags = ['StageGuessManagement']
		#swagger.description = '刪除比賽階段猜測資料'
	*/
	var filter = {};

	stageGuessController.delete(filter, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['StageGuessManagement']
		#swagger.description = '更新比賽階段猜測資料'
	*/
	var stageGuess = req.body;
	
	stageGuessController.save(stageGuess, function(docs){

		res.json(docs);
	});
});

router.post('/', (req, res) => {
	/* 
		#swagger.tags = ['StageGuessManagement']
		#swagger.description = '建立新比賽階段猜測資料'
	*/
	var stageGuess = req.body;
		
	stageGuessController.save(stageGuess, function(docs){
	
		res.json(docs);
	});
});

module.exports = router;