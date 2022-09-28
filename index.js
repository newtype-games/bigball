const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const BodyParser = require("body-parser");
const { createClient } = require('redis');
const session = require("express-session");
const connectRedis = require("connect-redis");
const RedisStore = connectRedis(session);

require('dotenv').config()

const keys = require("./config/keys");


// init redis.
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_ADDRESS,
        port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
    legacyMode: true
});

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

redisClient.connect();

require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI,{useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

// check the reids content.

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


require('./routes/authRoutes')(app);
require('./routes/main')(app, redisClient);

if(process.env.NODE_ENV === 'production'){
    // Express will serve up production assets
    // like our main.js file or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// TODO: pubsub.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});