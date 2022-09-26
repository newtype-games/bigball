var MatchGuess = require('../models/MatchGuess');
var User = require('../models/User');
var Code = require('./errorCode');


module.exports = function(){
    this.betOnTeam = async function(param){
        
		// TODO: deduct user balance.
		// find and update to make sure the result wont be negative.

		let user = await User.findOne({
			h365ID: param.h365ID,
		});

		if(user.balance < param.count){
			throw Code.BALANCE_NOT_ENOUGH;
		}

		if(!user){
			throw Code.USER_NOT_FOUND;
		}

		try{
			await User.deductBalance(param.h365ID,param);
		}catch(e){
			throw e;
		}
		
		try{
			if(param.team == 'home'){
				return MatchGuess.betOnHome(param.id, {
					count: param.count
				});
			}else if(param.team == 'visitor'){
				return MatchGuess.betOnVisitor(param.id, {
					count: param.count
				});
			}

		}catch(e){
			if(e == Code.BET_FAILED){
				const recoveredUser = await User.increaseBalance(param.h365ID,param);
				throw e;
			}
		}
		
    }
}