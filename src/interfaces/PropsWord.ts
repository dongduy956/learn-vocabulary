import PropsBaseEntity from './PropsBaseEntity';

export default interface PropsWord extends PropsBaseEntity {
    en: string;
    vi: string;
    topicId: number;
    topicName?: string;
    type: string;
}
