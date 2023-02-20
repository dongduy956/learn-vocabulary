import ParamsSetTable from './ParamsSetTable';

export default interface PropsHandleWord {
    <T>(
        data: Array<T>,
        setOpen: (a: boolean) => void,
        setData: (a: Array<T>) => void,
        setLoading: (a: boolean) => void,
        setTable?: (a: ParamsSetTable) => void,
    ): Promise<void>;
}
