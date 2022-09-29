var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

function generateRouter(redisClient){
    var userController = new UserController(redisClient);
   
    router.get('/', (req, res) => {
		/* 
			#swagger.tags = ['Users']
			#swagger.description = '查詢使用者資訊'
		*/
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

    router.put('/:id', (req, res) => {
		/* 
			#swagger.tags = ['Users']
			#swagger.description = '更新使用者資訊'
		*/
		var id = req.params.id;
		var user = req.body;
	
		var updateObjects = {isAdmin: user.isAdmin, isPaid: user.isPaid};
	
		userController.update(id, updateObjects, function(doc){
	
			res.json(doc);
	
		});
	});

	return router;
}

module.exports = generateRouter;