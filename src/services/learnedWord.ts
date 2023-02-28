import { configUrlApi } from '~/configs';
import { httpRequestPrivate } from '~/helpers';
import { PropsLearnedWord } from '~/interfaces';
export const getAllLearnedWords = async (accountId: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(`${configUrlApi.getAllLearnedWords}/${accountId}`);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getAllIncorrectLearnedWords = async (accountId: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(`${configUrlApi.getAllIncorrectLearnedWords}/${accountId}`);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getAllLearnedWordsPaging = async (
    accountId: number,
    page?: number,
    pageSize?: number,
): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(`${configUrlApi.getAllLearnedWordsPaging}/${accountId}`, {
            params: {
                page,
                pageSize,
            },
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const searchLearnedWords = async (
    accountId: number,
    q: string,
    page?: number,
    pagesize?: number,
): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(`${configUrlApi.searchLearnedWords}/${accountId}`, {
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

export const insertRangeLearnedWord = async (params: Array<PropsLearnedWord>): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.post<Object>(configUrlApi.insertRangeLearnedWord, [...params]);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const updateRangeLearnedWord = async (params: Array<PropsLearnedWord>): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.put<Object>(configUrlApi.updateRangeLearnedWord, [...params]);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
