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
