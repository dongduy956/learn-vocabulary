import PropsPagination from './PropsPagination';

export default interface ParamsSetTable {
    page?: number;
    pageSize?: number;
    searchText?: string;
    pagination?: PropsPagination;
}
