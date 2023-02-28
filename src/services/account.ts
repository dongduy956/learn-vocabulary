import { httpRequestPublic } from '~/helpers';
import { configUrlApi } from '~/configs';
import { PropsAccount } from '~/interfaces';
export const registerAccount = async (params: PropsAccount): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.registerAccount, params);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
