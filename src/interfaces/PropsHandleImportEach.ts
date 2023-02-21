import ParamsSetTable from './ParamsSetTable';

export default interface PropsHandleImportEach<T extends Object> {
    (
        data: Array<T>,
        setOpen: (a: boolean) => void,
        setData: (a: Array<T>) => void,
        setLoading: (a: boolean) => void,
        setTable?: (a?: ParamsSetTable) => void,
    ): Promise<void>;
}
