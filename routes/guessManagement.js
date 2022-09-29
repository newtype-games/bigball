var express = require('express');
var GuessController = require('../controllers/guess');

var router = express.Router();
var guessController = new GuessController();

router.delete('/', (req, res) => {
	/* 
		#swagger.tags = ['Guess']
        #swagger.description = '刪除預測'
	*/
	guessController.delete({}, function(message){

		res.json(message);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['Guess']
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
		#swagger.tags = ['Guess']
        #swagger.description = '建立預測'
	*/
	var guess = req.body;
		
	guessController.save(guess, function(docs){
	
		res.json(docs);
	});
});

module.exports = router;
