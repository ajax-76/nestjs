export class CreateUserModelDTO{
    constructor(
        public readonly name:string,
        public readonly email:string,
        public readonly expirationTime?: Date,
        public readonly accessKey?: string,
        public readonly rateLimit?: number,
        public readonly isEnable?:boolean,
    ){}
}

