const express = require("express");
const mongoose = require("mongoose");

const passport = require("passport");
const BodyParser = require("body-parser");

const session = require("express-session");
const connectRedis = require("connect-redis");
const RedisStore = connectRedis(session);
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const initRedisClient = require('./services/redis');
const initPubsub = require('./services/pubSub');

const Stage = require('./models/Stage');
const BalanceStatistic = require('./models/BalanceStatistic');
const User = require('./models/User');

require('dotenv').config()


require('./models/User');
require('./services/passport');

console.log('pubsub ready');
(async () => {

    const keys = require("./config/keys");
    const redisClient = initRedisClient();
    console.log('redis initialized');

    mongoose.connect(keys.mongoURI,{useNewUrlParser: true, useUnifiedTopology: true});
    console.log('mongoose initialized');

    const {topic, subscription, handler } = await initPubsub();
    console.log('google pubsub initialized');

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
        const { h365ID, payload } = data;
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
    }

    const app = express();

    app.use(BodyParser.json());
    app.use(BodyParser.urlencoded({ extended: false }));

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: 'secret$%^134',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie 
            maxAge: 1000 * 60 * 60 * 8 // session max age in miliseconds
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

    require('./routes/authRoutes')(app);
    require('./routes/main')(app, redisClient, topic, subscription);

    if(process.env.NODE_ENV === 'production'){
        app.use(express.static('client/build'));
        const path = require('path');
        app.get('*', (req, res) => {
            res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        });
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
})();
