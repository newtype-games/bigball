var express = require('express');
var UserController = require('../controllers/user');
var Code = require('./responseCode');

var router = express.Router();

function generateRouter(redisClient, pubSubTopic){
	var userController = new UserController(redisClient, pubSubTopic);
	router.get('/self', (req, res) => {
		/* 
			#swagger.tags = ['Users']
			#swagger.description = '查詢使用者帳號資訊'
		*/
		/*
		#swagger.responses[200] = { 
			schema: { "$ref": "#/definitions/User" },
			description: "成功查詢使用者帳號資訊" 
		} 
		*/		
		if(!req.user){ res.json({ code: Code.INVALID_H365ID })}

		userController.getById(req.user._id, function(doc){
			res.json({
				_id: doc._id,
				balance: doc.balance,
				remainHCoin: doc.remainHCoin,
				totalConsumedHCoin: doc.totalConsumedHCoin,
				h365ID: doc.h365ID,
				name: doc.name,
				registerDate: doc.registerDate,
			});
		});
	});

	router.post('/:h365ID/onComsumedHCoin', async (req, res)=> {
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
	
		if(!payload.consumedHCoin || payload.consumedHCoin < 0){
			res.json({
				code: CONSUMED_H_COINS_INVALID,
				reason: "consumedHCoin invalid",
			});
			return;
		}
	
		userController.onConsumedHCoins(h365ID, {
			consumedHCoin: payload.consumedHCoin,
		});
		
		res.json({
			code: 0,
		});
	});

	return router;
}


module.exports = generateRouter;
