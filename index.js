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

const mountHandler = require('./pubSubHandler');

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
  
    if(process.env.PUB_SUB_HANDLE_ENABLED == 'true'){
        mountHandler(handler, redisClient);
        console.log('mount pub sub message handler');
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
    if(process.env.SWAGGER_ENABLED == 'true'){
        app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }


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
