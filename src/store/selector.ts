import StoreState from '~/interfaces';

export const loginSelector = (state: StoreState) => state.auth.login;
export const addTopicSelector = (state: StoreState) => state.topic.add;
