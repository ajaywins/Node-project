import { Document, Schema, Model, model } from "mongoose";
import IUser from "../../utils/interface/IUser";
import UserMongo from "../../model/user.model";
import bcrypt from "bcrypt";

export interface IUserModel extends IUser, Document {
  _id: string;
}
export const UserSchema = new Schema(UserMongo, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

export default class UserStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * @param  {string} email
   * Desc: Find user by email id
   * @returns Promise
   */
  public async findByEmail(email: string): Promise<any> {
    let user: IUser;
    try {
      user = await User.findOne({
        email,
      });
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
    return user;
  }

  /**
   * @param  {any} attribute
   * @returns Promise Register user
  */
  public async register(attribute: any): Promise<any> {
    let user: IUser;
    try {
      user = await User.create(attribute);
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
    return user;
  }
  /**
   * @param {any} attribute
   * @returns Promise get user
   */
  public async get(attribute: any): Promise<IUser> {
    let user: IUser;
    try {
      user = await User.findOne(attribute);
    } catch (e) {
      console.log(e);
      
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
    return user;
  }

  /** 
   * @param  {any} attribute
   * @returns Promise update user
   */
     public async update(id:string,attribute: any): Promise<IUser> {
      let user: IUser;
      try {
        user = await User.findByIdAndUpdate(id,attribute,{new:true});
      } catch (e) {
        console.log(e);
        
        return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
      }
      return user;
    }

  /** 
   * @param  {string} _id
   * @returns Promise delete user
   */
       public async delete(_id:string): Promise<IUser> {
        let user: IUser;
        try {
          user = await User.findByIdAndDelete(_id);
        } catch (e) {
          console.log(e);
          
          return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
        }
        return user;
      }
}
