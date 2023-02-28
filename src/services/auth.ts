import { httpRequestPublic, httpRequestPrivate } from '~/helpers';
import { configUrlApi } from '~/configs';
import { PropsLogin, PropsJwtRequest } from '~/interfaces';
export const login = async (params: PropsLogin): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.login, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const refreshToken = async (params: PropsJwtRequest): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.refreshToken, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const logout = async (params: PropsJwtRequest): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.post<Object>(configUrlApi.logout, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
