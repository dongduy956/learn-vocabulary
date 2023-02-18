import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit';
import { SliceAuth } from './Slice';
import { StoreState } from '~/interfaces';

const storeConfig: ConfigureStoreOptions<StoreState> = {
    reducer: {
        auth: SliceAuth.reducer,
    },
};
export default configureStore(storeConfig);
