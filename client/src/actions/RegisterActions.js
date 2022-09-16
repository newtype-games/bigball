import axios from 'axios';
import {REGISTER_NEW_USER, OPEN_REGISTER_PAGE} from './types';

export const openRegisterPage = () => dispatch => {
    dispatch({ type: OPEN_REGISTER_PAGE, payload: {} });
}

export const registerNewUser = ({username, password}) => async dispatch => {
    const res = await axios.post('/register/password',{
        username,
        password,
    });
    dispatch({ type: REGISTER_NEW_USER, payload: res.data });
};