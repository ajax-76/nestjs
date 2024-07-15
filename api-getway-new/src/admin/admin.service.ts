import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateUserRequest, GenerateKeyRequestObject } from 'src/models/request.dto';
import { UserViewModel } from 'src/models/user-view-model';

@Injectable()
export class AdminService {
    constructor(@Inject('MICROSERVICE_ONE')private readonly communicationProxy:ClientProxy){}
    
    async createUser(createUserObjectRequest:CreateUserRequest):Promise<UserViewModel>{
        return await  lastValueFrom(this.communicationProxy.send({cmd:'create-user'},createUserObjectRequest));
      }
      async listUser():Promise<UserViewModel[]>{
       try{
        return await lastValueFrom(this.communicationProxy.send({cmd:'list-users'},''))
       }
       catch(err){
        throw new BadRequestException('user list fetch error', { cause: new Error(), description: 'user list fetch error' });
       }
      }
      async deletekey(userId:string):Promise<UserViewModel>{
       try{
        return await lastValueFrom(this.communicationProxy.send({ cmd: 'delete-key' }, { userId }));
       }
       catch(err){
        throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });
    
       }
      }
    
      async updateRateLimit(userId:string,rateLimit: number):Promise<UserViewModel>{
       try{
        return await lastValueFrom(this.communicationProxy.send({ cmd: 'update-rate-limit' },
          { userId ,rateLimit}));
       }
       catch(err){
        throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });
    
       }
      }
    
      async updateExpirationTime(userId:string,expirationTime: Date):Promise<UserViewModel>{
        try{
          return await lastValueFrom(this.communicationProxy.send({ cmd: 'update-expiration-time' },
            { userId ,expirationTime}));
        }
        catch(err){
          throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });
    
        }
      }
      async disableAccess(accessKey:string,access:boolean):Promise<UserViewModel>{
        try{
          return await  lastValueFrom(this.communicationProxy.send({ cmd: 'disable-access-key' },
            { accessKey,access}));
        }
        catch(err){
          throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });
        }
      }
    
      async generateKey(userId:string,generateAccessKeyObject:GenerateKeyRequestObject):Promise<UserViewModel>{
        try{
          return lastValueFrom(this.communicationProxy.send({ cmd: 'generate-key' }, 
            { userId: userId, 
              expirationTime: new Date(generateAccessKeyObject.expirationTime) , 
              rateLimit:generateAccessKeyObject.rateLimit}));
        }
        catch(err){
          throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });
        }
      }
}
