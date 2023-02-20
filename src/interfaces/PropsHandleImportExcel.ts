import ParamsSetTable from './ParamsSetTable';

export default interface PropsHandleImportExcel {
    <T extends Object, U extends undefined | Object>(
        type: string,
        setOpen: (a: boolean) => void,
        setData: (a: Array<T>) => void,
        setLoading: (a: boolean) => void,
        data: Array<T>,
        setTable?: (a: ParamsSetTable) => void,
        subData?: Array<U>,
    ): Promise<void>;
}
