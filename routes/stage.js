var express = require('express');
var StageController = require('../controllers/stage');

var router = express.Router();
var stageController = new StageController();

router.get('/', (req, res) => {
	/* 
		#swagger.tags = ['Stage']
		#swagger.description = '取得比賽階段資料'
	*/
	var filter = {};

	if(req.query.id) filter = {_id: req.query.id};

	stageController.get(filter, function(docs){
		const newDoc = docs.map(doc =>{
			return {
				...doc.toObject(),
				deadline: Date(doc.deadline),
			}
		});
		res.json(newDoc);
	});
});

router.get('/situation', (req, res) => {
	/* 
		#swagger.tags = ['Stage']
		#swagger.description = '取得下注狀態列舉'
	*/	
	stageController.getSituations(function(docs){
		
		res.json(docs);
	});
});

router.get('/status', (req, res) => {
	/* 
		#swagger.tags = ['Stage']
		#swagger.description = '取得階段狀態'
	*/	
	stageController.getStatus(function(docs){
		
		res.json(docs);
	});
});

module.exports = router;