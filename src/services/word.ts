import { configUrlApi } from '~/configs';
import { httpRequestPublic } from '~/helpers';
import { PropsWord } from '~/interfaces';
export const getAllWordsPaging = async (page?: number, pagesize?: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.get<Object>(configUrlApi.getAllWordsPaging, {
            params: {
                page,
                pagesize,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getAllWords = async (): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.get<Object>(configUrlApi.getAllWords);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getWordsByTopicId = async (topicId: number, page?: number, pagesize?: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.get<Object>(configUrlApi.getWordsByTopicId, {
            params: {
                topicId,
                page,
                pagesize,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const searchWords = async (q: string, page: number, pagesize: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.get<Object>(configUrlApi.searchWords, {
            params: {
                q,
                page,
                pagesize,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};

export const insertWord = async (params: PropsWord): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.insertWord, {
            ...params,
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const insertRangeWord = async (params: Array<PropsWord>): Promise<Object | any> => {
    try {
        const res = await httpRequestPublic.post<Object>(configUrlApi.insertRangeWord, [...params]);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
