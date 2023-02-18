import axios from 'axios';
import Cookies from 'js-cookie';
import { PropsRequest } from '~/interfaces';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.interceptors.request.use(
    async (config) => {
        // const session = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};

        // if (session?.accessToken) {
        //     config.headers = {
        //         ...config.headers,
        //         authorization: `${session.accessToken_Type} ${session?.accessToken}`,
        //     };
        // }

        return config;
    },
    (error) => Promise.reject(error),
);
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true;
            // const session = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};
            // const result = await authService.refreshToken({
            //     accessToken: session?.accessToken,
            //     refreshToken: session?.refreshToken,
            // });
            // if (result.isSuccess) {
            //     Cookies.set(configStorage.login, JSON.stringify(result.data), { expires: result.data.expiredTime });
            //     config.headers = {
            //         ...config.headers,
            //         authorization: `${result.data.accessToken_Type} ${result.data.accessToken}`,
            //     };
            // } else if (result.statusCode === 404) Cookies.remove(configStorage.login);
            return axios(config);
        }
        return Promise.reject(error);
    },
);
export const get: PropsRequest.RequestType = async (path, data) => {
    const res = await axios.get(path, data);
    return res.data;
};
export const del: PropsRequest.RequestType = async (path, data) => {
    const res = await axios.delete(path, data);
    return res.data;
};

export const post: PropsRequest.RequestDataType = async (path, data, config = {}) => {
    const res = await axios.post(path, data, config);
    return res.data;
};
export const put: PropsRequest.RequestDataType = async (path, data, config = {}) => {
    const res = await axios.put(path, data, config);
    return res.data;
};
