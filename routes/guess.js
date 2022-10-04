var express = require('express');
var GuessController = require('../controllers/guess');

var router = express.Router();
var guessController = new GuessController();

// move get to management
router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Guess']
		#swagger.description = '取得使用者預測資訊'

	*/
	/*
		#swagger.responses[200] = { 
			schema: { "$ref": "#/definitions/Guess" },
			description: "取得預測資訊" 
		} 
	*/
	var user = req.user
	if(!user){
		res.json({});
	}

	var filter = { user };
	//usuario logado
	//var loggedUser = '5b1c66a32c23491b874a6e73';
	var loggedUser = req.user._id;

	guessController.get(filter, loggedUser, function(docs){
		res.json(docs);
	});
});

module.exports = router;
