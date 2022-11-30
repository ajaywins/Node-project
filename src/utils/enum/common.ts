import StatusCodeEnum from './StatusCodeEnum';
import SuccessMsgEnum from './SuccessMsgEnum';

export interface IRequest { }

export interface IResponse {
    status?: StatusCodeEnum;
    error?: IError;
    message?:SuccessMsgEnum
}

export interface IError {
    message: string
}

// export function toError(message: string): IError {
//     const error: IError = {
//         message,
//     };
//     return error;
// }
