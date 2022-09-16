import {REGISTER_NEW_USER, OPEN_REGISTER_PAGE} from '../actions/types';
import _ from 'lodash';

export default function(state = null, action){
    switch(action.type){
        case REGISTER_NEW_USER:
            if(action.payload.message){
                return  { 
                    ...action.payload,
                 };
            }
            return  { 
                ...action.payload,
                redirectUrl: '/login',
             };
        case OPEN_REGISTER_PAGE:
            return action.payload;
        default:
            return state;
    }
}