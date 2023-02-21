import ParamsSetTable from './ParamsSetTable';
export default interface PropsImportExcel {
    title: string;
    type: string;
    open: boolean;
    setOpen: (a: boolean) => void;
    setTable: (a?: ParamsSetTable) => void;
}
