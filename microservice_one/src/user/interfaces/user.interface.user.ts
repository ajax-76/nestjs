import { Document } from 'mongoose';

export interface User extends Document {
   name:string,
   email:string,
   accessKey?: string;
   rateLimit?: number;
   expirationTime?:Date;
   isEnable?:boolean;
}