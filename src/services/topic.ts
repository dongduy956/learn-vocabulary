import { httpRequestPrivate } from '~/helpers';
import { configUrlApi } from '~/configs';
import { PropsTopic } from '~/interfaces';
export const getAllTopics = async (): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getAllTopics);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const getAllTopicsPaging = async (page?: number, pageSize?: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.getAllTopicsPaging, {
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
export const searchTopics = async (q: string, page?: number, pagesize?: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.get<Object>(configUrlApi.searchTopics, {
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

export const insertTopic = async (params: PropsTopic): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.post<Object>(configUrlApi.insertTopic, {
            ...params,
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const insertRangeTopic = async (params: Array<PropsTopic>): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.post<Object>(configUrlApi.insertRangeTopic, [...params]);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const updateTopic = async (id: number, params: PropsTopic): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.put<Object>(`${configUrlApi.updateTopic}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
export const deleteTopic = async (id: number): Promise<Object | any> => {
    try {
        const res = await httpRequestPrivate.del<Object>(`${configUrlApi.deleteTopic}/${id}`);
        return res;
    } catch ({ response }: any) {
        return response;
    }
};
