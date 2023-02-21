import ParamsSetTable from './ParamsSetTable';

export default interface PropsHandleImportExcel {
    (
        type: string,
        setOpen: (a: boolean) => void,
        setData: (a: Array<Object>) => void,
        setLoading: (a: boolean) => void,
        data: Array<Object>,
        setTable?: (a?: ParamsSetTable) => void,
        subData?: Array<Object>,
    ): Promise<void>;
}
