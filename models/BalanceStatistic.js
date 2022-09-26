const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;

const BalanceStatisticSchema = new mongoose.Schema({
    id: { type: String},
    relatedStage: {type: String, ref: 'Stage'},
    accumulateCoins: { type: Number }
}, { versionKey: false });


BalanceStatisticSchema.static("onUserBet", async function(id, payload){

    var model = this;
    const updateObj = {
        $inc: {
            accumulateCoins: payload.coinCount,
        }
    }

    const p = new Promise(function(resolve, reject){
        model.findOneAndUpdate(
            {id: id},
            updateObj,
            {
                new: true,
                upsert: true,
            },
            function(err, statistic){
                if(err) reject(err);
                resolve(statistic);
            }
        )
    });

    return p;
});

module.exports = mongoose.model('balance_statistic', BalanceStatisticSchema);
