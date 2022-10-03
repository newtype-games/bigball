var express = require('express');
var UserController = require('../controllers/user');
var Code = require('./responseCode');

var router = express.Router();

function generateRouter(redisClient, pubSubTopic){
	var userController = new UserController(redisClient, pubSubTopic);
	router.get('/self', (req, res) => {
		/* 
			#swagger.tags = ['Users']
			#swagger.description = '查詢使用者自身資訊'
		*/

		if(!req.user){ res.json({ code: Code.INVALID_H365ID })}

		userController.getById(req.user._id, function(docs){
			res.json(docs);
		});
	});

	router.post('/:h365ID/onComsumedHCoins', async (req, res)=> {
		const h365ID = req.params.h365ID;
		const payload = req.body;
		/* 
			#swagger.tags = ['Users']
			#swagger.description = 'HCoin消耗callback'
		*/
		if(req.headers['key'] != process.env.SECRET_KEY){
			res.json({
				code: SECRET_KEY_INVALID,
				reason: "",
			});	
			return;
		}
	
		if(!payload.consumedHCoins || payload.consumedHCoins < 0){
			res.json({
				code: CONSUMED_H_COINS_INVALID,
				reason: "consumedHCoins invalid",
			});
			return;
		}
	
		userController.onConsumedHCoins(h365ID, {
			consumedHCoins: payload.consumedHCoins,
		});
		
		res.json({
			code: 0,
		});
	});

	return router;
}


module.exports = generateRouter;
