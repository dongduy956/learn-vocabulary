import { configUrlApi } from '~/configs';
import { httpRequestPrivate } from '~/helpers';
export const getTopCustomer = async (): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getTopCustomer);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
