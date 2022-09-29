var express = require('express');
var MatchGuessController = require('../controllers/matchGuess');
var router = express.Router();

var Code =  require('./responseCode');

function generateRouter(redisClient){
	var matchGuessController = new MatchGuessController();

    router.get(/([a-f0-9]{24})/, (req, res) => {
		/* 
			#swagger.tags = ['MatchGuess']
            #swagger.description = '查詢比賽猜測資料'
		*/
		var filter = {_id: req.params[0]};
	
		matchGuessController.get(filter, function(docs){
			
			res.json(docs[0]);
		});
	});

    router.delete('/', (req, res) => {
		/* 
			#swagger.tags = ['MatchGuess']
            #swagger.description = '刪除比賽猜測資料'
		*/
		var filter = {};
	
		matchGuessController.delete(filter, function(message){
	
			res.json(message);
	
		});
	});

    router.put('/', (req, res) => {
		/* 
			#swagger.tags = ['MatchGuess']
            #swagger.description = '更新比賽猜測資料'
		*/
		var matchGuess = req.body;
	
		if(!matchGuess._id) {res.json('ID nao encontrado');}
		else {
			
			matchGuessController.save(matchGuess, function(docs){
		
				res.json(docs);
			});
		}
	});

    router.post('/', (req, res) => {
		/* 
			#swagger.tags = ['MatchGuess']
            #swagger.description = '建立比賽猜測資料'
		*/
		var matchGuess = req.body;
			
		matchGuessController.save(matchGuess, function(docs){
			res.json(docs);
		});
	});

	return router;
}

module.exports = generateRouter;