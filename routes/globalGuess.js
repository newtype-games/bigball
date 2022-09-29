var express = require('express');
var GlobalGuessController = require('../controllers/globalGuess');

var router = express.Router();
var globalGuessController = new GlobalGuessController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['GlobalGuess']
	*/
	var filter = {};

	globalGuessController.get(filter, function(docs){
		
		res.json(docs);
	});
});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['GlobalGuess']
	*/
	var globalGuess = req.body;
	
	globalGuessController.save(globalGuess, function(docs){

		res.json(docs);
	});
});

router.post('/', (req, res) => {
	/* 
		#swagger.tags = ['GlobalGuess']
	*/
	var globalGuess = req.body;
		
	globalGuessController.save(globalGuess, function(docs){
	
		res.json(docs);
	});
});

module.exports = router;
