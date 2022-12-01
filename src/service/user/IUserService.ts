import IUser from "../../utils/interface/IUser";
import { IRequest, IResponse } from "../../utils/enum/common";
import SuccessMsgEnum from "src/utils/enum/SuccessMsgEnum";
export interface IUserServiceAPI {
  register(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
  login(request: ILoginUserRequest): Promise<ILoginUserResponse>;
  get(request: IGetUserRequest): Promise<IGetUserResponse>;
  update(request: IUpdateUserRequest): Promise<IUpdateUserResponse>;
  delete(request: IDeleteUserRequest): Promise<IDeleteUserResponse>;
}

/********************************************************************************
 *  Authentication
 ********************************************************************************/

export interface IAuthenticateUserResponse extends IResponse {
  user?: IUser;
  token?: string;
}

/********************************************************************************
 *  Register
 ********************************************************************************/

export interface IRegisterUserRequest extends IRequest {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}
export interface IRegisterUserResponse extends IAuthenticateUserResponse {
  error?: any;
}

/********************************************************************************
 *  Login
 ********************************************************************************/

export interface ILoginUserRequest extends IRequest {
  email: string;
  password: string;
}

export interface ILoginUserResponse extends IAuthenticateUserResponse {
  error?: any;
  message?: SuccessMsgEnum;
}

/********************************************************************************
 *  Verify email
 ********************************************************************************/

export interface IVerifyUserEmailRequest extends IRequest {
  email: string;
}
export interface IVerifyUserEmailResponse extends IResponse {
  user?: IUser;
  error?: any;
}

/********************************************************************************
 *  Get User
 ********************************************************************************/

export interface IGetUserRequest extends IRequest {
  returnUser?: IUser;
  user?: IUser;
}

export interface IGetUserResponse extends IResponse {
  user?: IUser;
  error?: any;
}
/********************************************************************************
 *  Update User
 ********************************************************************************/

export interface IUpdateUserRequest extends IRequest {
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

export interface IUpdateUserResponse extends IResponse {
  user?: IUser;
  error?: any;
}

/********************************************************************************
 *  Delete User
 ********************************************************************************/

export interface IDeleteUserRequest extends IRequest {
  _id?: string;
}

export interface IDeleteUserResponse extends IResponse {
  error?: any;
  message?: SuccessMsgEnum;
}
