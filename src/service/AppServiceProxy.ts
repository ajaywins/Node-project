import * as IUserService from "../service/user/IUserService";

import UserService from "./user/user.service";

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
}
class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;

  constructor() {
    this.user = new UserService(this);
  }
}

export default new AppServiceProxy();
