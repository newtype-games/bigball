var MatchGuess = require('../models/MatchGuess');
var User = require('../models/User');
var Code = require('./errorCode');
var ModelCode = require('../models/errorCode');
var BalanceStatistic = require('../models/balanceStatistic');
var Stage = require('../models/Stage');

module.exports = function(){
    this.betOnTeam = async function(param){

		let user = await User.findOne({
			h365ID: param.h365ID,
		});

		if(user.balance < param.count){
			throw Code.BALANCE_NOT_ENOUGH;
		}

		if(!user){
			throw Code.USER_NOT_FOUND;
		}

		if(!param.id){
			throw Code.MATCH_ID_INVALID;
		}

		try{
			await User.deductBalance(param.h365ID,param);

			let betResult;

			if(param.team == 'home'){
				betResult = await MatchGuess.betOnHome(param.id, {
					count: param.count
				});
			}else if(param.team == 'visitor'){
				betResult = await MatchGuess.betOnVisitor(param.id, {
					count: param.count
				});
			}

			const stages = await Stage.find({
				matches: {
					$elemMatch: {
						$eq: betResult.toObject().relatedMatch
					}
				}
			});

			await BalanceStatistic.onUserBet(stages[0]._id, {
				coinCount: param.count,
			});

			return betResult;
		}catch(e){
			if(e == ModelCode.FAILED_TO_SETTLT){
				await User.increaseBalance(param.h365ID,param);
			}
			
			throw e;
		}
		
    }
}