require('dotenv').config()

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./index.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

const doc = {
    host: process.env.SWAGGER_TARGET_HOST || 'localhost:5000',
    definitions: {
        User: {
            "_id": "6333b0cd0319f75d3c170282",
            "h365ID": "06f3ca92-19a6-4ecf-a518-6e94f9e9e711",
            "registerDate": "2022-09-28T02:26:21.301Z"
        },
        Team:[
            {
              "_id": "ir",
              "name": "Irã",
              "gc": -7,
              "gp": 3
            },
            {
              "_id": "ru",
              "name": "Rússia",
              "gc": -6,
              "gp": 4
            },
            {
              "_id": "br",
              "name": "Brasil",
              "gc": -6,
              "gp": 7
            },
        ],
        Guess:[
            {
              "_id": "6333b0cd0319f75d3c170285",
              "globalGuess": {
                "_id": "6333b0cd0319f75d3c170286",
                "firstPlace": null,
                "pointsChampions": 0,
                "pointsTeamGC": 0,
                "pointsTeamGP": 0,
                "pointsTopScorer": 0,
                "relatedStage": "groupStage",
                "secondPlace": null,
                "teamGC": null,
                "teamGP": null,
                "thirdPlace": null,
                "topScorer": null,
                "status": "completed",
                "deadline": "2022-09-17 00:00:00",
                "situation": "Fase finalizada"
              },
              "position": 1,
              "stageGuesses": [
                {
                  "_id": "6333b0cd0319f75d3c170287",
                  "doubleMatch": null,
                  "matchGuesses": [
                    {
                        "winnerGuess": {
                            "wagerOnHome": 1,
                            "wagerOnVisitor": 1
                        },
                        "_id": "6333b0cd0319f75d3c17028d",
                        "points": 0,
                        "relatedMatch": 1,
                        "result": {
                            "winner": "ru",
                            "homeScore": 2,
                            "visitorScore": 1
                        },
                        "guess": {},
                        "homeTeam": "ru",
                        "visitorTeam": "sa",
                        "date": "2022-09-17",
                        "group": "A"
                    },
                    {
                        "_id": "6333b0cd0319f75d3c17028d",
                        "points": 0,
                        "relatedMatch": 1,
                        "result": {
                            "winner": "ru",
                            "homeScore": 2,
                            "visitorScore": 1
                        },
                        "guess": {},
                        "winnerGuess": {},
                        "homeTeam": "ru",
                        "visitorTeam": "sa",
                        "date": "2022-09-17",
                        "group": "A"
                    },
                  ],
                  "pointsDoubleMatch": 0,
                  "relatedStage": "groupStage",
                  "label": "Fase de Grupos",
                  "situation": "Fase finalizada",
                  "order": 1,
                  "status": "completed",
                  "deadline": "2022-09-17 00:00:00"
                },
                {
                  "_id": "6333b0cd0319f75d3c170288",
                  "doubleMatch": null,
                  "matchGuesses": [
                    {
                      "_id": "6333b0cd0319f75d3c1702bd",
                      "points": 0,
                      "relatedMatch": 49,
                      "result": {
                        "winner": {},
                        "homeScore": null,
                        "visitorScore": null
                      },
                      "guess": {},
                      "winnerGuess": {},
                      "homeTeam": "ar",
                      "visitorTeam": "de",
                      "date": "2022-09-17",
                      "group": "8THF"
                    },
                  ],
                  "pointsDoubleMatch": 0,
                  "relatedStage": "eighthFinals",
                  "label": "Oitavas de Final",
                  "situation": "Estamos aqui",
                  "order": 2,
                  "status": "opened",
                  "deadline": "2022-09-17 00:00:00"
                },
                {
                  "_id": "6333b0cd0319f75d3c170289",
                  "relatedStage": "quarterFinals",
                  "label": "Quartas de Final",
                  "situation": "Fase não iniciada",
                  "order": 3,
                  "status": "closed",
                  "deadline": "2022-09-17 00:00:00"
                },
                {
                  "_id": "6333b0cd0319f75d3c17028a",
                  "relatedStage": "semiFinals",
                  "label": "Semi-Finais",
                  "situation": "Fase não iniciada",
                  "order": 4,
                  "status": "closed",
                  "deadline": "2022-09-17 00:00:00"
                },
                {
                  "_id": "6333b0cd0319f75d3c17028b",
                  "relatedStage": "finals",
                  "label": "Finais",
                  "situation": "Fase não iniciada",
                  "order": 5,
                  "status": "closed",
                  "deadline": "2022-09-17 00:00:00"
                }
              ],
              "user": {
                "_id": "6333b0cd0319f75d3c170282",
                "h365ID": "06f3ca92-19a6-4ecf-a518-6e94f9e9e711",
                "registerDate": "2022-09-28T02:26:21.301Z"
              }
            }
        ],
        Match: [
            {
              "_id": 1,
              "date": "2022-09-17T00:00:00.000Z",
              "group": "A",
              "homeTeam": "ru",
              "visitorTeam": "sa",
              "homeScore": 2,
              "visitorScore": 1,
              "winner": "ru"
            },
            {
              "_id": 5,
              "date": "2022-09-25T00:00:00.000Z",
              "group": "A",
              "homeTeam": "uy",
              "visitorTeam": "ru",
              "homeScore": 3,
              "visitorScore": 1,
              "winner": "uy"
            },
            {
              "_id": 2,
              "date": "2022-09-20T00:00:00.000Z",
              "group": "A",
              "homeTeam": "eg",
              "visitorTeam": "uy",
              "homeScore": 1,
              "visitorScore": 2,
              "winner": "uy"
            },
        ]
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法