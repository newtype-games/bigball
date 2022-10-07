const mongoose = require("mongoose");
const User = mongoose.model('user');
const passport = require('passport');
const axios = require('axios').default;

module.exports = app => {
    app.get('/auth/h365', function(req, res){
        /* 
            #swagger.tags = ['Auth']
            #swagger.description = '第三方綁定跳轉專用API, 請不要直接呼叫, 將網址複製並用瀏覽器開啟'
        */        

        const { redirect_url } = req.query;
        console.log(`redirect_url: ${redirect_url}`);
        if(redirect_url){
            res.redirect((`${process.env.THIRD_PARTY_LOGIN_URL}?callback=${process.env.THIRD_PARTY_LOGIN_CALLBACK_URL}${encodeURIComponent(`?redirect_url=${redirect_url}`)}&merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICE_ID}`));
            return;
        }
        res.redirect((`${process.env.THIRD_PARTY_LOGIN_URL}?callback=${process.env.THIRD_PARTY_LOGIN_CALLBACK_URL}&merchantId=${process.env.MERCHANT_ID}&serviceId=${process.env.SERVICE_ID}`));
    });

    app.get('/auth/h365/callback', async function(req, res){
        /* 
            #swagger.tags = ['Auth']
            #swagger.description = '第三方綁定callback API, 請不要呼叫'
        */  
        const { token, redirect_url } = req.query;
        console.log(`token: ${token}, redirect_url: ${redirect_url}`);

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
                    token: token,
                }).save();
                console.log(user);
            }else{
                console.log(uuid);
                const user = await User.updateOne({h365ID: uuid},{ $set: { token: token }}, {new: true}).exec();
                console.log(user);
            }
            

            // https://big-ball-sandbox.h365.games/auth/h365?redirect=https://world-cup-f2e-sandbox.h365.games/123
            // http://localhost:5000/auth/h365?redirect_url=https://world-cup-f2e-sandbox.h365.games
            if(redirect_url){
                res.redirect(`${redirect_url}?token=${token}`);
                return;
            }
            res.redirect(process.env.THIRD_PARTY_LOGIN_REDIRECT_URL);
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
            #swagger.description = '登出帳號, 將抹除session'
        */     
        if(!req.user){
            res.status(401).json({});
            return;
        }   
        res.red
        req.logout();
        req.session = null;
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        /* 
            #swagger.tags = ['Auth']
            #swagger.description = '取得使用者授權資訊'
        */
        /* 
            #swagger.responses[200] = { 
                schema: { "$ref": "#/definitions/AuthInfo" },
                description: "成功取得使用者授權資訊" 
            } 
        */

        if(!req.user){
            res.status(401).json({});
            return;
        }
        res.red
        console.log(req.user)
        const user = req.user;
        res.json({
            _id: user.id,
            h365ID: user.h365ID,
            registerDate: user.registerDate,
        });
    })
}