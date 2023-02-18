import axios from 'axios';
import { PropsRequest } from '~/interfaces';
const httpRequestPublic = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const get: PropsRequest.RequestType = async (path, data) => {
    const res = await httpRequestPublic.get(path, data);
    return res.data;
};
export const del: PropsRequest.RequestType = async (path, data) => {
    const res = await httpRequestPublic.delete(path, data);
    return res.data;
};

export const post: PropsRequest.RequestDataType = async (path, data, config = {}) => {
    const res = await httpRequestPublic.post(path, data, config);
    return res.data;
};
export const put: PropsRequest.RequestDataType = async (path, data, config = {}) => {
    const res = await httpRequestPublic.put(path, data, config);
    return res.data;
};
