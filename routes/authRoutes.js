const mongoose = require("mongoose");
const User = mongoose.model('user');
const passport = require('passport');

module.exports = app => {
    app.post('/register/password', async (req, res) => {
        console.log(req.body.username);
        console.log(req.body.password);
        const { username, password } = req.body;
        const existingUser = await User.findOne({
            name: username
        });
        if(existingUser){
            return res.json({ message: 'Username has been occupied.'});
        }

        const user = await new User({
            googleID:"12345",
            name: username,
            email: "",
            urlImg: '',
            password: password ,
        }).save();

        return res.json(user);
    })

    app.post('/login/password', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile','email'],
        prompt: 'select_account'
    }));

    app.get('/auth/google/callback', 
        passport.authenticate('google'), 
    (req,res) => {
        res.redirect('/ranking');
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        req.session = null;
        res.redirect('/');
        //res.redirect('https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/');
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    })
}