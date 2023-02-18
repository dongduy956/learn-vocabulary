type typeLogin = {
    login: boolean;
};
type stateType = {
    auth: typeLogin;
};
export const loginSelector = (state: stateType) => state.auth.login;
