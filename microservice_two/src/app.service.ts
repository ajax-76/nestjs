import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
@Injectable()
export class AppService {
  constructor(){}
  async getTokenInFormation(tokenAddress:string){
      return {
        tokenName:"SOMETOKEN",
        tokenAddress:tokenAddress,
        decimalPoints:10,
        symbol:'SOM',
      }
  }  
}
