import { CreateUserModelDTO } from 'src/models/user-event-model';
import { User } from './user.interface.user';
export interface IUserService {
  create(user: CreateUserModelDTO): Promise<User>;
  listUsers():Promise<User[]>;
  deleteKey(userId:string):Promise<User>;
  generateKeyAndRateLimit(userId:string,expirationTime:Date,rateLimit:number):Promise<User>;
  updateRateLimit(userId:string,rateLimit:number):Promise<User>;
  updateExpirationTime(userId:string,expirationTime:Date):Promise<User>;
  fetchAccessPlan(accessKey:string):Promise<User>;
  disableEnableAccessKey(accessKey:string,access:boolean):Promise<User>;
}