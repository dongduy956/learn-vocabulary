interface AuthState {
    login: boolean;
}
interface TopicState {
    add: boolean;
}
export default interface StoreState {
    auth: AuthState;
    topic: TopicState;
}
