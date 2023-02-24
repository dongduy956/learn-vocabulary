import ParamsSetTable from './ParamsSetTable';
import PropsFormImport from './PropsFormImport';

export default interface PropsFormImportTopic extends PropsFormImport {
    setTable: (params?: ParamsSetTable) => void;
}
