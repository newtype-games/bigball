var express = require('express');
var AccountController = require('../controllers/account');

var router = express.Router();
var accountController = new AccountController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Account']
	*/
	accountController.getAll(function(docs){
		
		res.json(docs);
	});
});

router.get('/:accId', (req, res) => {
	/* 
		#swagger.tags = ['Account']
	*/
	var accId = req.params.accId;

	accountController.getById(accId, function(docs){
		
		res.json(docs);
	});
});


router.delete('/:accId', (req, res) => {
	/* 
		#swagger.tags = ['Account']
	*/
	var accId = req.params.accId;

	accountController.delete(accId, function(doc){

		res.json(doc);

	});

});

router.put('/:accId', (req, res) => {
	/* 
		#swagger.tags = ['Account']
	*/
	var accId = req.params.accId;
	var account = req.body;

	accountController.update(accId, account, function(doc){

		res.json(doc);

	});
});

router.post('/', (req, res) => {
	/* 
		#swagger.tags = ['Account']
	*/
	var account = req.body;
	var accId = account._id;

	accountController.update(accId, account, function(doc){

		res.json(doc);

	});
});


module.exports = router;
