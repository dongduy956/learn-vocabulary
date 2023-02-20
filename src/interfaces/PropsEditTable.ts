import PropWithChildren from './PropWithChildren';

export default interface PropsEditTable<T extends Object> extends PropWithChildren {
    editing: boolean;
    dataIndex: Number;
    title: string;
    inputType: string;
    record: T;
    index: Number;
}
