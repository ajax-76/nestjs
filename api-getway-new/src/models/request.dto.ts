export class CreateUserRequest{
    name:string;
    email:string;
}

export class GenerateKeyRequestObject{
    expirationTime:string;
    rateLimit:number;
}