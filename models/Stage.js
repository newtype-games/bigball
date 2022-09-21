var mongoose = require("mongoose");
var { Schema } = mongoose;

// the whole world cup stages.
// it contains multiple matches
var stageSchema = new Schema({
	_id: String,
	deadline:  Date,
	label: String,
	situation: {type: String, enum: [
		'Estamos aqui', // 正在舉行 
		'Fase finalizada',  // 結束
		'Fase não iniciada' // 尚未開始
	]},
	status :{type: String, enum: [
		'completed', 
		'opened', 
		'closed'
	]},
	order: Number,
	multiplier: Number,
	matches: [{type: Number, ref: 'Match'}]
}, { versionKey: false });

stageSchema.static('asyncUpsert', function (id, stage, callback) {

	var model = this;
	return new Promise(function(resolve, reject){

		model.findByIdAndUpdate(id, stage, {upsert: true, new: true}, function(err, doc){
			if(err) reject(err);

			resolve(doc);
		});
	});
});


if (!stageSchema.options.toObject) stageSchema.options.toObject = {};
stageSchema.options.toObject.transform = function (doc, ret, options) {

	ret.deadline = ret.deadline.toISOString().replace('T', ' ').substring(0, 19);

	return ret;
}

module.exports = mongoose.model('Stage', stageSchema);

