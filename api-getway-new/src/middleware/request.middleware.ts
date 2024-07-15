import { HttpException, HttpStatus, Inject, NestMiddleware } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { UserViewModel } from "src/models/user-view-model";
import { TokenBucketService } from "src/app-services/tokenBucketRateLimitter";
export class RequestValidationMiddleware  implements NestMiddleware{
    constructor(@Inject('MICROSERVICE_ONE')private readonly communicationProxy:ClientProxy,
     private readonly tokenService: TokenBucketService){
    }
    async use(req: any, res: any, next: (error?: any) => void) {
        console.log(req.query);
        const accessKey=req.query.accessKey;
        let userObjectAccessPlan: UserViewModel;
        try{
          userObjectAccessPlan= await lastValueFrom(
            this.communicationProxy.send({ cmd: 'fetch-access-plan' },
            { accessKey}));
        }
        catch(err){
          throw new HttpException('access key do not exist',HttpStatus.NOT_FOUND) 
        }

        console.log(`user intercept ${JSON.stringify(userObjectAccessPlan)}`)
        // can add on throttler here 
        this.ValidationCheck(userObjectAccessPlan)
        const limit = userObjectAccessPlan.rateLimit
        const throttleKey =`user:${userObjectAccessPlan.accessKey}`
        console.log('Checking the request rate')
        if (await this.tokenService.TokenBucketTakeToken(throttleKey,10,limit)) {
          // loggging the success
           this.logger(true,accessKey,'request successfully processed')
          next();
        } else {
            this.logger(false,accessKey,'request is rate limited')
            console.log('throttle exception')
            throw new HttpException('too many requests',HttpStatus.BAD_REQUEST);
        }
    }

     private logger(success:boolean,accessKey:string,message:string){
      console.log(`${message }: ${JSON.stringify({
        accessKey:accessKey,
        timeStamp:new Date().toLocaleDateString(),
        success:success,
      })}`)
     }
     private ValidationCheck(userObjectAccessPlan?: UserViewModel){
        if(userObjectAccessPlan===undefined){
        
            throw new HttpException('access key do not exist',HttpStatus.NOT_FOUND) 
        }
        if(userObjectAccessPlan.isEnable!==undefined && userObjectAccessPlan.isEnable===false){
         
          throw new HttpException('access key is disbaled',HttpStatus.BAD_REQUEST) 
        }
        const expirationTime = new Date(userObjectAccessPlan.expirationTime)
        console.log(`expirationTime : ${expirationTime} : ${Date.now()}`)
        if(expirationTime!==undefined && this.isExpired(expirationTime.getTime())){
  
            throw new HttpException('access key is expired',HttpStatus.BAD_REQUEST) 
        }
      }
    
      private isExpired(targetTimestamp:number) {
        const now = Date.now(); 
        return now > targetTimestamp;
      }
    
}
