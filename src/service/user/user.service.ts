import StatusCodeEnum from "../../utils/enum/StatusCodeEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IUserService from "../../service/user/IUserService";
import { IAppServiceProxy } from "../AppServiceProxy";
import Joi from "joi";
import UserStore from "./user.store";
import IUser from "../../utils/interface/IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import { logger } from "../../utils/logger/logger";
import { Role } from "../../utils/enum/role";
import SuccessMsgEnum from "../../utils/enum/SuccessMsgEnum";

export default class UserService implements IUserService.IUserServiceAPI {
  private storage = new UserStore();
  public proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /*****Generate a Token*****/
  private generateJWT = (user: IUser): string => {
    let payLoad = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payLoad, JWT_SECRET);
  };

  /**
   * @param  {IUserService.IRegisterUserRequest} request
   * Desc: register a user
   * check wether user email already exists or not
   * @returns Promise
   */
  public register = async (
    request: IUserService.IRegisterUserRequest
  ): Promise<IUserService.IRegisterUserResponse> => {
    let response: IUserService.IRegisterUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required().length(10),
      password: Joi.string().required(),
      role: Joi.string().optional(),
    });
    const params = schema.validate(request, { abortEarly: false });
    if (params.error) {
      console.error(params.error);
      response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
      response.error = params.error;
      return response;
    }

    const { firstName, lastName, email, phoneNumber, password } = params.value;
    //hashing the password..
    const hashPassword = await bcrypt.hash(password, 10);
    const userAttributes = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashPassword,
      role: Role.Admin,
    };

     //check existing user...

     let existingUser: IUser;
     try {
       existingUser = await this.storage.findByEmail(email);
     } catch (e) {
      logger.error(e),
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = e
      return response;
     }
 
     if (existingUser && existingUser.email) {
      logger.error(ErrorMessageEnum.RECORD_NOT_FOUND);
      response={
        status : StatusCodeEnum.INTERNAL_SERVER_ERROR,
        error : ErrorMessageEnum.EMAIL_EXIST
      }
       return response;
     }
    let user: IUser;
