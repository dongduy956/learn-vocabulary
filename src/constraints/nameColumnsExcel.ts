export type typeNameColumnsExcel = 'topic' | 'word';
export type typeNameObject = 'name' & ('vi' | 'en' | 'topicName' | 'type');

type Topic = {
    name: string;
};
type Word = {
    en: string;
    vi: string;
    type: string;
    topicName: string;
};
export const topic: Topic = {
    name: 'Tên chủ đề',
};
export const word: Word = {
    en: 'Tiếng Anh',
    vi: 'Tiếng Việt',
    type: 'Loại từ',
    topicName: 'Chủ đề',
};
