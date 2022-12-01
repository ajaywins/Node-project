export default interface IUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password?: string;
  role?: string;
  delete?:boolean
}
