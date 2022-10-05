const Stage = require('./models/Stage');
const BalanceStatistic = require('./models/BalanceStatistic');
const User = require('./models/User');

function mountHandler(handler, redisClient){
      //mount pub sub handler:
      handler[0] = async function(data) {
        const { param, betResult } = data
        const stages = await Stage.find({
            matches: {
                $elemMatch: {
                    $eq: betResult.relatedMatch
                }
            }
        });

        const updatedBalanceStatistic = await BalanceStatistic.onUserBet(stages[0]._id, {
            // TODO: 競猜幣coin, 應該換算?
            coinCount: param.count,
        });

        redisClient.set(`balanceStatistic:${updatedBalanceStatistic.id}`, JSON.stringify(updatedBalanceStatistic));
    }

    handler[1] = async function(data) {
        const { h365ID, consumedHCoin } = data;
		let user = await User.findOne({
			h365ID: h365ID,
		});

		if(!user){
			user = await new User({
				googleID:"",
				h365ID: h365ID,
				name: h365ID,
				email: "",
				urlImg: '',
				password: '',
			}).save();
		}

		const result = await User.onConsumedHCoins(h365ID, { consumedHCoin });
    }
}

module.exports = mountHandler;