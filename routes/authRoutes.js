const mongoose = require("mongoose");
const User = mongoose.model('user');
const passport = require('passport');
const axios = require('axios').default;

module.exports = app => {
    app.get('/auth/h365', function(req, res){
        /* 
            #swagger.tags = ['Auth']
            #swagger.description = '第三方綁定跳轉專用API'
        */        
        res.redirect((`${process.env.THIRD_PARTY_LOGIN_URL}?callback=${process.env.THIRD_PARTY_LOGIN_CALLBACK_URL}&merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICE_ID}`));
    });

    app.get('/auth/h365/callback', async function(req, res){
        /* 
            #swagger.tags = ['Auth']
            #swagger.description = '第三方綁定callback API'
        */  
        const { token } = req.query;
        console.log(`token: ${token}`);

        try{
            const response = await axios.get(`${process.env.H365_API_URL}/user/get-user-info?merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICE_ID}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }); 

            if(response.status != 200 ){
                throw result.status + "";
            }

            if(response.data.code < 0){
                throw result.data.message;
            }

            const { userSn, uuid } = response.data.data;


            let user = await User.findOne({
                h365ID: uuid,
            });
    
            if(!user){
                console.info(`user[${uuid}] not found, create new one`);
                user = await new User({
                    googleID:"",
                    h365ID: uuid,
                    name: uuid,
                    email: "",
                    urlImg: '',
                    password: '',
                }).save();
            }
            
            const p = new Promise((resolve, reject)=> {
                req.logIn(user, (err)=> {
                    if (err) { 
                        console.error(err) 
                        reject(err);
                    }
                    resolve();
                });
            });
            await p;
            if(process.env.THIRD_PARTY_LOGIN_REDIRECT_URL){
                res.redirect(process.env.THIRD_PARTY_LOGIN_REDIRECT_URL);
                return;
            }
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

    app.get('/api/logout', (req, res) => {
        /* 
            #swagger.tags = ['Auth']
        */        
        res.red
        req.logout();
        req.session = null;
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        /* 
            #swagger.tags = ['Auth']
        */        
        res.red
        res.send(req.user);
    })
}