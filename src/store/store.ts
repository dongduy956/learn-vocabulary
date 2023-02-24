import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit';
import { SliceAuth, SliceTopic } from './Slice';
import StoreState from '~/interfaces';

const storeConfig: ConfigureStoreOptions<StoreState> = {
    reducer: {
        auth: SliceAuth.reducer,
        topic: SliceTopic.reducer,
    },
};
export default configureStore(storeConfig);
