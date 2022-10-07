var MatchGuess = require('../models/MatchGuess');
var User = require('../models/User');

module.exports = function(redisClient, pubSubTopic){

	this.getById = function(id, callback){

		User.findById(id, function(err, accounts){

			if(err) console.log(err);

			callback(accounts);

		});
	};

	this.getAll = function(filter, callback){

		User.find(filter, function(err, accounts){

			if(err) console.log(err);

			callback(accounts);

		});
	};

	this.update = function(id, user, callback) {

		User.findByIdAndUpdate(id, user, {upsert: true}, function(err){
			if(err) callback(false);

			callback(true);
		});
	};

	this.onConsumedHCoins = function(h365ID, payload){
		console.log(h365ID, payload);
		pubSubTopic.publish(Buffer.from(
			JSON.stringify({
				event: 1,
				h365ID,
				consumedHCoin: payload.consumedHCoin,
			}),
		));
	}
};
