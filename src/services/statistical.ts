import { configUrlApi } from '~/configs';
import { httpRequestPublic } from '~/helpers';
export const getTopCustomer = async (): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.get<Object>(configUrlApi.getTopCustomer);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
