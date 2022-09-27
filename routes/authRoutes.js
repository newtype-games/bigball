const mongoose = require("mongoose");
const User = mongoose.model('user');
const passport = require('passport');
const axios = require('axios').default;

module.exports = app => {
    app.get('/auth/h365', function(req, res){
        // const queryString = encodeURIComponent(`?redirect_path=/&merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICEID}`);
        res.redirect((`${process.env.THIRD_PARTY_LOGIN_URL}?callback=${process.env.THIRD_PARTY_LOGIN_CALLBACK_URL}&merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICE_ID}`));
    });

    app.get('/auth/h365/callback', async function(req, res){
        const { token } = req.query;
        try{
            const result = await axios.get(`${process.env.H365_API_URL}/user/get-user-info?merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICE_ID}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }); 
            console.log(result.data);
            if(result.status != 200 ){
                throw result.status + "";
            }

            if(result.data.code < 0){
                throw result.data.message;
            }

            // TODO: using following information to register a new user if not found;
            // TODO: setting req.user
            const { userSn, uuid, userEmail } = result;

            res.json({ message: "ok"});
        }catch(e){
            if(typeof(e) == 'string'){
                res.json({message: e});
                return; 
            }
            console.error(e);
            res.json({message: e.message});
        }
       
    });

    // app.post('/register/password', async (req, res) => {
    //     console.log(req.body.username);
    //     console.log(req.body.password);
    //     const { username, password } = req.body;
    //     const existingUser = await User.findOne({
    //         name: username
    //     });
    //     if(existingUser){
    //         return res.json({ message: 'Username has been occupied.'});
    //     }

    //     const user = await new User({
    //         googleID:"12345",
    //         name: username,
    //         email: "",
    //         urlImg: '',
    //         password: password ,
    //     }).save();

    //     return res.json(user);
    // })

    // app.post('/login/password', passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // }));

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