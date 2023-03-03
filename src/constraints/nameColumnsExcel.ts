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
    note: string;
};
export const topic: Topic = {
    name: 'Name',
};
export const word: Word = {
    en: 'En',
    vi: 'Vi',
    type: 'Type',
    topicName: 'Topic',
    note: 'Note',
};
