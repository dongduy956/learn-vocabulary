import { configUrlApi } from '~/configs';
import { httpRequestPrivate } from '~/helpers';
import { PropsWord } from '~/interfaces';
export const getAllWordsPaging = async (page?: number, pagesize?: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getAllWordsPaging, {
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
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getAllWords);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getWordsByTopicId = async (topicId: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getWordsByTopicId, {
            params: {
                topicId,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getWordsByTopicIdPaging = async (
    topicId: number,
    page?: number,
    pagesize?: number,
): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getWordsByTopicIdPaging, {
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
export const searchWords = async (q: string, page?: number, pagesize?: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.searchWords, {
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
        const res = await httpRequestPrivate.post<Object>(configUrlApi.insertWord, {
            ...params,
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const insertRangeWord = async (params: Array<PropsWord>): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.post<Object>(configUrlApi.insertRangeWord, [...params]);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const deleteWord = async (id: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.del<Object>(`${configUrlApi.deleteWord}/${id}`);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const updateWord = async (id: number, params: PropsWord): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.put<Object>(`${configUrlApi.updateWord}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
