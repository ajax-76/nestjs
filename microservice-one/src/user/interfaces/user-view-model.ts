export interface UserViewModel {
    id:string,
    name:string,
    email:string,
    accessKey?: string;
    rateLimit?: number;
    expirationTime?:Date;
    isEnable?:boolean;
 }