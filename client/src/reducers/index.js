import {combineReducers} from 'redux';
import authReducer from './authReducer';
import teamReducer from './teamReducer';
import playerReduce from './playerReducer';
import guessReducer from './guessReducer';
import userReducer from './userReducer';
import stageReducer from './stageReducer';
import statusReducer from './statusReducer';
import situationReducer from './situationReducer';
import accountReducer from './accountReducer';
import topscorerReducer from './topscorerReducer';
import rankingReducer from './rankingReducer';
import registerReducer from './registerReducer';

export default combineReducers(
    {
        auth: authReducer,
        teams: teamReducer,
        players: playerReduce,
        guess: guessReducer,
        users: userReducer,
        stages: stageReducer,
        status: statusReducer,
        situation: situationReducer,
        account: accountReducer,
        topscorer: topscorerReducer,
        ranking: rankingReducer,
        register: registerReducer,
    }
);