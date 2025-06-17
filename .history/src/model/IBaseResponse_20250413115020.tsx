export interface IBaseResponse<T> {
    success: boolean;
    message: string;
    code: number;
    data: T;
    fields: string[];
}