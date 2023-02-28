import PropsBaseEntity from './PropsBaseEntity';
export default interface PropsUser extends PropsBaseEntity {
    fullName: string;
    email: string;
    avatar?: string;
}
