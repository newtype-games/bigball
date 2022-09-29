var express = require('express');
var MatchGuessController = require('../controllers/matchGuess');
var MatchGuessV2Controller = require('../controllers/matchGuess.v2')
var router = express.Router();

var Code =  require('./responseCode');

function generateRouter(redisClient){
	var matchGuessControllerv2 = new MatchGuessV2Controller(redisClient);

	router.post('/betOnTeam', async (req, res) => {
		/* 
			#swagger.tags = ['MatchGuess']
			#swagger.description = '對隊伍下注'
		*/
		const param = req.body;
	
		try{
			if(!req.user.h365ID){
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
			
			const result = await matchGuessControllerv2.betOnTeam({
				h365ID: req.user.h365ID,
				...param,
			});
	
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

	return router;
}

module.exports = generateRouter;
