var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var userController = new UserController();

router.get('/', (req, res) => {

	var googleID = req.query.googleID;
	var name = req.query.name;
	var email = req.query.email;
	var id = req.query.id;
	var isPaid = req.query.isPaid;
	var filter = {};

	if(googleID) filter.googleID = googleID;
	if(name) filter.name = new RegExp(name, 'i');
	if(email) filter.email = new RegExp(email, 'i');
	if(id) filter._id = id;
	if(isPaid) filter.isPaid = isPaid;

	userController.getAll(filter, function(docs){
		
		res.json(docs);
	});
});

router.get(/([a-f0-9]{24})/, (req, res) => {

	userController.getById(req.params[0], function(docs){
		
		res.json(docs);
	});
});

router.put('/:id', (req, res) => {

	var id = req.params.id;
	var user = req.body;

	var updateObjects = {isAdmin: user.isAdmin, isPaid: user.isPaid};

	userController.update(id, updateObjects, function(doc){

		res.json(doc);

	});
});

router.post('/:h365ID/onComsumedHCoins', async (req, res)=> {
	const h365ID = req.params.h365ID;
	const payload = req.body;

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

	const result = await userController.onConsumedHCoins(h365ID, {
		consumedHCoins: payload.consumedHCoins,
	})
	
	res.json({
		code: 0,
		balance: result.balance,
		totalConsumedHCoin: result.totalConsumedHCoin,
		remainHCoin: result.remainHCoin,
	})
});

module.exports = router;
