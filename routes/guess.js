var express = require('express');
var GuessController = require('../controllers/guess');

var router = express.Router();
var guessController = new GuessController();

// move get to management
router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Guess']
		#swagger.description = '取得使用者預測結果'
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
