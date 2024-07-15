import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class AppService {

  constructor(@Inject('MICROSERVICE_ONE')private readonly communicationProxy:ClientProxy,
  @Inject('MICROSERVICE_TWO')private readonly communicationProxyForToken:ClientProxy){}
 

  async getAccessKey(accessKey:string){
    try{
      return await lastValueFrom(this.communicationProxy.send({ cmd: 'fetch-access-plan' },
        { accessKey}));
    }
    catch(err){
      throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });

    }
  }
 
  async getTokenInfo(accessKey:string,tokenAddress:string){
    try{
      return await lastValueFrom(this.communicationProxyForToken.send({ cmd: 'token-information' },
        { tokenAddress}));
    }
    catch(err){
      throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' });
    }
  }


  async disableAccess(accessKey:string,access:boolean){
    try{
      return await  lastValueFrom(this.communicationProxy.send({ cmd: 'disable-access-key' },
        { accessKey,access}));
    }
    catch(err){
      throw new BadRequestException('Something went wrong', { cause: new Error(), description: 'Some error description' });
    }
  }


  sendDataMS2(){
    this.communicationProxyForToken.emit('ms_2','hello message')
  }
}
