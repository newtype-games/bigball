var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
var { Schema } = mongoose;
const Code = require('./errorCode');

var matchGuessSchema = new Schema({
	relatedMatch: {type: Number, ref: 'Match'},
	points: Number,
	stageGuess: {type: Schema.Types.ObjectId, ref: 'StageGuess'},
	guess: {
		homeScore: Number, 
		visitorScore: Number, 
		winner:{type: String, ref: 'Team'}
	},
	winnerGuess:{
		wagerOnHome: Number,
		wagerOnVisitor: Number
	},
}, {versionKey: false });

// TODO: verify the new match guess
// matchGuess: {
// 	count: number
// }

matchGuessSchema.static('betOnHome', async function(id, matchGuess, callback){
	var model = this;
	try {

	
		const updatedGeuss = await model.findByIdAndUpdate(
			id, 
			{
				$inc: {
					'winnerGuess.wagerOnHome': matchGuess.count,
				}
			},
			{ 
				new: true,
				upsert: true,
			}
		);
	
		return updatedGeuss;
	}catch(e){
		console.error(e);
		throw Code.FAILED_TO_SETTLT
	}
	
});

matchGuessSchema.static('betOnVisitor', async function(id, matchGuess, callback){
	var model = this;
	try{
		const updatedGeuss = await model.findByIdAndUpdate(
			id, 
			{
				$inc: {
					'winnerGuess.wagerOnVisitor': matchGuess.count,
				}
			},
			{ 
				new: true,
				upsert: true,
			}
		);
	
		return updatedGeuss;
	}catch(e){
		console.error(e);
		throw Code.FAILED_TO_SETTLT;
	}
	
});

matchGuessSchema.static('asyncUpsert', function (id, matchGuess, callback) {

	var model = this;
	return new Promise(function(resolve, reject){

		if(!id) {id = new ObjectId();}

		model.findByIdAndUpdate(id, matchGuess, {upsert: true, new: true}, function(err, doc){
			if(err) reject(err);

			resolve(doc);
		}).populate({path:'stageGuess', populate: { path: 'mainGuess' }}).populate('relatedMatch');
	});
});

if (!matchGuessSchema.options.toObject) matchGuessSchema.options.toObject = {};

matchGuessSchema.options.toObject.transform = function (doc, ret, options) {

	ret.result = {};
	if(!ret.guess) {
		ret.guess = {};
	}

	if(!ret.winnerGuess) {
		ret.winnerGuess = {};
	}

	if(ret.relatedMatch._id){
		ret.homeTeam = ret.relatedMatch.homeTeam;
		ret.visitorTeam = ret.relatedMatch.visitorTeam;
		ret.result.winner = ret.relatedMatch.winner;
		ret.result.homeScore = ret.relatedMatch.homeScore;
		ret.result.visitorScore = ret.relatedMatch.visitorScore;
		ret.date = ret.relatedMatch.date;
		ret.group = ret.relatedMatch.group;

		ret.relatedMatch = ret.relatedMatch._id;
	}

	delete	ret.stageGuess;
	return ret;
}

matchGuessSchema.static('calculate', function(match) {

	var model = this;
	
	model.find({relatedMatch: match._id}).populate({path: 'stageGuess', populate:{path: 'relatedStage'}}).then(function(matchGuesses){

		return matchGuesses.map(function(matchGuess){
		
			return new Promise(function(resolve, reject){

				if(matchGuess.guess && matchGuess.guess.homeScore != undefined){

					var points = 0;

					var guessDiff = matchGuess.guess.homeScore - matchGuess.guess.visitorScore;
					var resultDiff = match.homeScore - match.visitorScore;

					var result = 0;
					if (resultDiff > 0) result = 1
					else if (resultDiff < 0) result = -1;

					var guess = 0
					if (guessDiff > 0) guess = 1
					else if (guessDiff < 0) guess = -1;
					

					if (matchGuess.guess.homeScore == match.homeScore) points += 1;
					if (matchGuess.guess.visitorScore == match.visitorScore) points += 1;
					if (guessDiff == resultDiff) points += 2;

					if(matchGuess.stageGuess.relatedStage._id == 'groupStage'){
						if (result == guess) points += 2;
					} else {
						if (matchGuess.guess.winner == match.winner) {
							points += 2;
						}
					}					

					var multiplier = 1;

					if(typeof matchGuess.stageGuess.relatedStage.multiplier === "undefined") {
						multiplier = 1;
					} else {
						multiplier = matchGuess.stageGuess.relatedStage.multiplier;
					}

					matchGuess.points = points * multiplier;


					matchGuess.save().then(function(){
						// salva o double match se for o caso
						var stageGuess = matchGuess.stageGuess;
						if(stageGuess.doubleMatch == match._id){
							stageGuess.pointsDoubleMatch = matchGuess.points;
							stageGuess.save().then(resolve);

						}
					});
			
				}
	
			});
	
		});
	});
	
});

module.exports = mongoose.model('MatchGuess', matchGuessSchema);
