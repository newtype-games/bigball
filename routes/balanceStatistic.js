const express = require('express');
const router = express.Router();
const BalanceStatisticController = require('../controllers/balanceStatistic');
const Code =  require('./responseCode');



function generateRouter(redisClient){
	const balanceStatisticController = new BalanceStatisticController(redisClient);
	router.get('/', async (req, res) => {
		/* 
			#swagger.tags = ['BalanceStatistic']
			#swagger.description = '取得累積獎池資訊'
		*/
		try {
			const filter = {id: req.query.id};
			result = await balanceStatisticController.get(filter)
			
			res.json({
				code: 0,
				...result.toObject(),
			});
			return;
		}catch(e){
			if(typeof(e) == 'number'){
				res.json({
					code: e,
				});
				return;
			}
	
			console.error(e);
			res.json({
				code: Code.UNKNOWN_ERROR,
				message: e
			});
		}
	});

	return router;
}


module.exports = generateRouter;