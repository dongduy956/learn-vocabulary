import { httpRequestPublic, httpRequestPrivate } from '~/helpers';
import { configUrlApi } from '~/configs';
import { PropsLogin, PropsJwtRequest, PropsChangePassword } from '~/interfaces';
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
export const changePassword = async (id: number, params: PropsChangePassword): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.put<Object>(`${configUrlApi.changePassword}/${id}`, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const forgetPassword = async (id: number, password: string): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.put<Object>(
            `${configUrlApi.forgetPassword}/${id}`,
            {},
            { params: { password } },
        );
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const confirmCode = async (id: number, code: string): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(`${configUrlApi.confirmCode}/${id}`, {
            params: {
                code,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const sendCode = async (email: string): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.sendCode, {
            params: {
                email,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
