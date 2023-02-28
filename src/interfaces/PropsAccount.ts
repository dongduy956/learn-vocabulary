import PropsBaseEntity from './PropsBaseEntity';
export default interface PropsAccount extends PropsBaseEntity {
    username: string;
    isLock: boolean;
    userId: number;
}
