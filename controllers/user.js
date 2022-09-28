var MatchGuess = require('../models/MatchGuess');
var User = require('../models/User');

module.exports = function(redisClient){

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

	this.onConsumedHCoins = async function(h365ID, payload){
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

		
		const result = await User.onConsumedHCoins(h365ID, payload);
		return result;
	}
};
