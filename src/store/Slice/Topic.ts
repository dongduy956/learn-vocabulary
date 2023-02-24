import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
    name: 'Topic',
    initialState: {
        add: false,
    },
    reducers: {
        setAdd: (state) => {
            state.add = !state.add;
        },
    },
});
