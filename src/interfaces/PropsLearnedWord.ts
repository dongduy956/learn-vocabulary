import PropsBaseEntity from './PropsBaseEntity';
import PropsWord from './PropsWord';

export default interface PropsLearnedWord extends PropsBaseEntity {
    accountId: number;
    fullName?: string;
    wordId: number;
    wordModel?: PropsWord;
    correct?: boolean;
    input: string;
    rand: number;
}
