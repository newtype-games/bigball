const Stage = require('../models/Stage');
const Code = require('./errorCode');
const BalanceStatistic = require('../models/balanceStatistic');

module.exports = function(){
    this.get = async function(param){
        if(!param.id){
            throw Code.STAGE_ID_INVALID;
        }

        try {
            const result = await BalanceStatistic.find({
                _id: param.id
            });

            return result[0];
        }catch(e){
            console.error(e);
            throw e;
        }
    }
}