//create user...
    try {
      user = await this.storage.register(userAttributes);
      if (!user) {
        logger.error(ErrorMessageEnum.RECORD_NOT_FOUND);
         response={
        status : StatusCodeEnum.INTERNAL_SERVER_ERROR,
        error : ErrorMessageEnum.RECORD_NOT_FOUND
      }
        return response;
        }
    } catch (e) {
      logger.error(e),
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = e
      return response;
    }
    response.status = StatusCodeEnum.OK;
    response.user = user;
    return response;
  };

  /**
   * @param  {IUserService.ILoginUserRequest} request
   * Desc: Login user using email and password
   * check email and password matched or not
   * @returns Promise
   */
  public login = async (
    request: IUserService.ILoginUserRequest
  ): Promise<IUserService.ILoginUserResponse> => {
    let response: IUserService.ILoginUserResponse;

    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const params = schema.validate(request);
    const { email, password } = params.value;

    if (params.error) {
      logger.error(params.error);
      response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
      response.error = params.error
       return response;
    }

    let user: IUser;
    // check if email exist or not...
    try {
      user = await this.storage.findByEmail(email);
    } catch (e) {
      logger.error(e),
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = e
      return response;
    }
    if (!user || !user.email) {
      logger.error(ErrorMessageEnum.INVALID_EMAIL),
      response={
        status : StatusCodeEnum.INTERNAL_SERVER_ERROR,
        error : ErrorMessageEnum.INVALID_EMAIL
      }
      return response;
    }
//check password...
    let isValid: boolean;
    let hashPassword = user.password;
    isValid = await bcrypt.compare(password, hashPassword);
    if (!isValid || !user.password) {
      logger.error(ErrorMessageEnum.INVALID_PASSWORD),
      response={
        status : StatusCodeEnum.INTERNAL_SERVER_ERROR,
        error : ErrorMessageEnum.INVALID_PASSWORD
      }
      return response;
    }
    response = {
      status: StatusCodeEnum.OK,
      token: this.generateJWT(user),
      user: user,
      message: SuccessMsgEnum.LOGIN_SUCCESSFUL,
    };
    return response;
  };

  /**
   * @param  {IUserService.IGetUserRequest} request
   * Desc: get user
   * @returns Promise
   */
  public get = async (
    request: IUserService.IGetUserRequest
  ): Promise<IUserService.IGetUserResponse> => {
    let response: IUserService.IGetUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    let user: IUser;

    try {
      user = await this.storage.get(request);
      if (!user) {
      logger.error(ErrorMessageEnum.RECORD_NOT_FOUND),
      response={
        status : StatusCodeEnum.NOT_FOUND,
        error : ErrorMessageEnum.RECORD_NOT_FOUND
      }
      }
    } catch (e) {
      logger.error(e),
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = e
      return response;
    }
    response.status = StatusCodeEnum.OK;
    response.user = user;
    return response;
  };

   /**
   * @param  {IUserService.IGetUserRequest} request
   * Desc: update user
   * @returns Promise
   */
    public update = async (
      request: IUserService.IUpdateUserRequest
    ): Promise<IUserService.IUpdateUserResponse> => {
      let response: IUserService.IUpdateUserResponse = {
        status: StatusCodeEnum.UNKNOWN_CODE,
      };
      const schema = Joi.object().keys({
        _id:Joi.string().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().optional().length(10),
        password: Joi.string().optional(),
      });
      const params = schema.validate(request, { abortEarly: false });
      if (params.error) {
        logger.error(params.error);
        response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
        response.error = params.error;
        return response;
      }
  
      const Id = request._id
      const { firstName, lastName, email, phoneNumber, password } = params.value;
      const userAttributes = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      };
       //check existing email...

     let existingUser: IUser;
     try {
       existingUser = await this.storage.findByEmail(email);
     } catch (e) {
       logger.error(e);
       response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
       response.error = e
       return response;
     }
 
     if (existingUser && existingUser.email) {
      logger.error(ErrorMessageEnum.EMAIL_EXIST),
      response={
        status : StatusCodeEnum.INTERNAL_SERVER_ERROR,
        error : ErrorMessageEnum.EMAIL_EXIST
      }
       return response;
     }
      let user: IUser;
      try {
        user = await this.storage.update(Id,userAttributes);
        if (!user) {
        logger.error(ErrorMessageEnum.RECORD_NOT_FOUND),
        response={
          status : StatusCodeEnum.NOT_FOUND,
          error : ErrorMessageEnum.RECORD_NOT_FOUND
        }
        return response;
      }
    } catch (e) {
    logger.error(e),
    response.status = StatusCodeEnum.NOT_FOUND;
    response.error = e;
    return response;
  }
    response.status = StatusCodeEnum.OK;
    response.user = user;
    return response;
};
  
     /**
   * @param  {IUserService.IGetUserRequest} request
   * Desc: delete user by id
   * @returns Promise
   */
  public delete = async (
    request: IUserService.IDeleteUserRequest
  ): Promise<IUserService.IDeleteUserResponse> => {
    let response: IUserService.IDeleteUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    let Id = request._id
    let user: IUser;

    try {
      user = await this.storage.delete(Id);
      if (!user) {
        logger.error(ErrorMessageEnum.RECORD_NOT_FOUND),
        response={
          status : StatusCodeEnum.NOT_FOUND,
          error : ErrorMessageEnum.RECORD_NOT_FOUND
        }
        return response;
      }
    } catch (e) {
      logger.error(e),
      response.status = StatusCodeEnum.NOT_FOUND;
      response.error = e;
      return response;
    }
    response.status = StatusCodeEnum.OK;
    response.message = SuccessMsgEnum.USER_DELETE;
    return response;
  };
}
