import * as IUserService from "../../service/user/IUserService";
import proxy from "../../service/AppServiceProxy";
import { Response } from "../../utils/enum/ResponseCheck";
import StatusCodeEnum from "../../utils/enum/StatusCodeEnum";
import { useAuthValidator } from "../../middleware/authValidator";

export const resolver = {
  Query: {
    async login(parent: any, args: any, context: any) {
      const { email, password } = args;

      const request: IUserService.ILoginUserRequest = {
        email,
        password,
      };

      let response: IUserService.ILoginUserResponse = {
        status: StatusCodeEnum.UNKNOWN_CODE,
      };

      try {
        response = await proxy.user.login(request);
        Response.checkStatus(response);
      } catch (e) {
        Response.catchThrow(e);
      }

      return response;
    },
    async getUser(parent: any, args: any, context: any) {
      useAuthValidator(context);
      let returnUser = context.req.currentUser;

      const request: IUserService.IGetUserRequest = returnUser;
      let response: IUserService.IGetUserRequest;
      try {
        response = await proxy.user.get(request);
        Response.checkStatus(response);
      } catch (e) {
        Response.catchThrow(e);
      }
      return response;
    },
  },
  Mutation: {
    async register(parent: any, args: any, context: any) {
      const { firstName, lastName, email, phoneNumber, password, role } =
        args.params;

      const request: IUserService.IRegisterUserRequest = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
      };
      let response: IUserService.IRegisterUserResponse = {
        status: StatusCodeEnum.UNKNOWN_CODE,
      };

      try {
        response = await proxy.user.register(request);
        Response.checkStatus(response);
      } catch (e) {
        Response.catchThrow(e);
      }
      return response?.user;
    },
    async update(parent: any, args: any, context: any) {
      // useAuthValidator(context);
      const {_id,firstName,lastName,phoneNumber,email} = args.params;
      const request: IUserService.IUpdateUserRequest = {
        _id,
        firstName,
        lastName,
        phoneNumber,
        email
      };
      let response: IUserService.IUpdateUserResponse = {
        status: StatusCodeEnum.UNKNOWN_CODE,
      };
      try {
        response = await proxy.user.update(request);
        Response.checkStatus(response);
      } catch (e) {
        Response.catchThrow(e);
      }
      return response?.user;
    },
  async delete(parent: any, args: any, context: any) {
    // useAuthValidator(context);
    const {_id} = args;
    const request: IUserService.IDeleteUserRequest = {
      _id,
    };
    let response: IUserService.IDeleteUserResponse = 
    {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    try {
      response = await proxy.user.delete(request);
      Response.checkStatus(response);
    } catch (e) {
      Response.catchThrow(e);
    }
    return response;
  },
 },
}

