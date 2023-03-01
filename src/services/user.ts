import { httpRequestPublic } from '~/helpers';
import { configUrlApi } from '~/configs';
import { PropsUser } from '~/interfaces';
export const registerUser = async (params: PropsUser): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.registerUser, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const updateUser = async (id: number, params: PropsUser): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.put<Object>(`${configUrlApi.updateUser}/${id}`, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const deleteUser = async (id: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.del<Object>(`${configUrlApi.deleteUser}/${id}`);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
