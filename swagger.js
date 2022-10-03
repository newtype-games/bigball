require('dotenv').config()

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./index.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

const doc = {
    host: process.env.SWAGGER_TARGET_HOST || 'localhost:5000'
}

swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法