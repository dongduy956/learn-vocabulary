export interface RequestType {
    <T>(url: string, data?: Object): Promise<T>;
}
export interface RequestDataType {
    <T>(url: string, data: Object | Array<Object | Number>, config?: Object): Promise<T>;
}
