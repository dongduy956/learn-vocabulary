import { httpRequestPublic } from '~/helpers';
import { configUrlApi } from '~/configs';
export const uploadImage = async (formData: FormData, config: any): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.uploadImage, formData, config);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
