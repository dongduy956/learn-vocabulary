import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
    name: 'Auth',
    initialState: {
        login: false,
    },
    reducers: {
        setLogin: (state, action) => {
            state.login = action.payload;
        },
    },
});
