const express = require('express');
const router = express.Router();
const BalanceStatisticController = require('../controllers/balanceStatistic');
const Code =  require('./responseCode');

const balanceStatisticController = new BalanceStatisticController();

router.get('/', async (req, res) => {
	var filter = {id: req.query.id};
    try {
        const result = await balanceStatisticController.get(filter)

        console.log(result);

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

module.exports = router;