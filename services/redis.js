const { createClient } = require('redis');

function initRedisClient(){
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
    return redisClient;
}


module.exports = initRedisClient