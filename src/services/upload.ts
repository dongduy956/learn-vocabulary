import { httpRequestPublic } from '~/helpers';
import { configUrlApi } from '~/configs';
export const uploadImage = async (formData: FormData): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.uploadImage, formData);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
