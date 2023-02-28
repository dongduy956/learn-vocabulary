import { createSlice } from '@reduxjs/toolkit';
import { isLogin } from '~/helpers';
export default createSlice({
    name: 'auth',
    initialState: {
        login: isLogin(),
    },
    reducers: {
        setLogin: (state, action) => {
            state.login = action.payload;
        },
    },
});
