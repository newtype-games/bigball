var express = require('express');
var MatchGuessController = require('../controllers/matchGuess');
var MatchGuessV2Controller = require('../controllers/matchGuess.v2')
var router = express.Router();
var matchGuessController = new MatchGuessController();
var matchGuessControllerv2 = new MatchGuessV2Controller();

var Code =  require('./responseCode');

router.get('/', (req, res) => {

	var filter = {};

	if (req.query.id) filter = {_id: req.query.id};

	matchGuessController.get(filter, function(docs){
		
		res.json(docs);
	});
});

router.get(/([a-f0-9]{24})/, (req, res) => {

	var filter = {_id: req.params[0]};

	matchGuessController.get(filter, function(docs){
		
		res.json(docs[0]);
	});
});


router.delete('/', (req, res) => {
	
	var filter = {};

	matchGuessController.delete(filter, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {

	var matchGuess = req.body;

	if(!matchGuess._id) {res.json('ID nao encontrado');}
	else {
		
		matchGuessController.save(matchGuess, function(docs){
	
			res.json(docs);
		});
	}
});

router.put(/([a-f0-9]{24})/, (req, res) => {

	var matchGuess = req.body;

	if (!matchGuess._id) {res.json('ID nao encontrado.');}

	else if (matchGuess._id != req.params[0]) {res.json('ID do form diferente do ID da URL.');}

	else {
		
		matchGuessController.save(matchGuess, function(docs){
	
			res.json(docs[0]);
		});
	}
});

router.post('/', (req, res) => {

	var matchGuess = req.body;
		
	matchGuessController.save(matchGuess, function(docs){
		res.json(docs);
	});
});

router.post('/betOnTeam', async (req, res) => {

	const param = req.body;

	try{
		if(!param.h365ID){
			res.json({
				code: Code.INVALID_H365ID
			});	
			return;
		}

		if(param.id == ''){
			res.json({
				code: Code.INVALID_MATCH_GUESS_ID
			});	
			return;
		}

		if(param.team == '' || 
			param.team != 'home' && 
			param.team  != 'visitor'){
			res.json({
				code: Code.TEAM_INVALID
			});
			return;
		}

		if(!param.count || param.count < 0){
			res.json({
				code: Code.INVALID_BET_COUNT,
			});
			return;
		}
		
		const result = await matchGuessControllerv2.betOnTeam(param);

		res.json({
			code: 0,
			...result.winnerGuess,
		});
		return;
	}catch(e){
		if(typeof(e) == 'number'){
			res.json({
				code: e,
			});
			return;
		}

		console.error(e);
		res.json({
			code: Code.UNKNOWN_ERROR,
			message: e
		});
	}
});

module.exports = router;
