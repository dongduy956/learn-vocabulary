import ParamsSetTable from './ParamsSetTable';
import PropsFormImport from './PropsFormImport';

export default interface PropsFormImportWord extends PropsFormImport {
    setTable: (params?: ParamsSetTable) => void;
}
