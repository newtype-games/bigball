var express = require('express');
var StageController = require('../controllers/stage');

var router = express.Router();
var stageController = new StageController();


router.delete('/:id', (req, res) => {
	/* 
		#swagger.tags = ['Stage']
        #swagger.description = '刪除階段'
	*/
	var id = req.params.id;

	stageController.delete(id, function(doc){

		res.json(doc);

	});

});

router.put('/', (req, res) => {
	/* 
		#swagger.tags = ['Stage']
        #swagger.description = '更新階段'
	*/

	var stage = req.body;
	
	stageController.save(stage, function(docs){

		res.json(docs);
	});

});


module.exports = router;
