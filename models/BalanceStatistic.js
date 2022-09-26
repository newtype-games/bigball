const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;

// TODO: consumed balance?
const BalanceStatisticSchema = new mongoose.Schema({
    _id: { type: String}, // stage.
    accumulateCoins: { type: Number }
}, { versionKey: false });

BalanceStatisticSchema.static("onUserBet", async function(id, payload){

    var model = this;
    const updateObj = {
        $inc: {
            accumulateCoins: payload.coinCount,
        },
    }

    const p = new Promise(function(resolve, reject){
        model.findOneAndUpdate(
            { _id: id},
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
