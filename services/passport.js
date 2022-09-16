const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require('../config/keys');
const User = mongoose.model('user');
var LocalStrategy = require('passport-local');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const existingUser = await User.findOne({name: username});
    if(!existingUser){
        return cb(null, false, { message: 'Incorrect username or password.' });
    }

    // TODO: password should be hashed
    if(existingUser.password != password){
        return cb(null, false, { message: 'Incorrect username or password.' });
    }

    return cb(null, existingUser);

    // crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    //     if (err) { return cb(err); }
    //     if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
    //       return cb(null, false, { message: 'Incorrect username or password.' });
    //     }
    //     return cb(null, user);
    //   });
}));

passport.use(
    new googleStrategy
    (
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        async (accessToken,refreshToken,profile,done) => {
            const existingUser = await User.findOne({googleID:profile.id});
            if(existingUser)
                return done(null, existingUser);
            const user = await new User({
                googleID:profile.id,
                name:profile.displayName,
                email:profile.emails[0].value,
                urlImg:profile.photos[0].value || ''
            }).save();
            done(null, user);
        }
    )
);