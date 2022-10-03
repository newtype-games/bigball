var express = require('express');
var GuessController = require('../controllers/guess');

var router = express.Router();
var guessController = new GuessController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['GuessManagement']
		#swagger.description = '取得使用者預測結果'
	*/
	var user = req.query.user;

	var filter = {};
	if(user) filter.user = user;

	//usuario logado
	//var loggedUser = '5b1c66a32c23491b874a6e73';
	var loggedUser = req.user._id;

	guessController.get(filter, loggedUser, function(docs){
		
		res.json(docs);
	});
});

router.delete('/', (req, res) => {
	/* 
		#swagger.tags = ['GuessManagement']
        #swagger.description = '刪除預測'
	*/
	guessController.delete({}, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['GuessManagement']
        #swagger.description = '更新預測'
	*/
	var guess = req.body;
	
	if (!guess._id) {res.json('Invalid ID');}
	else {
		
		guessController.save(guess, function(docs){
	
			res.json(docs);
		});
	}
});


router.post('/', (req, res) => {
	/* 
		#swagger.tags = ['GuessManagement']
        #swagger.description = '建立預測'
	*/
	var guess = req.body;
		
	guessController.save(guess, function(docs){
	
		res.json(docs);
	});
});

module.exports = router;
