const Stage = require('../models/Stage');
const Code = require('./errorCode');
const BalanceStatistic = require('../models/BalanceStatistic');

module.exports = function(redisClient){
    this.get = async function(param){
        if(!param.id){
            throw Code.STAGE_ID_INVALID;
        }

        try {
            let result = redisClient.get(`balanceStatistic:${param.id}`);

			if(result){
				return result;
			}

            result = await BalanceStatistic.find({
                _id: param.id
            });
            redisClient.set(`balanceStatistic:${param.id}`, JSON.stringify(result[0]));
            return result[0];
        }catch(e){
            console.error(e);
            throw e;
        }
    }
}