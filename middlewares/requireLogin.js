var User = require('../models/User');

module.exports = async (req, res, next) => {
    
    if(!req.headers.token){
        return res.status(401).send({error: 'You must log in!'});
    }
    
    console.log(req.headers.token);
        
    const user = await User.findOne({ token: req.headers.token });
    
    req.user = user;

    next();
};