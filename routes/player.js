var express = require('express');
var PlayersController = require('../controllers/player');

var router = express.Router();
var playersController = new PlayersController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Player']
	*/
	playersController.get(function(docs){
		
		res.json(docs);
	});
});

router.get('/topScorer', (req, res) => {
	/* 
		#swagger.tags = ['Player']
	*/
	playersController.getTopScorer(function(docs){
		
		res.json(docs);
	});
});

router.delete('/', (req, res) => {
	/* 
		#swagger.tags = ['Player']
	*/
	playersController.delete({}, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['Player']
	*/
	var players = req.body;
		
	playersController.update(players, function(docs){
	
		res.json(docs);
	});
});

module.exports = router;
